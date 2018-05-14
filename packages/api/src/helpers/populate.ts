/**
 * EntE
 * (c) 2017-present, Simon Knott <info@simonknott.de>
 *
 * This source code is licensed under the GNU Affero General Public License
 * found in the LICENSE file in the root directory of this source tree.
 */

import { RequestHandler, NextFunction, Response, Request } from "express";
import wrapAsync from "./wrapAsync";
import { requestHandler } from "raven";
import { IUser, ISlot, UserId, IEntry } from "ente-types";
import * as _ from "lodash";
import { omitPassword } from "./queryParams";
import { User, Slot } from "ente-db";

export interface PopulateRequest extends Request {
  entries?: IEntry[];
  users?: IUser[];
  slots?: ISlot[];
  user: IUser;
}

const missing = (have: { _id: string }[], want: string[]): string[] => {
  const haveIds = have.map(h => h._id);

  return _.difference(want, haveIds);
};

const populate: RequestHandler = async (req, res, next) => {
  const users = req.users || [];
  const slots = req.slots || [];
  const entries = req.entries || [];

  const userIds: UserId[] = [];
  entries.forEach(e => userIds.push(e.student));
  slots.forEach(s => {
    userIds.push(s.student);
    userIds.push(s.teacher);
  });
  users.forEach(u => userIds.push(...u.children));

  const slotIds = _.flatten(entries.map(e => e.slots));

  const newSlots = await Slot.findByIds(missing(slots, slotIds));
  newSlots.forEach(s => userIds.push(s.teacher));

  const newUsers = await User.findByIds(missing(users, userIds));

  return res.status(200).json({
    entries,
    users: [...users, ...newUsers],
    slots: [...slots, ...newSlots]
  });
};

export default wrapAsync(populate);
