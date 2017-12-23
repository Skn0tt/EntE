import { Router } from 'express';
import { body, validationResult, param } from 'express-validator/check';

import { check as permissionsCheck, Permissions } from '../../routines/permissions';
import { roles } from '../../constants';

const entriesRouter = Router();

/**
 * Get all entries for user
 */
const readPermissions: Permissions = {
  entries_read: true,
};
entriesRouter.get('/', (request, response) => {
  if (!permissionsCheck(request.body.role, readPermissions)) return response.status(403);
});

/**
 * Create new entry
 */
const createPermissions: Permissions = {
  entries_create: true,
};
entriesRouter.post('/', (request, response) => {
  if (!permissionsCheck(request.body.role, createPermissions)) return response.status(403);
});

/**
 * Get specific entry
 */
const readSpecificPermissions: Permissions = {
  entries_read: true,
};
entriesRouter.get('/:entryId', [
  param('userId').isMongoId(),
], (request, response) => {
  if (!permissionsCheck(request.body.role, readSpecificPermissions)) return response.status(403);

  const errors = validationResult(request);
  if (!errors.isEmpty()) return response.status(422).json({ errors: errors.mapped() });

  const entryId = request.params.entryId;
});

/**
 * Sign Entry
 */
const signEntryPermissions: Permissions = {
  entries_write: true,
};
entriesRouter.put('/:entryId/sign', [
  param('userId').isMongoId(),
], (request, response) => {
  if (!permissionsCheck(request.body.role, signEntryPermissions)) return response.status(403);

  const errors = validationResult(request);
  if (!errors.isEmpty()) return response.status(422).json({ errors: errors.mapped() });

  const entryId = request.params.entryId;
});

export default entriesRouter;
