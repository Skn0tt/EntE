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
  isValidUuid
} from "ente-types";
import { PasswordResetService } from "../password-reset/password-reset.service";
import { days } from "../helpers/time";
import * as _ from "lodash";
import { hashPassword } from "../helpers/password-hash";
import { WinstonLoggerService } from "../winston-logger.service";
import { validate } from "class-validator";

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
          isAdult: false,
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
    requestingUser: UserDto
  ): Promise<Validation<FindAllUsersFailure, UserDto[]>> {
    switch (requestingUser.role) {
      case Roles.ADMIN:
        return Success(await this.userRepo.findAll());

      case Roles.MANAGER:
        const students = await this.userRepo.findByGraduationYear(
          requestingUser.graduationYear!
        );
        return Success([...students, requestingUser]);

      case Roles.PARENT:
        const children = await this.userRepo.findByIds(
          ...requestingUser.children.map(c => c.id)
        );
        const teachers = await this.userRepo.findByRole(Roles.TEACHER);
        return Success([...children, ...teachers, requestingUser]);

      case Roles.STUDENT:
        return Success([
          ...(await this.userRepo.findByRole(Roles.TEACHER)),
          requestingUser
        ]);

      case Roles.TEACHER:
        return Fail(FindAllUsersFailure.ForbiddenForRole);
    }
  }

  async findOne(
    id: string,
    requestingUser: UserDto
  ): Promise<Validation<FindOneUserFailure, UserDto>> {
    switch (requestingUser.role) {
      case Roles.TEACHER:
        return Fail(FindOneUserFailure.ForbiddenForUser);

      case Roles.PARENT:
        const requestingOneSelf = id === requestingUser.id;
        const requestingChild = requestingUser.children
          .map(c => c.id)
          .includes(id);
        if (!(requestingOneSelf || requestingChild)) {
          return Fail(FindOneUserFailure.ForbiddenForUser);
        }
        break;
    }

    const user = await this.userRepo.findById(id);
    return user.cata(
      () => Fail(FindOneUserFailure.UserNotFound),
      u => {
        const requestingOneSelf = id === requestingUser.id;
        if (requestingOneSelf) {
          return Success(u);
        }

        switch (requestingUser.role) {
          // Already Checked for Parent above
          case Roles.PARENT:
            return Success(u);

          case Roles.MANAGER:
            const isManagersYear =
              u.graduationYear === requestingUser.graduationYear;
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

    created.forEach(user => {
      const hasPasswordSet = !!users.find(u => user.username === u.username)
        .password;
      if (!hasPasswordSet) {
        this.passwordResetService.startPasswordResetRoutine(
          user.username,
          days(7)
        );
      }
    });

    return created;
  }

  async createUsers(
    users: CreateUserDto[],
    requestingUser: UserDto
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
        created.map(c => c.username)
      )}`
    );

    return Success(created);
  }

  async patchUser(
    id: string,
    patch: PatchUserDto,
    requestingUser: UserDto
  ): Promise<Validation<PatchUserFailure, UserDto>> {
    const dtoIsLegal =
      (await validate(patch, { forbidNonWhitelisted: true })).length === 0;
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

    if (!!patch.isAdult) {
      await this.userRepo.setIsAdult(id, patch.isAdult);
      user.some().isAdult = patch.isAdult;
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
    requestingUser: UserDto
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
