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
  if (!permissionsCheck(request.user.role, createPermissions)) return response.status(403).end();

  try {
    const users = await User.find({}).select('-password');

    return response.json(users);
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
  if (!permissionsCheck(request.user.role, createPermissions)) return response.status(403).end();

  const userId = request.params.userId;

  try {
    const user = await User.findById(userId).select('-password');
    
    return response.json(user);
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
  if (!permissionsCheck(request.user.role, createPermissions)) return response.status(403).end();

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
  if (!permissionsCheck(request.user.role, updatePermissions)) return response.status(403).end();
  
  const errors = validationResult(request);
  if (!errors.isEmpty()) return response.status(422).json({ errors: errors.mapped() });

  const userId = request.params.userId;
  const body = request.body;
  
  try {
    const user = await User.findById(userId);

    if (body.email) user.set('email', body.email);
    if (body.role) user.set('role', body.role);
    if (body.username) user.set('role', body.username);
    if (body.children) user.set('children', body.children);
    if (body.password) user.set('password', body.password);

    await user.save();

    return response.json(user);
  } catch (error) {
    return response.status(400).json(error);
  }
});

export default usersRouter;
