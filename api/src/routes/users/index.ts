import { Router, Request, Response } from 'express';
import { validationResult, body, param } from 'express-validator/check';

import { check as permissionsCheck, Permissions } from '../../routines/permissions';
import { roles } from '../../constants';

import User from '../../models/User';

const usersRouter = Router();

/**
 * Get all users
 */
const readPermissions : Permissions = {
  users_read: true,
};
usersRouter.get('/', async (request, response) => {
  if (!permissionsCheck(request.body.role, createPermissions)) return response.status(403).send("No Permissions");

  try {
    const users = await User.find({});

    return response.json(users);
  } catch (error) {
    return response.status(400).json(error);
  }
});

/**
 * Create new user
 */
const createPermissions : Permissions = {
  users_write: true,
};
usersRouter.post('/', [
  body('email').isEmail(),
  body('role').isIn(roles),
], async (request, response) => {
  if (!permissionsCheck(request.body.role, createPermissions)) return response.status(403);

  const errors = validationResult(request);
  if (!errors.isEmpty()) return response.status(422).json({ errors: errors.mapped() });

  try {
    const user = await User.create({
      email: request.body.email,
      role: request.body.role,
      password: request.body.password,
      username: request.body.username,
      children: request.body.children,
    });

    return response.json(user);
  } catch (error) {
    return response.status(400).json(error);
  }
});

/**
 * Get specific user
 */
const readSpecificPermissions : Permissions = {
  users_read: true,
};
usersRouter.get('/:userId', [
  param('userId').isMongoId(),
], async (request, response) => {
  if (!permissionsCheck(request.body.role, createPermissions)) return response.status(403);

  const userId = request.params.userId;

  try {
    const user = await User.findById(userId);
    
    return response.json(user);
  } catch (error) {
    return response.status(400).json(error);
  }
});

/**
 * Update specific user
 */
const updatePermissions : Permissions = {
  users_write: true,
};
usersRouter.put('/:userId', [
  body('email').isEmail(),
  body('role').isIn(roles),
  param('userId').isMongoId(),
], async (request: Request, response: Response) => {
  if (!permissionsCheck(request.body.role, updatePermissions)) return response.status(403);
  
  const errors = validationResult(request);
  if (!errors.isEmpty()) return response.status(422).json({ errors: errors.mapped() });

  const userId = request.params.userId;
  
  try {
    const user = await User.findById(userId);

    user.update({
      email: request.body.email,
      role: request.body.role,
      username: request.body.username,
      password: request.body.password,
      children: request.body.children,
    });

    user.save();

    return response.json(user);
  } catch (error) {
    return response.status(400).json(error);
  }
});

export default usersRouter;
