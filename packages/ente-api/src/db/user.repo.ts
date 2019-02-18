import { Injectable } from "@nestjs/common";
import { Repository, Brackets, In, Not } from "typeorm";
import { User } from "./user.entity";
import { Maybe, Some, None, Validation, Fail, Success } from "monet";
import {
  Roles,
  CreateUserDto,
  UserDto,
  isValidUuid,
  roleHasGraduationYear,
  roleHasChildren,
  roleHasBirthday,
  Languages
} from "ente-types";
import { InjectRepository } from "@nestjs/typeorm";
import * as _ from "lodash";
import {
  PaginationInformation,
  withPagination
} from "../helpers/pagination-info";
import { hashPasswordsOfUsers } from "../helpers/password-hash";

interface UserAndPasswordHash {
  user: UserDto;
  hash: string;
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
  UserNotFound
}

export enum UpdateUserFailure {
  UserNotFound,
  UserWrongRole
}

export enum SetLanguageFailure {
  UserNotFound
}

export enum ImportUsersFailure {
  UsersNotFound
}

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
    return users.map(u => UserRepo.toDto(u));
  }

  async findByIds(...ids: string[]): Promise<UserDto[]> {
    const users = await this._userQueryWithChildren()
      .whereInIds(ids)
      .getMany();
    return users.map(u => UserRepo.toDto(u));
  }

  async findByRole(role: Roles): Promise<UserDto[]> {
    return this.findByRoles(role);
  }

  async findByRoles(...roles: Roles[]): Promise<UserDto[]> {
    const users = await this._userQueryWithChildren()
      .where("user.role IN (:roles)", { roles })
      .getMany();
    return users.map(u => UserRepo.toDto(u));
  }

  private async _findById(id: string): Promise<Maybe<User>> {
    const result = await this._userQueryWithChildren()
      .whereInIds(id)
      .getOne();

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

  async findByGraduationYear(year: number): Promise<UserDto[]> {
    const users = await this._userQuery()
      .where("user.graduationYear = :year", { year })
      .getMany();

    return users.map(u => UserRepo.toDto(u));
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
    return this.repo.manager.transaction(async manager => {
      const [parents, withoutChildren] = _.partition<CreateUserDtoWithHash>(
        users,
        u => u.user.role === Roles.PARENT
      );

      const result: User[] = [];

      const insert = async (users: CreateUserDtoWithHash[]) => {
        const newUsers = await manager.create(
          User,
          await Promise.all(
            users.map(async ({ user, hash }) => ({
              children: await Promise.all(
                user.children.map(async c => {
                  return isValidUuid(c)
                    ? await manager.findOne(User, c)
                    : await manager.findOne(User, { where: { username: c } });
                })
              ),
              displayname: user.displayname,
              birthday: user.birthday,
              language: user.language || defaultLanguage,
              password: hash,
              role: user.role,
              username: user.username,
              email: user.email,
              graduationYear: user.graduationYear
            }))
          )
        );

        const savedUsers = await manager.save(User, newUsers);
        result.push(...savedUsers);
      };

      await insert(withoutChildren);
      await insert(parents);

      return result.map(u => UserRepo.toDto(u));
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
    const usernames = dtos.map(d => d.username);

    const allChildren = _.uniq(_.flatten(dtos.map(u => u.children)));
    const childrenNotInDtos = allChildren.filter(
      name => !usernames.includes(name)
    );
    const allChildrenExist = await this.hasUsersWithRole(
      [Roles.STUDENT],
      ...childrenNotInDtos
    );
    if (!allChildrenExist) {
      return Fail(ImportUsersFailure.UsersNotFound);
    }

    const usersWhoAlreadyExist = await this.repo.find({
      where: { username: In(usernames) }
    });
    const usernamesThatAlreadyExist = usersWhoAlreadyExist.map(u => u.username);

    const [dtosToUpdate, dtosToCreate] = _.partition(dtos, (s: CreateUserDto) =>
      usernamesThatAlreadyExist.includes(s.username)
    );

    const createdUsers = await this.hashPasswordAndCreate(
      defaultLanguage,
      ...dtosToCreate
    );

    const updatedUsers = await Promise.all(
      dtosToUpdate.map(async dto => {
        const user = (await this.repo.findOne({ username: dto.username }))!;

        const childrenOfUser = await Promise.all(
          dto.children.map(
            async username =>
              (await this.repo.findOne({
                where: { username: username }
              }))!
          )
        );

        user.children = childrenOfUser;
        user.birthday = dto.birthday || null;
        user.displayname = dto.displayname;
        user.email = dto.email;
        user.graduationYear = dto.graduationYear || null;
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
        role: Not(Roles.ADMIN)
      });
    }

    if (deleteUnreferencedStudentsAndParents) {
      await this.repo.delete({
        username: Not(In([...usernames, ...childrenNotInDtos])),
        role: In([Roles.STUDENT, Roles.PARENT])
      });
    }

    return Success({ created: createdUsers, updated: updatedUsers });
  }

  async setDisplayName(id: string, displayname: string) {
    await this.repo.update(id, { displayname });
  }

  async setUsername(id: string, username: string) {
    await this.repo.update(id, { username });
  }

  async setBirthday(
    id: string,
    birthday: string
  ): Promise<Validation<UpdateUserFailure, true>> {
    const user = Maybe.fromUndefined(await this.repo.findOne(id));
    return await user.cata<Promise<Validation<UpdateUserFailure, true>>>(
      async () => Fail(UpdateUserFailure.UserNotFound),
      async user => {
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
    graduationYear: number
  ): Promise<Validation<UpdateUserFailure, true>> {
    const user = Maybe.fromUndefined(await this.repo.findOne(id));
    return await user.cata<Promise<Validation<UpdateUserFailure, true>>>(
      async () => Fail(UpdateUserFailure.UserNotFound),
      async user => {
        if (!roleHasGraduationYear(user.role)) {
          return Fail(UpdateUserFailure.UserWrongRole);
        }
        await this.repo.update(id, { graduationYear });
        return Success<UpdateUserFailure, true>(true);
      }
    );
  }

  async setChildren(
    id: string,
    children: string[]
  ): Promise<Validation<UpdateUserFailure, true>> {
    const user = Maybe.fromUndefined(await this.repo.findOne(id));
    return await user.cata<Promise<Validation<UpdateUserFailure, true>>>(
      async () => Fail(UpdateUserFailure.UserNotFound),
      async user => {
        if (!roleHasChildren(user.role)) {
          return Fail(UpdateUserFailure.UserWrongRole);
        }

        await this.repo.update(id, {
          children: children.map(c => ({ _id: c }))
        });
        return Success<UpdateUserFailure, true>(true);
      }
    );
  }

  async findUserAndPasswordHashByUsername(
    username: string
  ): Promise<Maybe<UserAndPasswordHash>> {
    const user = await this._findByUsername(username);

    return user.bind(u => {
      if (u.password === null) {
        return None();
      }

      return Some({
        user: UserRepo.toDto(u),
        hash: u.password
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
      async u => {
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
      new Brackets(qb => {
        qb.where("user._id = :id", { id: firstUser.id }).andWhere(
          "user.role = :role",
          { role: firstUser.role }
        );
      })
    );

    otherUsers.forEach(({ id, role }) => {
      query = query.orWhere(
        new Brackets(qb => {
          qb.where("user._id = :id", { id }).andWhere("user.role = :role", {
            role
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

    return Some(user.parents.map(p => UserRepo.toDto(p)));
  }

  async delete(id: string) {
    await this.repo.delete({ _id: id });
  }

  static toDto(user: User): UserDto {
    const result = new UserDto();
    result.id = user._id;

    result.children =
      user.role === Roles.PARENT
        ? user.children.map(c => UserRepo.toDto(c))
        : [];
    result.displayname = user.displayname;
    result.email = user.email;
    result.birthday = user.birthday || undefined;
    result.role = user.role;
    result.username = user.username;
    result.graduationYear = user.graduationYear || undefined;
    result.language = user.language;

    return result;
  }
}
