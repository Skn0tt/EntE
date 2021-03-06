import { Injectable } from "@nestjs/common";
import { Repository, Brackets, In, Not, UpdateResult } from "typeorm";
import { User } from "./user.entity";
import { Maybe, Some, None, Validation, Fail, Success } from "monet";
import {
  Roles,
  CreateUserDto,
  UserDto,
  isValidUuid,
  roleHasClass,
  roleHasChildren,
  roleHasBirthday,
  Languages,
  ROLES_WITH_CLASS,
  TEACHING_ROLES,
} from "@@types";
import { InjectRepository } from "@nestjs/typeorm";
import * as _ from "lodash";
import {
  PaginationInformation,
  withPagination,
} from "../helpers/pagination-info";
import { hashPasswordsOfUsers } from "../helpers/password-hash";
import assert from "assert";

interface UserAndPasswordHash {
  user: UserDto;
  hash: string | null;
  totpSecret: string | null;
}

interface UserWithRole {
  id: string;
  role: Roles;
}

export interface CreateUserDtoWithHash {
  user: CreateUserDto;
  hash?: string;
}

export enum SetPasswordHashFailure {
  UserNotFound,
}

export enum UpdateUserFailure {
  UserNotFound,
  UserWrongRole,
}

export enum SetLanguageFailure {
  UserNotFound,
}

export enum ImportUsersFailure {
  UsersNotFound,
}

const getChangedRows = (result: UpdateResult): number => {
  const v = result.raw.changedRows;
  assert(typeof v === "number");
  return v;
};

@Injectable()
export class UserRepo {
  constructor(
    @InjectRepository(User) private readonly repo: Repository<User>
  ) {}

  private _userQuery = () => this.repo.createQueryBuilder("user");

  private _userQueryWithChildren = () =>
    this._userQuery()
      .leftJoinAndSelect("user.children", "child")
      .leftJoinAndSelect("child.children", "grandChild");

  async findAll(paginationInfo: PaginationInformation): Promise<UserDto[]> {
    const users = await withPagination(paginationInfo)(
      this._userQueryWithChildren()
    ).getMany();
    return users.map((u) => UserRepo.toDto(u));
  }

  async countAdmins(): Promise<number> {
    return this.repo.count({ where: { isAdmin: true } });
  }

  async findAllUserIds(): Promise<Set<string>> {
    const records = await this.repo.find({
      select: ["_id"],
    });
    const ids = records.map((user) => user._id);
    return new Set(ids);
  }

  async findByIds(...ids: string[]): Promise<UserDto[]> {
    const users = await this._userQueryWithChildren().whereInIds(ids).getMany();
    return users.map((u) => UserRepo.toDto(u));
  }

  async findByRole(role: Roles): Promise<UserDto[]> {
    return this.findByRoles(role);
  }

  async findByRoles(...roles: Roles[]): Promise<UserDto[]> {
    const users = await this._userQueryWithChildren()
      .where("user.role IN (:roles)", { roles })
      .getMany();
    return users.map((u) => UserRepo.toDto(u));
  }

  private async _findById(id: string): Promise<Maybe<User>> {
    const result = await this._userQueryWithChildren().whereInIds(id).getOne();

    return Maybe.fromUndefined(result);
  }

  async findById(id: string): Promise<Maybe<UserDto>> {
    const user = await this._findById(id);
    return user.map(UserRepo.toDto);
  }

  private async _findByUsername(username: string): Promise<Maybe<User>> {
    const user = await this._userQueryWithChildren()
      .where("LOWER(user.username) = LOWER(:username)", { username })
      .getOne();

    return Maybe.fromUndefined(user);
  }

  async findByUsername(username: string): Promise<Maybe<UserDto>> {
    const user = await this._findByUsername(username);

    return user.map(UserRepo.toDto);
  }

  async findByClass(_class: string): Promise<UserDto[]> {
    const users = await this._userQuery()
      .where("user.class = :_class", { _class })
      .andWhere("user.role IN (:roles)", { roles: ROLES_WITH_CLASS })
      .getMany();

    return users.map((u) => UserRepo.toDto(u));
  }

  async hashPasswordAndCreate(
    defaultLanguage: Languages,
    ...users: CreateUserDto[]
  ) {
    const withHash = await hashPasswordsOfUsers(...users);
    return await this.create(defaultLanguage, ...withHash);
  }

  async create(
    defaultLanguage: Languages,
    ...users: CreateUserDtoWithHash[]
  ): Promise<UserDto[]> {
    return this.repo.manager.transaction(async (manager) => {
      const [parents, withoutChildren] = _.partition<CreateUserDtoWithHash>(
        users,
        (u) => u.user.role === Roles.PARENT
      );

      const result: User[] = [];

      const insert = async (users: CreateUserDtoWithHash[]) => {
        const newUsers = manager.create(
          User,
          await Promise.all(
            users.map(async ({ user, hash }) => ({
              children: await Promise.all(
                user.children.map(async (c) => {
                  return isValidUuid(c)
                    ? await manager.findOne(User, c)
                    : await manager.findOne(User, { where: { username: c } });
                })
              ),
              firstName: user.firstName,
              lastName: user.lastName,
              birthday: user.birthday,
              language: user.language || defaultLanguage,
              password: hash,
              role: user.role,
              username: user.username,
              isAdmin: user.isAdmin,
              email: user.email,
              class: user.class,
            }))
          )
        );

        const savedUsers = await manager.save(User, newUsers);
        result.push(...savedUsers);
      };

      await insert(withoutChildren);
      await insert(parents);

      return result.map((u) => UserRepo.toDto(u));
    });
  }

  async import(
    dtos: CreateUserDto[],
    deleteOthers: boolean,
    deleteUnreferencedStudentsAndParents: boolean,
    defaultLanguage: Languages
  ): Promise<
    Validation<ImportUsersFailure, { created: UserDto[]; updated: UserDto[] }>
  > {
    const usernames = dtos.map((d) => d.username);

    const allChildren = _.uniq(_.flatten(dtos.map((u) => u.children)));
    const childrenNotInDtos = allChildren.filter(
      (name) => !usernames.includes(name)
    );
    const allChildrenExist = await this.hasUsersWithRole(
      [Roles.STUDENT],
      ...childrenNotInDtos
    );
    if (!allChildrenExist) {
      return Fail(ImportUsersFailure.UsersNotFound);
    }

    const usersWhoAlreadyExist = await this.repo.find({
      where: { username: In(usernames) },
    });
    const usernamesThatAlreadyExist = usersWhoAlreadyExist.map(
      (u) => u.username
    );

    const [dtosToUpdate, dtosToCreate] = _.partition(dtos, (s: CreateUserDto) =>
      usernamesThatAlreadyExist.includes(s.username)
    );

    const createdUsers = await this.hashPasswordAndCreate(
      defaultLanguage,
      ...dtosToCreate
    );

    const updatedUsers = await Promise.all(
      dtosToUpdate.map(async (dto) => {
        const user = (await this.repo.findOne({ username: dto.username }))!;

        const childrenOfUser = await Promise.all(
          dto.children.map(
            async (username) =>
              (await this.repo.findOne({
                where: { username: username },
              }))!
          )
        );

        user.children = childrenOfUser;
        user.birthday = dto.birthday || null;
        user.firstName = dto.firstName;
        user.lastName = dto.lastName;
        user.email = dto.email;
        user.class = dto.class || null;
        if (!!dto.language) {
          user.language = dto.language;
        }

        await this.repo.save(user);

        return UserRepo.toDto(user);
      })
    );

    if (deleteOthers) {
      await this.repo.delete({
        username: Not(In([...usernames, ...childrenNotInDtos])),
        isAdmin: false,
      });
    }

    if (deleteUnreferencedStudentsAndParents) {
      await this.repo.delete({
        username: Not(In([...usernames, ...childrenNotInDtos])),
        role: In([Roles.STUDENT, Roles.PARENT]),
      });
    }

    return Success({ created: createdUsers, updated: updatedUsers });
  }

  async setIsAdmin(id: string, isAdmin: boolean) {
    await this.repo.update(id, { isAdmin });
  }

  async setUsername(id: string, username: string) {
    await this.repo.update(id, { username });
  }

  async setFirstName(id: string, firstName: string) {
    await this.repo.update(id, { firstName });
  }

  async setLastName(id: string, lastName: string) {
    await this.repo.update(id, { lastName });
  }

  async setBirthday(
    id: string,
    birthday: string
  ): Promise<Validation<UpdateUserFailure, true>> {
    const user = Maybe.fromUndefined(await this.repo.findOne(id));
    return await user.cata<Promise<Validation<UpdateUserFailure, true>>>(
      async () => Fail(UpdateUserFailure.UserNotFound),
      async (user) => {
        if (!roleHasBirthday(user.role)) {
          return Fail(UpdateUserFailure.UserWrongRole);
        }
        await this.repo.update(id, { birthday });
        return Success<UpdateUserFailure, true>(true);
      }
    );
  }

  async setRole(id: string, role: Roles) {
    await this.repo.update(id, { role });
  }

  async setEmail(id: string, email: string) {
    await this.repo.update(id, { email });
  }

  async setLanguage(
    id: string,
    language: Languages
  ): Promise<Validation<SetLanguageFailure, true>> {
    const result = await this.repo.update(id, { language });
    const { changedRows } = result.raw;

    return changedRows !== 0
      ? Success<SetLanguageFailure, true>(true)
      : Fail<SetLanguageFailure, true>(SetLanguageFailure.UserNotFound);
  }

  async setYear(
    id: string,
    _class: string
  ): Promise<Validation<UpdateUserFailure, true>> {
    const user = Maybe.fromUndefined(await this.repo.findOne(id));
    return await user.cata<Promise<Validation<UpdateUserFailure, true>>>(
      async () => Fail(UpdateUserFailure.UserNotFound),
      async (user) => {
        if (!roleHasClass(user.role)) {
          return Fail(UpdateUserFailure.UserWrongRole);
        }
        await this.repo.update(id, { class: _class });
        return Success<UpdateUserFailure, true>(true);
      }
    );
  }

  async setChildren(
    id: string,
    childrenIds: string[]
  ): Promise<Validation<UpdateUserFailure, true>> {
    const user = Maybe.fromUndefined(await this.repo.findOne(id));
    return await user.cata<Promise<Validation<UpdateUserFailure, true>>>(
      async () => Fail(UpdateUserFailure.UserNotFound),
      async (user) => {
        if (!roleHasChildren(user.role)) {
          return Fail(UpdateUserFailure.UserWrongRole);
        }

        const childrenEntities = await this.repo.findByIds(childrenIds);
        user.children = childrenEntities;
        await this.repo.save(user);
        return Success<UpdateUserFailure, true>(true);
      }
    );
  }

  async setSubscribedToWeeklySummary(
    id: string,
    subscribedToWeeklySummary: boolean
  ) {
    await this.repo.update(id, { subscribedToWeeklySummary });
  }

  async findUserAndPasswordHashByUsername(
    username: string
  ): Promise<Maybe<UserAndPasswordHash>> {
    const user = await this._findByUsername(username);

    return user.bind((u) => {
      if (u.password === null) {
        return None();
      }

      return Some({
        user: UserRepo.toDto(u),
        hash: u.password,
        totpSecret: u.totpSecret,
      });
    });
  }

  async setPasswordHash(
    userId: string,
    hash: string
  ): Promise<Validation<SetPasswordHashFailure, UserDto>> {
    const user = await this._findById(userId);
    return await user.cata(
      async () =>
        Fail<SetPasswordHashFailure, UserDto>(
          SetPasswordHashFailure.UserNotFound
        ),
      async (u) => {
        u.password = hash;
        await this.repo.save(u);
        return Success<SetPasswordHashFailure, UserDto>(UserRepo.toDto(u));
      }
    );
  }

  async hasId(id: string): Promise<boolean> {
    const amount = await this.repo.count({ where: { _id: id } });
    return amount !== 0;
  }

  async hasUsersWithRoles(...users: UserWithRole[]) {
    const needed = users.length;

    let query = this.repo.createQueryBuilder("user");
    const [firstUser, ...otherUsers] = users;
    query = query.where(
      new Brackets((qb) => {
        qb.where("user._id = :id", {
          id: firstUser.id,
        }).andWhere("user.role = :role", { role: firstUser.role });
      })
    );

    otherUsers.forEach(({ id, role }) => {
      query = query.orWhere(
        new Brackets((qb) => {
          qb.where("user._id = :id", { id }).andWhere("user.role = :role", {
            role,
          });
        })
      );
    });

    const found = await query.getCount();

    return needed === found;
  }

  async hasUsersWithRole(roles: Roles[], ...ids: string[]) {
    if (ids.length === 0) {
      return true;
    }

    const uniqueIds = _.uniq(ids);
    const count = await this.repo
      .createQueryBuilder("user")
      .whereInIds(uniqueIds)
      .andWhere("user.role IN (:roles)", { roles })
      .getCount();

    return count === uniqueIds.length;
  }

  async getParentsOfUser(id: string): Promise<Maybe<UserDto[]>> {
    const user = await this._userQuery()
      .leftJoinAndSelect("user.parents", "parent")
      .leftJoinAndSelect("parent.children", "parentChild")
      .whereInIds(id)
      .getOne();
    if (!user) {
      return None();
    }

    return Some(user.parents!.map((p) => UserRepo.toDto(p)));
  }

  async delete(id: string) {
    await this.repo.delete({ _id: id });
  }

  async setManagerNotes(studentId: string, value: string) {
    await this.repo.update(studentId, {
      managerNotes: value,
    });
  }

  async findWeeklySummaryRecipients() {
    const recipients = await this.repo.find({
      where: {
        role: In(TEACHING_ROLES),
        subscribedToWeeklySummary: true,
      },
    });
    return recipients.map(UserRepo.toDto);
  }

  async promoteToManager(teacherId: string, _class: string): Promise<boolean> {
    const result = await this.repo
      .createQueryBuilder()
      .update()
      .set({ role: Roles.MANAGER, class: _class })
      .where("_id = :teacherId", { teacherId })
      .andWhere("role = :r", { r: Roles.TEACHER })
      .execute();

    const updatedUsers = getChangedRows(result);
    assert(updatedUsers <= 1);

    return updatedUsers === 1;
  }

  async demoteToTeacher(managerId: string): Promise<boolean> {
    const result = await this.repo
      .createQueryBuilder()
      .update()
      .set({ role: Roles.TEACHER, class: null })
      .where("_id = :managerId", { managerId })
      .andWhere("role = :r", { r: Roles.MANAGER })
      .execute();

    const updatedUsers = getChangedRows(result);
    assert(updatedUsers <= 1);

    return updatedUsers === 1;
  }

  async hasTOTPSecret(id: string) {
    const user = await this.repo.findOne(id);
    return Maybe.fromUndefined(user).map((u) => !!u.totpSecret);
  }

  async setTOTPSecret(id: string, totpSecret: string) {
    await this.repo.update(id, { totpSecret });
  }

  async removeTOTPSecret(id: string) {
    await this.repo.update(id, { totpSecret: null });
  }

  static toDto(user: User): UserDto {
    const result = new UserDto();

    result.id = user._id;

    result.children = (() => {
      if (user.role === Roles.PARENT) {
        return user.children!.map((c) => UserRepo.toDto(c));
      } else {
        return [];
      }
    })();

    result.isAdmin = !!user.isAdmin;
    result.displayname = user.firstName + " " + user.lastName;
    result.firstName = user.firstName;
    result.lastName = user.lastName;
    result.email = user.email;
    result.birthday = roleHasBirthday(user.role) ? user.birthday! : undefined;
    result.role = user.role;
    result.username = user.username;
    result.twoFAenabled = !!user.totpSecret;
    result.class = roleHasClass(user.role) ? user.class! : undefined;
    result.graduationYear = parseInt(result.class || "") || -1;
    result.language = user.language;
    result.managerNotes =
      user.role === Roles.STUDENT ? user.managerNotes : undefined;
    result.subscribedToWeeklySummary = TEACHING_ROLES.includes(user.role)
      ? !!user.subscribedToWeeklySummary
      : undefined;

    return result;
  }
}
