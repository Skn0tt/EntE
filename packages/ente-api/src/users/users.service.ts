import { Injectable, Inject, OnModuleInit } from "@nestjs/common";
import { Validation, Success, Fail } from "monet";
import { UserRepo } from "../db/user.repo";
import {
  Roles,
  UserDto,
  CreateUserDto,
  PatchUserDto,
  isValidUuid,
  Languages,
  languagesArr,
  TEACHING_ROLES,
  roleIsTeaching,
  PatchUserDtoValidator,
  CreateUserDtoValidator,
  BaseUserDto,
  BlackedUserDto
} from "ente-types";
import { PasswordResetService } from "../password-reset/password-reset.service";
import * as _ from "lodash";
import { hashPasswordsOfUsers } from "../helpers/password-hash";
import { WinstonLoggerService } from "../winston-logger.service";
import { RequestContextUser } from "../helpers/request-context";
import { PaginationInformation } from "../helpers/pagination-info";
import { InstanceConfigService } from "../instance-config/instance-config.service";

export enum CreateUsersFailure {
  UserAlreadyExists,
  ForbiddenForUser,
  ChildrenNotFound,
  IllegalDtos
}

export enum PatchUserFailure {
  UserNotFound,
  ForbiddenForRole,
  IllegalPatch,
  ChildrenNotFound
}

export enum FindAllUsersFailure {
  ForbiddenForRole
}

export enum FindOneUserFailure {
  UserNotFound,
  ForbiddenForUser
}

export enum DeleteUserFailure {
  UserNotFound,
  ForbiddenForRole
}

export enum SetLanguageFailure {
  UserNotFound,
  ForbiddenForUser,
  IllegalLanguage
}

export enum InvokeInvitationEmailFailure {
  UserNotFound,
  ForbiddenForUser
}

export enum UpdateManagerNotesFailure {
  StudentNotFound,
  ForbiddenForUser
}

export enum PromoteTeacherFailure {
  TeacherNotFound,
  ForbiddenForUser
}

export enum DemoteManagerFailure {
  ManagerNotFound,
  ForbiddenForUser
}

@Injectable()
export class UsersService implements OnModuleInit {
  constructor(
    @Inject(UserRepo) private readonly userRepo: UserRepo,
    @Inject(PasswordResetService)
    private readonly passwordResetService: PasswordResetService,
    @Inject(WinstonLoggerService) private readonly logger: WinstonLoggerService,
    @Inject(InstanceConfigService)
    private readonly instanceConfigService: InstanceConfigService
  ) {}

  async onModuleInit() {
    const admins = await this.userRepo.findByRole(Roles.ADMIN);
    const noAdminFound = admins.length === 0;
    if (noAdminFound) {
      this.logger.log("No admin user found. Creating one.");

      const admin = {
        children: [],
        role: Roles.ADMIN,
        displayname: "Administrator",
        birthday: undefined,
        password: "root",
        username: "admin",
        email: "admin@ente.de"
      };

      const [created] = await this._createUsers(admin);

      this.logger.log(
        `Created admin user. Credentials: ${created.username}:${admin.password}`
      );
    }
  }

  private async _findAll(
    requestingUser: RequestContextUser,
    paginationInfo: PaginationInformation
  ): Promise<Validation<FindAllUsersFailure, UserDto[]>> {
    switch (requestingUser.role) {
      case Roles.ADMIN:
        return Success(await this.userRepo.findAll(paginationInfo));

      case Roles.MANAGER:
        const user = (await requestingUser.getDto()).some();
        const students = await this.userRepo.findByGraduationYear(
          user.graduationYear!
        );
        return Success([...students, user]);

      case Roles.PARENT:
        const children = await this.userRepo.findByIds(
          ...requestingUser.childrenIds
        );
        const teachingUsers = await this.userRepo.findByRoles(
          ...TEACHING_ROLES
        );
        return Success([
          ...children,
          ...teachingUsers,
          (await requestingUser.getDto()).some()
        ]);

      case Roles.STUDENT:
        return Success([
          ...(await this.userRepo.findByRoles(...TEACHING_ROLES)),
          (await requestingUser.getDto()).some()
        ]);

      case Roles.TEACHER:
        return Success([(await requestingUser.getDto()).some()]);
    }
  }

  public async findAll(
    requestingUser: RequestContextUser,
    paginationInfo: PaginationInformation
  ) {
    const r = await this._findAll(requestingUser, paginationInfo);
    return r.map(users =>
      users.map(u => UsersService.blackenDto(u, requestingUser.role))
    );
  }

  private async _findOne(
    id: string,
    _requestingUser: RequestContextUser
  ): Promise<Validation<FindOneUserFailure, UserDto>> {
    switch (_requestingUser.role) {
      case Roles.TEACHER:
        return Fail(FindOneUserFailure.ForbiddenForUser);

      case Roles.PARENT:
        const requestingOneSelf = id === _requestingUser.id;
        const requestingChild = _requestingUser.childrenIds.includes(id);
        if (!(requestingOneSelf || requestingChild)) {
          return Fail(FindOneUserFailure.ForbiddenForUser);
        }
        break;
    }

    const user = await this.userRepo.findById(id);
    return await user.cata<Promise<Validation<FindOneUserFailure, UserDto>>>(
      async () => Fail(FindOneUserFailure.UserNotFound),
      async u => {
        const requestingOneSelf = id === _requestingUser.id;
        if (requestingOneSelf) {
          return Success(u);
        }

        switch (_requestingUser.role) {
          // Already Checked for Parent above
          case Roles.PARENT: {
            const isChild = _requestingUser.childrenIds.includes(u.id);
            const isTeaching = roleIsTeaching(u.role);

            return isChild || isTeaching
              ? Success(u)
              : Fail(FindOneUserFailure.ForbiddenForUser);
          }

          case Roles.MANAGER:
            const requestingUser = (await _requestingUser.getDto()).some();
            const isManagersYear =
              u.graduationYear === requestingUser.graduationYear!;
            return isManagersYear
              ? Success(u)
              : Fail(FindOneUserFailure.ForbiddenForUser);

          case Roles.ADMIN:
            return Success(u);

          case Roles.STUDENT: {
            const isTeaching = roleIsTeaching(u.role);
            return isTeaching
              ? Success(u)
              : Fail(FindOneUserFailure.ForbiddenForUser);
          }
        }

        throw new Error("Not reachable");
      }
    );
  }

  public async findOne(id: string, requestingUser: RequestContextUser) {
    const r = await this._findOne(id, requestingUser);
    return r.map(r => UsersService.blackenDto(r, requestingUser.role));
  }

  private async _createUsers(...users: CreateUserDto[]) {
    const defaultLanguage = await this.instanceConfigService.getDefaultLanguage();

    const withHash = await hashPasswordsOfUsers(...users);
    const created = await this.userRepo.create(defaultLanguage, ...withHash);

    const usersWithoutPassword = created.filter(created => {
      const hasPasswordSet = !!users.find(u => created.username === u.username)!
        .password;
      return !hasPasswordSet;
    });

    usersWithoutPassword.forEach(user => {
      this.passwordResetService.invokeInvitationRoutine(user);
    });

    return created;
  }

  async createUsers(
    users: CreateUserDto[],
    requestingUser: RequestContextUser
  ): Promise<Validation<CreateUsersFailure, UserDto[]>> {
    const userIsAdmin = requestingUser.role === Roles.ADMIN;
    if (!userIsAdmin) {
      return Fail(CreateUsersFailure.ForbiddenForUser);
    }

    const dtosValid = users.every(CreateUserDtoValidator.validate);
    if (!dtosValid) {
      return Fail(CreateUsersFailure.IllegalDtos);
    }

    const studentUsernamesToCreate = users
      .filter(u => u.role === Roles.STUDENT)
      .map(u => u.username);

    const children = _.flatMap(users, u => u.children);
    const [uuids, usernames] = _.partition(children, isValidUuid);

    const uuidsExist = await this.userRepo.hasUsersWithRole(
      [Roles.STUDENT],
      ...uuids
    );
    if (!uuidsExist) {
      return Fail(CreateUsersFailure.IllegalDtos);
    }

    const usernamesNotFromCreation = _.difference(
      usernames,
      studentUsernamesToCreate
    );
    const usernamesNotFromCreationExist = await this.userRepo.hasUsersWithRole(
      [Roles.STUDENT],
      ...usernamesNotFromCreation
    );
    if (!usernamesNotFromCreationExist) {
      return Fail(CreateUsersFailure.IllegalDtos);
    }

    const created = await this._createUsers(...users);

    this.logger.log(
      `User ${
        requestingUser.username
      } successfully created users ${JSON.stringify(
        created.map((c: UserDto) => c.username)
      )}`
    );

    return Success(created);
  }

  async setLanguage(
    id: string,
    language: Languages,
    requestingUser: RequestContextUser
  ): Promise<Validation<SetLanguageFailure, true>> {
    const isValidLanguage = languagesArr.includes(language);
    if (!isValidLanguage) {
      return Fail(SetLanguageFailure.IllegalLanguage);
    }

    const isAdmin = requestingUser.role === Roles.ADMIN;
    const isRequestingUser = requestingUser.id === id;
    if (!(isAdmin || isRequestingUser)) {
      return Fail(SetLanguageFailure.ForbiddenForUser);
    }

    const result = await this.userRepo.setLanguage(id, language);

    return result.cata<Validation<SetLanguageFailure, true>>(
      () => Fail(SetLanguageFailure.UserNotFound),
      () => Success<SetLanguageFailure, true>(true)
    );
  }

  private async patchOneSelf(
    patch: PatchUserDto,
    requestingUser: RequestContextUser
  ): Promise<Validation<PatchUserFailure, UserDto>> {
    const { id } = requestingUser;
    const user = (await requestingUser.getDto()).some();

    if (!!patch.language) {
      await this.userRepo.setLanguage(id, patch.language);
      user.language = patch.language;
    }

    if (!_.isUndefined(patch.subscribedToWeeklySummary)) {
      await this.userRepo.setSubscribedToWeeklySummary(
        id,
        patch.subscribedToWeeklySummary
      );
      user.subscribedToWeeklySummary = patch.subscribedToWeeklySummary;
    }

    return Success(user);
  }

  async patchUser(
    id: string,
    patch: PatchUserDto,
    requestingUser: RequestContextUser
  ): Promise<Validation<PatchUserFailure, UserDto>> {
    const dtoIsLegal = PatchUserDtoValidator.validate(patch);
    if (!dtoIsLegal) {
      return Fail(PatchUserFailure.IllegalPatch);
    }

    if (requestingUser.id === id) {
      return await this.patchOneSelf(patch, requestingUser);
    }

    const userIsAdmin = requestingUser.role === Roles.ADMIN;
    if (!userIsAdmin) {
      return Fail(PatchUserFailure.ForbiddenForRole);
    }

    const user = await this.userRepo.findById(id);
    if (user.isNone()) {
      return Fail(PatchUserFailure.UserNotFound);
    }

    if (!!patch.displayname) {
      await this.userRepo.setDisplayName(id, patch.displayname);
      user.some().displayname = patch.displayname;
    }

    if (!!patch.username) {
      await this.userRepo.setUsername(id, patch.username);
      user.some().username = patch.username;
    }

    if (!!patch.birthday) {
      await this.userRepo.setBirthday(id, patch.birthday);
      user.some().birthday = patch.birthday;
    }

    if (!!patch.email) {
      await this.userRepo.setEmail(id, patch.email);
      user.some().email = patch.email;
    }

    if (!!patch.graduationYear) {
      await this.userRepo.setYear(id, patch.graduationYear);
      user.some().graduationYear = patch.graduationYear;
    }

    if (!!patch.language) {
      await this.userRepo.setLanguage(id, patch.language);
      user.some().language = patch.language;
    }

    if (!!patch.children) {
      const childrenExist = this.userRepo.hasUsersWithRole(
        [Roles.STUDENT],
        ...patch.children
      );

      if (!childrenExist) {
        return Fail(PatchUserFailure.ChildrenNotFound);
      }

      await this.userRepo.setChildren(id, patch.children);

      const children = await this.userRepo.findByIds(...patch.children);
      user.some().children = children;
    }

    this.logger.log(
      `User ${requestingUser.username} successfully patched ${
        user.some().username
      }: ${JSON.stringify(patch)}`
    );

    return Success(user.some());
  }

  async delete(
    id: string,
    requestingUser: RequestContextUser
  ): Promise<Validation<DeleteUserFailure, UserDto>> {
    if (requestingUser.role !== Roles.ADMIN) {
      return Fail(DeleteUserFailure.ForbiddenForRole);
    }

    const userV = await this._findOne(id, requestingUser);
    if (userV.isFail()) {
      switch (userV.fail()) {
        case FindOneUserFailure.ForbiddenForUser:
          return Fail(DeleteUserFailure.ForbiddenForRole);
        case FindOneUserFailure.UserNotFound:
          return Fail(DeleteUserFailure.UserNotFound);
      }
    }

    await this.userRepo.delete(id);

    this.logger.log(
      `User "${requestingUser.username}" successfully deleted user "${
        userV.success().username
      }"`
    );

    return Success(userV.success());
  }

  async invokeInvitationRoutine(
    id: string,
    requestingUser: RequestContextUser
  ): Promise<Validation<InvokeInvitationEmailFailure, true>> {
    if (requestingUser.role !== Roles.ADMIN) {
      return Fail(InvokeInvitationEmailFailure.ForbiddenForUser);
    }

    const user = await this.userRepo.findById(id);
    return await user.cata<
      Promise<Validation<InvokeInvitationEmailFailure, true>>
    >(
      async () => Fail(InvokeInvitationEmailFailure.UserNotFound),
      async userDto => {
        await this.passwordResetService.invokeInvitationRoutine(userDto);

        return Success<InvokeInvitationEmailFailure, true>(true);
      }
    );
  }

  async updateManagerNotes(
    studentId: string,
    newNotesValue: string,
    requestingUser: RequestContextUser
  ): Promise<Validation<UpdateManagerNotesFailure, true>> {
    if (requestingUser.role !== Roles.MANAGER) {
      return Fail(UpdateManagerNotesFailure.ForbiddenForUser);
    }

    const requestingUserDto = await requestingUser.getDto();
    if (requestingUserDto.isNone()) {
      return Fail(UpdateManagerNotesFailure.ForbiddenForUser);
    }

    const {
      graduationYear: gradYearOfRequestingManager
    } = requestingUserDto.some();

    const user = await this.userRepo.findById(studentId);

    return await user.cata<
      Promise<Validation<UpdateManagerNotesFailure, true>>
    >(
      async () => Fail(UpdateManagerNotesFailure.StudentNotFound),
      async userDto => {
        const isStudentOfManager =
          userDto.graduationYear === gradYearOfRequestingManager;
        if (!isStudentOfManager) {
          return Fail(UpdateManagerNotesFailure.ForbiddenForUser);
        }

        await this.userRepo.setManagerNotes(studentId, newNotesValue);

        return Success<UpdateManagerNotesFailure, true>(true);
      }
    );
  }

  async promoteTeacher(
    teacherId: string,
    gradYear: number,
    requestingUser: RequestContextUser
  ): Promise<Validation<PromoteTeacherFailure, true>> {
    if (requestingUser.role !== Roles.ADMIN) {
      return Fail(PromoteTeacherFailure.ForbiddenForUser);
    }

    const foundTeacher = await this.userRepo.promoteToManager(
      teacherId,
      gradYear
    );
    if (!foundTeacher) {
      return Fail(PromoteTeacherFailure.TeacherNotFound);
    }

    return Success<PromoteTeacherFailure, true>(true);
  }

  async demoteManager(
    managerId: string,
    requestingUser: RequestContextUser
  ): Promise<Validation<DemoteManagerFailure, true>> {
    if (requestingUser.role !== Roles.ADMIN) {
      return Fail(DemoteManagerFailure.ForbiddenForUser);
    }

    const foundManager = await this.userRepo.demoteToTeacher(managerId);
    if (!foundManager) {
      return Fail(DemoteManagerFailure.ManagerNotFound);
    }

    return Success<DemoteManagerFailure, true>(true);
  }

  static blackenDto(user: UserDto, role: Roles): BlackedUserDto {
    const fullUser = user;
    const baseUser: BaseUserDto = {
      displayname: user.displayname,
      id: user.id,
      role: user.role,
      username: user.username
    };

    switch (role) {
      case Roles.ADMIN:
        return fullUser;

      case Roles.MANAGER:
        return {
          ...baseUser,
          graduationYear: user.graduationYear,
          email: user.email,
          managerNotes: user.managerNotes
        };

      default:
        return baseUser;
    }
  }
}
