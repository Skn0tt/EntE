import { Router, Request } from 'express';
import { validationResult, param } from 'express-validator/check';

import { check as permissionsCheck, Permissions } from '../../routines/permissions';
import { roles, MongoId, ROLES } from '../../constants';

import Slot, { SlotModel } from '../../models/Slot';
import { RequestHandler } from 'express-serve-static-core';
import User from '../../models/User';

const slotsRouter = Router();

interface SlotRequest extends Request {
  slots: SlotModel[];
}

const populate: RequestHandler = async (request: SlotRequest, response, next) => {
  try {
    const slots = request.slots;

    const userIds: MongoId[] = [];
    slots.forEach(slot => userIds.push(slot.student, slot.teacher));
    const users = await User
      .find({ _id: { $in: userIds } })
      .select('-password');
    
    return response.json({
      slots,
      users,
    });
  } catch (error) {
    return next(error);
  }
};

/**
 * Get all slots for user
 */
const readPermissions: Permissions = {
  slots_read: true,
};
const oneYearBefore = new Date(+new Date() - (365 * 24 * 60 * 60 * 1000));
const yearParams = { date: { $gte: oneYearBefore } };
slotsRouter.get('/', async (request: SlotRequest, response, next) => {
  if (!permissionsCheck(request.user.role, readPermissions)) return response.status(403).end();

  try {
    let slots;
    switch (request.user.role) {
      case ROLES.TEACHER:
        slots = await Slot.find({ teacher: request.user._id, ...yearParams });
        break;
      case ROLES.PARENT:
        slots = await Slot.find({ student: { $in: request.user.children, ...yearParams } });
        break;
      case ROLES.STUDENT:
        slots = await Slot.find({ student: request.user._id, ...yearParams });
        break;
      case ROLES.ADMIN:
        slots = await Slot.find({ ...yearParams });
        break;
      default:
        break;
    }

    request.slots = slots;
    
    return next();
  } catch (error) {
    return next(error);
  }
}, populate);

/**
 * Get specific slot
 */
const readSpecificPermissions: Permissions = {
  slots_read: true,
};
slotsRouter.get('/:slotId', [
  param('slotId').isMongoId(),
], async (request: SlotRequest, response, next) => {
  if (!permissionsCheck(request.user.role, readSpecificPermissions))
    return response.status(403).end();
  
  const slotId = request.params.slotId;

  try {
    const slot = await Slot.findById(slotId);

    request.slots = [slot];
    
    return next();
  } catch (error) {
    return next(error);
  }
}, populate);

export default slotsRouter;
