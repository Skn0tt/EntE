import {
  Injectable,
  Inject,
  OnModuleInit,
  LoggerService
} from "@nestjs/common";
import { Validation, Success, Fail } from "monet";
import { UserRepo } from "../db/user.repo";
import {
  Roles,
  UserDto,
  CreateUserDto,
  PatchUserDto,
  isValidUuid,
  isValidPatchUserDto,
  Languages,
  languagesArr
} from "ente-types";
import { PasswordResetService } from "../password-reset/password-reset.service";
import * as _ from "lodash";
import { hashPassword } from "../helpers/password-hash";
import { WinstonLoggerService } from "../winston-logger.service";
import { validate } from "class-validator";
import { RequestContextUser } from "../helpers/request-context";
import { PaginationInformation } from "../helpers/pagination-info";

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

@Injectable()
export class UsersService implements OnModuleInit {
  constructor(
    @Inject(UserRepo) private readonly userRepo: UserRepo,
    @Inject(PasswordResetService)
    private readonly passwordResetService: PasswordResetService,
    @Inject(WinstonLoggerService) private readonly logger: LoggerService
  ) {}

  async onModuleInit() {
    const adminUserExists = await this.userRepo.findByUsername("admin");
    adminUserExists.cata(
      async () => {
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
          `Created admin user. Credentials: ${created.username}:${
            admin.password
          }`
        );
      },
      async user => {}
    );
  }

  async findAll(
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
        const teachers = await this.userRepo.findByRole(Roles.TEACHER);
        return Success([
          ...children,
          ...teachers,
          (await requestingUser.getDto()).some()
        ]);

      case Roles.STUDENT:
        return Success([
          ...(await this.userRepo.findByRole(Roles.TEACHER)),
          (await requestingUser.getDto()).some()
        ]);

      case Roles.TEACHER:
        return Fail(FindAllUsersFailure.ForbiddenForRole);
    }
  }

  async findOne(
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
          case Roles.PARENT:
            return Success(u);

          case Roles.MANAGER:
            const requestingUser = (await _requestingUser.getDto()).some();
            const isManagersYear =
              u.graduationYear === requestingUser.graduationYear!;
            return isManagersYear
              ? Success(u)
              : Fail(FindOneUserFailure.ForbiddenForUser);

          case Roles.ADMIN:
            return Success(u);

          case Roles.STUDENT:
            const isTeacher = u.role === Roles.TEACHER;
            return isTeacher
              ? Success(u)
              : Fail(FindOneUserFailure.ForbiddenForUser);
        }

        throw new Error("Not reachable");
      }
    );
  }

  private async _createUsers(...users: CreateUserDto[]) {
    const withHash = await Promise.all(
      users.map(async u => ({
        user: u,
        hash: !!u.password ? await hashPassword(u.password) : undefined
      }))
    );
    const created = await this.userRepo.create(...withHash);

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

    const dtosValid = (await Promise.all(
      users.map(async u => await validate(u))
    )).every(errors => errors.length === 0);
    if (!dtosValid) {
      return Fail(CreateUsersFailure.IllegalDtos);
    }

    const studentUsernamesToCreate = users
      .filter(u => u.role === Roles.STUDENT)
      .map(u => u.username);

    const children = _.flatMap(users, u => u.children);
    const [uuids, usernames] = _.partition(children, isValidUuid);

    const uuidsExist = await this.userRepo.hasUsersWithRole(
      Roles.STUDENT,
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
      Roles.STUDENT,
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
    requestingUser: RequestContextUser,
    checkIfUserExists = true
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

    if (checkIfUserExists) {
      const userExists = await this.userRepo.hasId(id);
      if (!userExists) {
        return Fail(SetLanguageFailure.UserNotFound);
      }
    }

    await this.userRepo.setLanguage(id, language);

    return Success<SetLanguageFailure, true>(true);
  }

  async patchUser(
    id: string,
    patch: PatchUserDto,
    requestingUser: RequestContextUser
  ): Promise<Validation<PatchUserFailure, UserDto>> {
    const dtoIsLegal = isValidPatchUserDto(patch);
    if (!dtoIsLegal) {
      return Fail(PatchUserFailure.IllegalPatch);
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

    if (!!patch.birthday) {
      await this.userRepo.setBirthday(id, patch.birthday);
      user.some().birthday = patch.birthday;
    }

    if (!!patch.role) {
      await this.userRepo.setRole(id, patch.role);
      user.some().role = patch.role;
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
        Roles.STUDENT,
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

    const userV = await this.findOne(id, requestingUser);
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
}
