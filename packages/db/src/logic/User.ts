/**
 * EntE
 * (c) 2017-present, Simon Knott <info@simonknott.de>
 * 
 * This source code is licensed under the GNU Affero General Public License
 * found in the LICENSE file in the root directory of this source tree.
 */

import { getRepository, getConnection } from "typeorm";
import User from "../entity/User";
import {
  validatePassword,
  randomToken,
  hashPassword
} from "../helpers/password";
import { UserId, IUser, Roles, IUserCreate } from "ente-types";
import * as _ from "lodash";
import { oneDayInFuture } from "../helpers/date";
import { updateSuccess } from "../helpers/response";

const userRepo = () => getRepository(User);

const userToJson = (user: User): IUser => ({
  _id: user._id,
  children: user.children.map(u => u._id),
  username: user.username,
  role: user.role,
  isAdult: !!user.isAdult,
  email: user.email,
  displayname: user.displayname
});

/**
 * ## Create
 */
const create = async (users: IUserCreate[]): Promise<IUser[]> => {
  return getConnection().transaction(async manager => {
    const usersWithHashedPassword = await Promise.all(
      users.map(async u => ({
        ...u,
        children: await manager.findByIds(User, u.children),
        password: u.password ? await hashPassword(u.password) : undefined
      }))
    );
    const newUsers = await manager.create(User, usersWithHashedPassword);

    await manager.save(User, newUsers);

    return newUsers.map(userToJson);
  });
};

const createAdmin = async () => {
  const admin = await userRepo().count({ where: { username: "admin" } });
  if (admin === 0) {
    await create([
      {
        children: [],
        displayname: "Administrator",
        username: "admin",
        password: "root",
        email: "simoknott@gmail.com",
        role: Roles.ADMIN,
        isAdult: false
      }
    ]);
  }
};

/**
 * ## Read
 */
const checkPassword = async (username: string, attempt: string) => {
  const user = await userRepo().findOne({ where: { username } });
  if (!user || !user.password) {
    return null;
  }

  const isValid = await validatePassword(user.password, attempt);
  return isValid ? userToJson(user) : null;
};

const findAll = async () => {
  const users = await userRepo().find();
  return users.map(userToJson);
};

const findById = async (id: UserId) => {
  const user = await userRepo().findOneById(id);
  return !!user ? userToJson(user) : null;
};

const findByIds = async (ids: UserId[]) => {
  const users = await userRepo().findByIds(ids);
  return users.map(userToJson);
};

const roleQuery = (role: Roles) =>
  userRepo()
    .createQueryBuilder("user")
    .leftJoinAndSelect("user.children", "child")
    .where("user.role = :role", { role });

const findByRole = async (role: Roles) => {
  const users = await roleQuery(role).getMany();
  return users.map(userToJson);
};

const findByRoleOrId = async (role: Roles, ids: UserId[]) => {
  const users = await roleQuery(role)
    .orWhereInIds(ids)
    .getMany();

  return users.map(userToJson);
};

const findByRoleAndId = async (role: Roles, ids: UserId[]) => {
  const users = await roleQuery(role)
    .andWhereInIds(ids)
    .getMany();

  return users.map(userToJson);
};

const findParentMail = async (id: UserId): Promise<string[] | null> => {
  const user = await userRepo().findOneById(id, { relations: ["parents"] });
  if (!user) {
    return null;
  }

  const mails = user.parents.map(p => p.email);

  return mails;
};

const findByRoleAndUsername = async (role: Roles, username: string) => {
  const user = await roleQuery(role)
    .andWhere("user.username = :username", { username })
    .getOne();

  return !!user ? userToJson(user) : null;
};

const exist = async (ids: UserId[], role: Roles): Promise<boolean> => {
  const uniqueIds = _.uniq(ids);
  const count = await userRepo()
    .createQueryBuilder("user")
    .where("user._id IN (:ids)", { ids })
    .andWhere("user.role = :role", { role })
    .getCount();

  return count === uniqueIds.length;
};

const usernamesAvailable = async (usernames: string[]): Promise<boolean> => {
  const uniqueNames = _.uniq(usernames);
  const count = await userRepo()
    .createQueryBuilder("user")
    .where("user.username IN (:usernames)", { usernames: uniqueNames })
    .getCount();

  return count === 0;
};

/**
 * ## Update
 */
const forgotPassword = async (
  username: string
): Promise<{ token: string; email: string } | null> => {
  const result = await userRepo()
    .createQueryBuilder("user")
    .where("username = :username", { username })
    .update()
    .set({
      passwordResetExpiry: oneDayInFuture(),
      passwordResetToken: await randomToken(30)
    })
    .execute();

  if (!updateSuccess(result)) {
    return null;
  }

  const user = await userRepo().findOne({ where: { username } });
  if (!user) {
    return null;
  }

  return { token: user.passwordResetToken!, email: user.email };
};

const setPassword = async (
  token: string,
  newPassword: string
): Promise<{ email: string; username: string } | null> => {
  const user = await userRepo().findOne({
    where: { passwordResetToken: token },
    relations: ["children", "entries", "slots", "parents"]
  });
  if (!user) {
    return null;
  }

  const valid =
    user.passwordResetExpiry && +user.passwordResetExpiry > Date.now();
  if (!valid) {
    return null;
  }

  user.password = await hashPassword(newPassword);
  user.passwordResetToken = null;
  user.passwordResetExpiry = null;

  await userRepo().save(user);

  return { username: user.username, email: user.email };
};

const update = (updater: (u: User) => User | Promise<User>) => async (
  id: UserId
) => {
  const user = await userRepo().findOneById(id);
  if (!user) {
    return null;
  }

  const newUser = await Promise.resolve(updater(user));

  await userRepo().save(newUser);

  return userToJson(newUser);
};

const updateEmail = (email: string) =>
  update(u => {
    u.email = email;
    return u;
  });
const updateRole = (role: Roles) =>
  update(u => {
    u.role = role;
    return u;
  });
const updateDisplayname = (displayname: string) =>
  update(u => {
    u.displayname = displayname;
    return u;
  });
const updateIsAdult = (isAdult: boolean) =>
  update(u => {
    u.isAdult = isAdult;
    return u;
  });

const updateChildren = (childrenIds: UserId[]) =>
  update(async u => {
    const children = await userRepo().findByIds(childrenIds);
    u.children = children;
    return u;
  });

export default {
  checkPassword,
  findByIds,
  findByRole,
  exist,
  usernamesAvailable,
  forgotPassword,
  setPassword,
  findAll,
  findById,
  findByRoleOrId,
  findByRoleAndId,
  findByRoleAndUsername,
  findParentMail,
  create,
  updateEmail,
  updateRole,
  updateDisplayname,
  updateIsAdult,
  createAdmin,
  updateChildren
};
