import { MongoId, Roles } from "ente-types";
import User, { UserModel } from "../models/User";
import * as _ from "lodash";

/**
 * Checks if users already exist
 * @param ids to check
 * @param role for the users
 */
export const usersExist = async (
  ids: MongoId[],
  role: Roles
): Promise<boolean> => {
  const uniqueIds = _.uniq(ids);

  const numberOfUsers = await User.count({ role, _id: { $in: uniqueIds } });

  return numberOfUsers === uniqueIds.length;
};

/**
 * Checks if one of the usernames is already taken.
 * Returns true if none of given names are in DB
 * Returns false if one or more of given names are in DB
 */
export const usernamesAvailable = async (names: string[]): Promise<boolean> => {
  const uniqueNames = _.uniq(names);

  const numberOfUsers = await User.count({ username: { $in: uniqueNames } });

  console.log(numberOfUsers);

  return numberOfUsers === 0;
};
