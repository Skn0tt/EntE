import { Router, Request, Response } from 'express';
import { validationResult, body, param } from 'express-validator/check';

import { check as permissionsCheck, Permissions } from '../../routines/permissions';
import { roles, ROLES } from '../../constants';

import User from '../../models/User';

const usersRouter = Router();

/**
 * Get all users
 */
const readPermissions : Permissions = {
  users_read: true,
};
const readTeacherPermissions : Permissions = {
  teachers_read: true,
};
usersRouter.get('/', (request, response, next) => {
  if (!permissionsCheck(
    request.user.role,
    request.query.role === ROLES.TEACHER ?
      readTeacherPermissions :
      readPermissions,
  )) {
    return response.status(403).end();
  }
  return next();
}, async (request, response) => {
  try {
    const users =
      request.query.role === ROLES.TEACHER ?
        await User.find({ role: 'teacher' }).select('-password') :
        await User.find({}).select('-password');
    
    return response.json(users);
  } catch (error) {
    throw error;
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
  if (!permissionsCheck(request.user.role, readSpecificPermissions)) {
    return response.status(403).end();
  }

  const userId = request.params.userId;

  try {
    const user = await User.findById(userId).select('-password');
    
    return response.json(user);
  } catch (error) {
    throw error;
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
], async (request, response, next) => {
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
    return next(error);
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
], async (request: Request, response: Response, next) => {
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
    return next(error);
  }
});

export default usersRouter;
