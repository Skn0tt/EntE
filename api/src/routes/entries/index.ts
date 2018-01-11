import { Router, Response, Request } from 'express';
import { body, validationResult, param } from 'express-validator/check';

import { check as permissionsCheck, Permissions } from '../../routines/permissions';
import { roles, MongoId, ROLES } from '../../constants';

import Entry, { EntryModel } from '../../models/Entry';
import Slot, { ISlot } from '../../models/Slot';
import * as mail from '../../routines/mail';
import User from '../../models/User';

const entriesRouter = Router();

const populate = async (request: EntriesRequest, response, next) => {
  try {
    const slotIds: MongoId[] = [];
    request.entries.forEach(entry => slotIds.push(...entry.slots));

    const slots = await Slot
      .find({
        _id: { $in: slotIds },
      });
    
    const userIds: MongoId[] = [];
    slots.forEach(slot => userIds.push(slot.teacher, slot.student));
    request.entries.forEach(entry => userIds.push(entry.student));

    const users = await User
      .find({
        _id: { $in: userIds },
      })
      .select('-password');
  
    return response.json({
      slots,
      users,
      entries: request.entries,
    });
  } catch (error) {
    return next(error);
  }
};

/**
 * Get all entries for user
 */
interface EntriesRequest extends Request {
  entries: EntryModel[];
}
const readPermissions: Permissions = {
  entries_read: true,
};
entriesRouter.get('/', async (request: EntriesRequest, response, next) => {
  if (!permissionsCheck(request.user.role, readPermissions)) return response.status(403).end();
  
  try {
    if (request.user.role === 'parent') {
      request.entries = await Entry
        .find({
          student: { $in: request.user.children },
        });
      
      return next();
    }
    if (request.user.role === 'teacher') {
      request.entries = await Entry.find({});

      return next();
    }
    if (request.user.role === 'admin') {
      request.entries = await Entry.find({});
    
      return next();
    }
    if (request.user.role === 'student') {
      request.entries = await Entry
        .find({
          student: request.user._id,
        });
      return next();
    }
  } catch (error) {
    return next(error);
  }

  return response.status(400).end;
}, populate);


/**
 * Get specific entry
 */
const readSpecificPermissions: Permissions = {
  entries_read: true,
};
entriesRouter.get('/:entryId', [
  param('entryId').isMongoId(),
], async (request: EntriesRequest, response: Response, next) => {
  if (!permissionsCheck(request.user.role, readSpecificPermissions)) {
    return response.status(403).end();
  }

  const errors = validationResult(request);
  if (!errors.isEmpty()) return response.status(422).json({ errors: errors.mapped() });

  const entryId = request.params.entryId;

  try {
    const entry = await Entry.findById(entryId);

    if (entry === null) return response.status(404).end('Couldnt find Entry.');
    
    request.entries = [entry];
    next();
  } catch (error) {
    return next(error);
  }
}, populate);

/**
 * Create new entry
 */
const teacherExists = async (id: MongoId): Promise<boolean> => {
  const count = await User.count({ _id: id });
  return count > 0;
};

const createPermissions: Permissions = {
  entries_create: true,
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
      student: studentId,
    });
    result.push(slot._id);
  }
  return result;
};

const twoWeeksBefore: Date = new Date(+new Date() - (14 * 24 * 60 * 60 * 1000));

entriesRouter.post('/', [
  body('date').isAfter(twoWeeksBefore.toISOString()),
], async (request: EntriesRequest, response: Response, next) => {
  if (!permissionsCheck(request.user.role, createPermissions)) return response.status(403).end();

  const errors = validationResult(request);
  if (!errors.isEmpty()) return response.status(422).json({ errors: errors.mapped() });

  const studentId = request.user.role === ROLES.PARENT ?
    request.body.student : request.user._id;
  
  if (!request.body.dateEnd && request.body.slots.length === 0) {
    return response.status(422).end('Entry that is no range needs to have one or more slots.');
  }

  try {
    const slots = await createSlots(request.body.slots, request.body.date, studentId);

    const signedParent: boolean = request.user.role === ROLES.PARENT;

    // TODO: Reject Parents creating entries for children that are not theirs

    const entry = await Entry.create({
      slots,
      signedParent,
      date: request.body.date,
      dateEnd: request.body.dateEnd,
      student: studentId,
      forSchool: request.body.forSchool,
    });

    if (!entry.signedParent) mail.dispatchSignRequest(entry);

    request.entries = [entry];

    return next();
  } catch (error) {
    return next(error);
  }
}, populate);

/**
 * Sign Entry
 */
const signEntryPermissions: Permissions = {
  entries_write: true,
};
entriesRouter.put('/:entryId/sign', [
  param('entryId').isMongoId(),
], async (request: EntriesRequest, response, next) => {
  if (!permissionsCheck(request.user.role, signEntryPermissions)) return response.status(403).end();

  const errors = validationResult(request);
  if (!errors.isEmpty()) return response.status(422).json({ errors: errors.mapped() });

  const entryId = request.params.entryId;
  
  try {
    const entry = await Entry.findById(entryId);

    if (!entry) return response.status(404).end('Couldnt find Entry.');

    if (request.user.role === ROLES.ADMIN) {
      entry.signAdmin();
    } else if (request.user.role === ROLES.PARENT) {
      entry.signParent();
    }
    entry.save();

    if (entry.signedAdmin && entry.signedParent) {
      const slots = await Slot.find({ _id: { $in: entry.slots } });
      slots.forEach(slot => slot.sign());
    }

    if (request.user.role === ROLES.PARENT) {
      mail.dispatchSignedInformation(entry);
    }

    request.entries = [entry];
    return next();
  } catch (error) {
    return next(error);
  }
}, populate);

export default entriesRouter;
