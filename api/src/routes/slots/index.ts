import { Router } from 'express';
import { validationResult, param } from 'express-validator/check';

import { check as permissionsCheck, Permissions } from '../../routines/permissions';
import { roles } from '../../constants';

const slotsRouter = Router();

/**
 * Get all slots for user
 */
const readPermissions: Permissions = {
  slots_read: true,
};
slotsRouter.get('/', (request, response) => {
  if (!permissionsCheck(request.body.role, readPermissions)) return response.status(403);
});

/**
 * Get specific slot
 */
const readSpecificPermissions: Permissions = {
  slots_read: true,
};
slotsRouter.get('/:slotId', [
  param('slotId').isMongoId(),
], (request, response) => {
  if (!permissionsCheck(request.body.role, readSpecificPermissions)) return response.status(403);
  
  const slotId = request.params.slotId;
});

/**
 * Sign specific slot
 */
const signPermissions: Permissions = {
  slots_write: true,
};
slotsRouter.put('/:slotId/sign', (request, response) => {
  if (!permissionsCheck(request.body.role, signPermissions)) return response.status(403);

  const slotId = request.params.slotId;
});

export default slotsRouter;
