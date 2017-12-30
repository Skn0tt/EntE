import { Router } from 'express';
import { validationResult, param } from 'express-validator/check';

import { check as permissionsCheck, Permissions } from '../../routines/permissions';
import { roles } from '../../constants';

import Slot from '../../models/Slot';

const slotsRouter = Router();

/**
 * Get all slots for user
 */
const readPermissions: Permissions = {
  slots_read: true,
};
slotsRouter.get('/', async (request, response, next) => {
  if (!permissionsCheck(request.user.role, readPermissions)) return response.status(403).end();

  try {
    const slots = await Slot.find({})
      .populate('teacher', 'username email')
      .populate('student', 'username email');
    
    return response.json(slots);
  } catch (error) {
    return next(error);
  }
});

/**
 * Get specific slot
 */
const readSpecificPermissions: Permissions = {
  slots_read: true,
};
slotsRouter.get('/:slotId', [
  param('slotId').isMongoId(),
], async (request, response, next) => {
  if (!permissionsCheck(request.user.role, readSpecificPermissions))
    return response.status(403).end();
  
  const slotId = request.params.slotId;

  try {
    const slot = await Slot.findById(slotId)
      .populate('teacher', 'username email')
      .populate('student', 'username email');
    
    return response.json(slot);
  } catch (error) {
    return next(error);
  }
});

/**
 * Sign specific slot
 */
const signPermissions: Permissions = {
  slots_write: true,
};
slotsRouter.put('/:slotId/sign', async (request, response, next) => {
  if (!permissionsCheck(request.user.role, signPermissions)) return response.status(403).end();

  const slotId = request.params.slotId;

  try {
    const slot = await Slot.findById(slotId);
    
    slot.sign();
    slot.save();

    slot.populate('teacher', 'username email');
    slot.populate('student', 'username email');

    return response.json(slot);
  } catch (error) {
    return next(error);
  }
});

export default slotsRouter;
