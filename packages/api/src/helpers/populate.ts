import { RequestHandler, NextFunction, Response, Request } from "express";
import wrapAsync from "./wrapAsync";
import { requestHandler } from "raven";
import Entry, { EntryModel } from "../models/Entry";
import User, { UserModel } from "../models/User";
import Slot, { SlotModel } from "../models/Slot";
import { MongoId } from "ente-types";
import * as _ from "lodash";
import { omitPassword } from "./queryParams";

export interface PopulateRequest extends Request {
  entries: EntryModel[];
  users: UserModel[];
  slots: SlotModel[];
}

const missing = (have: { _id: MongoId }[], want: MongoId[]): MongoId[] => {
  const haveIds = have.map(h => h._id);

  return _.difference(want, haveIds);
};

const populate = async (
  req: PopulateRequest,
  res: Response,
  next: NextFunction
) => {
  const users = req.users || [];
  const slots = req.slots || [];
  const entries = req.entries || [];

  const userIds: MongoId[] = [];
  entries.forEach(e => userIds.push(e.student));
  slots.forEach(s => {
    userIds.push(s.student);
    userIds.push(s.teacher);
  });
  users.forEach(u => userIds.push(...u.children));

  const slotIds = _.flatten(entries.map(e => e.slots));

  const newUsers = await User.find({
    _id: { $in: missing(users, userIds) }
  }).select(omitPassword);
  const newSlots = await Slot.find({ _id: { $in: missing(slots, slotIds) } });

  return res.status(200).json({
    entries,
    users: [...users, ...newUsers],
    slots: [...slots, ...newSlots]
  });
};

export default wrapAsync(populate);
