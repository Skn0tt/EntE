import { Router, Response, Request } from 'express';
import { body, validationResult, param } from 'express-validator/check';

import { check as permissionsCheck, Permissions } from '../../routines/permissions';
import { roles, MongoId, ROLES } from '../../constants';

import Entry from '../../models/Entry';
import Slot, { ISlot } from '../../models/Slot';
import * as mail from '../../routines/mail';

const entriesRouter = Router();

/**
 * Get all entries for user
 */
const readPermissions: Permissions = {
  entries_read: true,
};
entriesRouter.get('/', async (request, response, next) => {
  if (!permissionsCheck(request.user.role, readPermissions)) return response.status(403).end();
  
  try {
    if (request.user.role === 'parent') {
      const entries = await Entry.find({
          student: { $in: request.user.children },
        })
        .populate('student', 'username email')
        .populate('slots');
      
      return response.json(entries);
    }
    if (request.user.role === 'teacher') {
      const entries = await Entry.find({})
        .populate('student', 'username email')
        .populate('slots');
    
      return response.json(entries);
    }
    if (request.user.role === 'admin') {
      const entries = await Entry.find({})
        .populate('student', 'username email')
        .populate('slots');
    
      return response.json(entries);
    }
    if (request.user.role === 'student') {
      const entries = await Entry.find({
          student: request.user._id,
        })
        .populate('student', 'username email')
        .populate('slots');
    
      return response.json(entries);
    }

    return response.status(400).end;
  } catch (error) {
    throw error;
  }
});


/**
 * Get specific entry
 */
const readSpecificPermissions: Permissions = {
  entries_read: true,
};
entriesRouter.get('/:entryId', [
  param('entryId').isMongoId(),
], async (request, response, next) => {
  if (!permissionsCheck(request.user.role, readSpecificPermissions)) {
    return response.status(403).end();
  }

  const errors = validationResult(request);
  if (!errors.isEmpty()) return response.status(422).json({ errors: errors.mapped() });

  const entryId = request.params.entryId;

  try {
    const entry = await Entry.findById(entryId)
      .populate('student', 'username email')
      .populate('slots');

    response.json(entry);
  } catch (error) {
    return next(error);
  }
});

/**
 * Create new entry
 */
// TODO: Reject all dates that are too late
const createPermissions: Permissions = {
  entries_create: true,
};
const createSlots = async (items: [ISlot], date: Date, studentId: MongoId) => {
  const result = [];
  for (const item of items) {
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
entriesRouter.post('/', [
  body('student').exists(),
], async (request: Request, response: Response, next) => {
  if (!permissionsCheck(request.user.role, createPermissions)) return response.status(403).end();

  const errors = validationResult(request);
  if (!errors.isEmpty()) return response.status(422).json({ errors: errors.mapped() });

  try {
    const slots = await createSlots(request.body.slots, request.body.date, request.user._id);

    const signedParent: boolean = request.user.role === ROLES.PARENT;

    if (signedParent && !(request.user.children as MongoId[]).includes(request.body.student)) {
      return response.status(403).end('Student not in children.');
    }

    const entry = await Entry.create({
      slots,
      signedParent,
      date: request.body.date,
      student: request.user.role === 'parent' ?
        request.body.student :
        request.user._id,
      forSchool: request.body.forSchool,
    });

    if (!entry.signedParent) mail.dispatchSignRequest(entry);

    entry
      .populate('student', 'username email')
      .populate('slots');

    return response.json(entry);
  } catch (error) {
    return next(error);
  }
});

/**
 * Sign Entry
 */
const signEntryPermissions: Permissions = {
  entries_write: true,
};
entriesRouter.put('/:entryId/sign', [
  param('entryId').isMongoId(),
], async (request, response, next) => {
  if (!permissionsCheck(request.user.role, signEntryPermissions)) return response.status(403).end();

  const errors = validationResult(request);
  if (!errors.isEmpty()) return response.status(422).json({ errors: errors.mapped() });

  const entryId = request.params.entryId;
  
  try {
    const entry = await Entry.findById(entryId);

    if (request.user.role === ROLES.ADMIN) {
      entry.signAdmin();
    } else if (request.user.role === ROLES.PARENT) {
      entry.signParent();
    }
    
    entry.save();

    return response.json(entry);
  } catch (error) {
    return next(error);
  }
});

export default entriesRouter;
