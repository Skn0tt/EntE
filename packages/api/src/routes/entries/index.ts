import { Router, Response, Request, RequestHandler } from "express";
import { body, validationResult, param } from "express-validator/check";

import rbac, {
  check as permissionsCheck,
  Permissions
} from "../../routines/permissions";

import Entry, { EntryModel } from "../../models/Entry";
import Slot, { ISlot } from "../../models/Slot";
import * as mail from "../../routines/mail";
import User from "../../models/User";
import { ObjectID } from "bson";
import { MongoId, Roles } from "ente-types";

const entriesRouter = Router();

const populate = async (request: EntriesRequest, response, next) => {
  try {
    const slotIds: MongoId[] = [];
    request.entries.forEach(entry => slotIds.push(...entry.slots));

    const slots = await Slot.find({
      _id: { $in: slotIds }
    });

    const userIds: MongoId[] = [];
    slots.forEach(slot => userIds.push(slot.teacher, slot.student));
    request.entries.forEach(entry => userIds.push(entry.student));

    const users = await User.find({
      _id: { $in: userIds }
    }).select("-password");

    return response.json({
      slots,
      users,
      entries: request.entries
    });
  } catch (error) {
    return next(error);
  }
};

const validate: RequestHandler = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.mapped() });
  }

  next();
};

/**
 * Get all entries for user
 */
interface EntriesRequest extends Request {
  entries: EntryModel[];
}
const readPermissions: Permissions = {
  entries_read: true
};
const oneYearBefore = new Date(+new Date() - 365 * 24 * 60 * 60 * 1000);
const yearParams = { date: { $gte: oneYearBefore } };
entriesRouter.get(
  "/",
  rbac(readPermissions),
  async (request: EntriesRequest, response, next) => {
    try {
      if (
        request.user.role === Roles.PARENT ||
        request.user.role === Roles.MANAGER
      ) {
        request.entries = await Entry.find({
          student: { $in: request.user.children },
          ...yearParams
        });

        return next();
      }
      if (request.user.role === Roles.ADMIN) {
        request.entries = await Entry.find({ ...yearParams });

        return next();
      }
      if (request.user.role === Roles.STUDENT) {
        request.entries = await Entry.find({
          student: request.user._id,
          ...yearParams
        });
        return next();
      }
    } catch (error) {
      return next(error);
    }

    return response.status(400).end();
  },
  populate
);

/**
 * Get specific entry
 */
const readSpecificPermissions: Permissions = {
  entries_read: true
};
entriesRouter.get(
  "/:entryId",
  [param("entryId").isMongoId()],
  rbac(readSpecificPermissions),
  validate,
  async (request: EntriesRequest, response: Response, next) => {
    const entryId = request.params.entryId;

    try {
      const entry = await Entry.findById(entryId);

      if (entry === null) {
        return response.status(404).end("Couldnt find Entry.");
      }

      request.entries = [entry];

      next();
    } catch (error) {
      return next(error);
    }
  },
  populate
);

/**
 * Create new entry
 */
const teacherExists = async (id: MongoId): Promise<boolean> => {
  const count = await User.count({ _id: id });
  return count > 0;
};

const createPermissions: Permissions = {
  entries_create: true
};
const createSlots = async (items: [ISlot], date: Date, studentId: MongoId) => {
  const result = [];
  for (const item of items) {
    if (!teacherExists(item.teacher)) {
      return new Error(`Teacher ${item.teacher} doesn't exist!`);
    }

    const slot = await Slot.create({
      date,
      hour_from: item.hour_from,
      hour_to: item.hour_to,
      teacher: item.teacher,
      student: studentId
    });
    result.push(slot._id);
  }
  return result;
};

const twoWeeksBefore: Date = new Date(+new Date() - 14 * 24 * 60 * 60 * 1000);

entriesRouter.post(
  "/",
  rbac(createPermissions),
  [
    body("date").isAfter(twoWeeksBefore.toISOString()),
    body("reason").isLength({ max: 300 })
  ],
  validate,
  async (request: EntriesRequest, response: Response, next) => {
    const studentId =
      request.user.role === Roles.PARENT
        ? request.body.student
        : request.user._id;

    if (!request.body.dateEnd && request.body.slots.length === 0) {
      return response
        .status(422)
        .end("Entry that is no range needs to have one or more slots.");
    }

    try {
      const slots = await createSlots(
        request.body.slots,
        request.body.date,
        studentId
      );

      const signedParent: boolean =
        request.user.role === Roles.PARENT || request.user.isAdult;

      // TODO: Reject Parents creating entries for children that are not theirs

      const entry = await Entry.create({
        slots,
        signedParent,
        reason: request.body.reason,
        date: request.body.date,
        dateEnd: request.body.dateEnd,
        student: studentId,
        forSchool: request.body.forSchool
      });

      if (!entry.signedParent) {
        mail.dispatchSignRequest(entry);
      }

      request.entries = [entry];

      return next();
    } catch (error) {
      return next(error);
    }
  },
  populate
);

/**
 * # Edit Entry
 */
entriesRouter.patch(
  "/:entryId",
  rbac({
    entries_write: true
  }),
  [param("entryId").isMongoId(), body("forSchool").isBoolean()],
  validate,
  async (request: EntriesRequest, response: Response, next) => {
    const entryId = request.params.entryId;
    const { body } = request;

    try {
      const entry = await Entry.findById(entryId);

      if (!entry) {
        return response.status(404).end("Couldnt find Entry.");
      }

      entry.set("forSchool", body.forSchool);
      entry.save();

      request.entries = [entry];

      return next();
    } catch (error) {
      return next(error);
    }
  },
  populate
);

/**
 * Sign Entry
 */
const signEntryPermissions: Permissions = {
  entries_write: true
};
entriesRouter.put(
  "/:entryId/signed",
  [param("entryId").isMongoId(), body("value").isBoolean()],
  rbac(signEntryPermissions),
  validate,
  async (request: EntriesRequest, response, next) => {
    const entryId = request.params.entryId;

    const setValue = request.body.value;

    try {
      const entry = await Entry.findById(entryId);

      if (!entry) {
        return response.status(404).end("Couldnt find Entry.");
      }

      if ((request.user.children as MongoId[]).indexOf(entry.student) !== -1) {
        if (request.user.role === Roles.MANAGER) {
          entry.setSignatureManager(setValue);
        } else if (request.user.role === Roles.PARENT) {
          if (setValue === true) {
            entry.signParent();
          }
        }
      }
      entry.save();

      if (entry.signedManager && entry.signedParent) {
        const slots = await Slot.find({ _id: { $in: entry.slots } });
        slots.forEach(slot => slot.sign());
      }

      if (request.user.role === Roles.PARENT) {
        mail.dispatchSignedInformation(entry);
      }

      request.entries = [entry];
      return next();
    } catch (error) {
      return next(error);
    }
  },
  populate
);

export default entriesRouter;
