import { MongoId } from "ente-types";
import User, { UserModel } from "../models/User";
import * as _ from "lodash";

export const usersExist = async (
  ids: MongoId[],
  check?: (u: UserModel) => boolean
): Promise<boolean> => {
  const uniqueIds = _.uniq(ids);

  const numberOfUsers = await User.count({ _id: { $in: uniqueIds } });

  return numberOfUsers === uniqueIds.length;
};
