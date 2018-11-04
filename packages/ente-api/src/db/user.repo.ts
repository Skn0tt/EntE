import { Injectable } from "@nestjs/common";
import { Repository, Brackets } from "typeorm";
import User from "./user.entity";
import { Maybe, Some, None, Validation, Fail, Success } from "monet";
import { Roles, CreateUserDto, UserDto, isValidUuid } from "ente-types";
import { InjectRepository } from "@nestjs/typeorm";
import * as _ from "lodash";

interface UserAndPasswordHash {
  user: UserDto;
  hash: string;
}

interface UserWithRole {
  id: string;
  role: Roles;
}

interface CreateUserDtoWithHash {
  user: CreateUserDto;
  hash: string;
}

export enum SetPasswordHashFailure {
  UserNotFound
}

interface ToUserDtoConfig {
  canHaveChildren: boolean;
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

  async findAll(): Promise<UserDto[]> {
    const users = await this._userQueryWithChildren().getMany();
    return users.map(u => UserRepo.toDto(u));
  }

  async findByIds(...ids: string[]): Promise<UserDto[]> {
    const users = await this._userQueryWithChildren()
      .whereInIds(ids)
      .getMany();
    return users.map(u => UserRepo.toDto(u));
  }

  async findByRole(role: Roles): Promise<UserDto[]> {
    const users = await this._userQueryWithChildren()
      .where("user.role = :role", { role })
      .getMany();
    return users.map(u => UserRepo.toDto(u));
  }

  async _findById(id: string): Promise<User> {
    return await this._userQueryWithChildren()
      .whereInIds(id)
      .getOne();
  }

  async findById(id: string): Promise<Maybe<UserDto>> {
    const user = await this._findById(id);
    return !!user ? Some(UserRepo.toDto(user)) : None();
  }

  private async _findByUsername(username: string): Promise<Maybe<User>> {
    const user = await this._userQueryWithChildren()
      .where("user.username = :username", { username })
      .getOne();

    return !!user ? Some(user) : None();
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

  async create(...users: CreateUserDtoWithHash[]): Promise<UserDto[]> {
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
              isAdult: user.isAdult,
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

  async setDisplayName(id: string, displayname: string) {
    await this.repo.update(id, { displayname });
  }

  async setIsAdult(id: string, isAdult: boolean) {
    await this.repo.update(id, { isAdult });
  }

  async setRole(id: string, role: Roles) {
    await this.repo.update(id, { role });
  }

  async setEmail(id: string, email: string) {
    await this.repo.update(id, { email });
  }

  async setYear(id: string, graduationYear: number) {
    await this.repo.update(id, { graduationYear });
  }

  async setChildren(id: string, children: string[]) {
    await this.repo.update(id, {
      children: children.map(c => ({ _id: c }))
    });
  }

  async findUserAndPasswordHashByUsername(
    username: string
  ): Promise<Maybe<UserAndPasswordHash>> {
    const user = await this._findByUsername(username);

    return user.map(u => ({
      user: UserRepo.toDto(u),
      hash: u.password
    }));
  }

  async setPasswordHash(
    userId: string,
    hash: string
  ): Promise<Validation<SetPasswordHashFailure, UserDto>> {
    const user = await this._findById(userId);
    if (!user) {
      return Fail(SetPasswordHashFailure.UserNotFound);
    }

    user.password = hash;
    await this.repo.save(user);
    return Success(UserRepo.toDto(user));
  }

  async hasIds(id: string): Promise<boolean> {
    const amount = await this.repo.count({ where: { _id: id } });
    return amount !== 0;
  }

  async hasUsersWithRoles(...users: UserWithRole[]) {
    const needed = users.length;

    let query = this.repo.createQueryBuilder("user");
    const firstUser = users.pop();
    query = query.where(
      new Brackets(qb => {
        qb
          .where("user._id = :id", { id: firstUser.id })
          .andWhere("user.role = :role", { role: firstUser.role });
      })
    );

    users.forEach(({ id, role }) => {
      query = query.orWhere(
        new Brackets(qb => {
          qb
            .where("user._id = :id", { id })
            .andWhere("user.role = :role", { role });
        })
      );
    });

    const found = await query.getCount();

    return needed === found;
  }

  async hasUsersWithRole(role: Roles, ...ids: string[]) {
    if (ids.length === 0) {
      return true;
    }

    const uniqueIds = _.uniq(ids);
    const count = await this.repo
      .createQueryBuilder("user")
      .whereInIds(uniqueIds)
      .andWhere("user.role = :role", { role })
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
    result.isAdult = !!user.isAdult;
    result.role = user.role;
    result.username = user.username;
    result.graduationYear = user.graduationYear;

    return result;
  }
}
