import { Router, Request, Response } from 'express';
import { validationResult, body, param, oneOf } from 'express-validator/check';

import { check as permissionsCheck, Permissions } from '../../routines/permissions';
import { roles, ROLES, MongoId } from '../../constants';

import User, { UserModel } from '../../models/User';
import { RequestHandler } from 'express-serve-static-core';
import Entry from '../../models/Entry';
import Slot from '../../models/Slot';

const usersRouter = Router();

interface UserRequest extends Request {
  users: UserModel[];
}

const populate: RequestHandler = async (request: UserRequest, response, next) => {
  try {
    let users = request.users;

    const userIds: MongoId[] = users.map(user => user._id);

    const entries = await Entry
      .find({ _id: { $in: userIds } });

    const slotIds: MongoId[] = [];
    entries.forEach(entry => slotIds.push(...entry.slots));

    const slots = await Slot
      .find({ _id: { $in: slotIds } });

    const teacherIds: MongoId[] = [];
    slots.forEach(slot => teacherIds.push(slot.teacher));
    users = users.concat(...(
      await User
        .find({ _id: { $in: teacherIds } })
        .select('-password')
      ),
    );

    return response.json({
      users,
      slots,
      entries,
    });
  } catch (error) {
    return next(error);
  }
};

/**
 * Get all users
 */
const readPermissions : Permissions = {
  users_read: true,
};
const readTeacherPermissions : Permissions = {
  teachers_read: true,
};
usersRouter.get('/', (request: UserRequest, response, next) => {
  if (!permissionsCheck(
    request.user.role,
    request.query.role === ROLES.TEACHER ?
      readTeacherPermissions :
      readPermissions,
  )) {
    return response.status(403).end();
  }
  return next();
}, async (request: UserRequest, response, next) => {
  try {
    const users =
      request.query.role === ROLES.TEACHER ?
        await User
          .find({ role: 'teacher' })
          .select('-password') :
        await User
          .find({})
          .select('-password');
    
    request.users = users;
    
    return next();
  } catch (error) {
    return next(error);
  }
}, populate);

/**
 * Get specific user
 */
const readSpecificPermissions : Permissions = {
  users_read: true,
};
usersRouter.get('/:userId', [
  param('userId').isMongoId(),
], async (request: UserRequest, response: Response, next) => {
  if (!permissionsCheck(request.user.role, readSpecificPermissions)) {
    return response.status(403).end();
  }

  const userId = request.params.userId;

  try {
    const user = await User.findById(userId).select('-password');

    if (!user) return response.status(404).end('Couldnt find requested user.');

    request.users = [user];
    
    return next();
  } catch (error) {
    return next(error);
  }
}, populate);

const userAlreadyExists = async (username: string): Promise<boolean> =>
  !!(await User.findOne({ username }));
const childAlreadyExists = async (id: string): Promise<boolean> =>
  !!(await User.findById(id));
const createPermissions : Permissions = {
  users_write: true,
};
/**
 * Create new user
 */
usersRouter.post('/', [
  body('email').isEmail(),
  body('displayname').isAscii(),
  body('username').isAlphanumeric(),
  body('role').isIn(roles),
], async (request: UserRequest, response, next) => {
  if (!permissionsCheck(request.user.role, createPermissions)) return response.status(403).end();

  const errors = validationResult(request);
  if (!errors.isEmpty()) return response.status(422).json({ errors: errors.mapped() });

  try {
    if (await userAlreadyExists(request.body.username)) {
      return response.status(409).end('User already exists.');
    }

    for (const child of request.body.children) {
      if (await !childAlreadyExists(child)) {
        return response.status(422).end(`Child ${child} doesn't exist.`);
      }
    }
    
    const user = await User.create({
      email: request.body.email,
      role: request.body.role,
      displayname: request.body.displayname,
      password: request.body.password,
      isAdult: request.body.isAdult,
      username: request.body.username,
      children: request.body.children,
    });

    request.users = [user];

    return next();
  } catch (error) {
    return next(error);
  }
}, populate);

/**
 * Update specific user
 */
const updatePermissions : Permissions = {
  users_write: true,
};
usersRouter.patch('/:userId', [
  body('role').isIn(roles).optional(),
  body('email').isEmail().optional(),
  body('username').isAlphanumeric().optional(),
  body('displayname').isAscii().optional(),
  param('userId').isMongoId(),
], async (request: UserRequest, response: Response, next) => {
  if (!permissionsCheck(request.user.role, updatePermissions)) return response.status(403).end();
  
  const errors = validationResult(request);
  if (!errors.isEmpty()) return response.status(422).json({ errors: errors.mapped() });

  const userId = request.params.userId;
  const body = request.body;
  
  try {
    const user = await User.findById(userId).select('-password');

    if (!user) return response.status(404).end('User not found');

    if (body.email) user.set('email', body.email);
    if (body.role) user.set('role', body.role);
    if (body.displayname) user.set('displayname', body.displayname);
    if (body.children) user.set('children', body.children);
    if ('isAdult' in body) user.set('isAdult', body.isAdult);
    if (body.password) user.set('password', body.password);

    await user.save();

    request.users = [user];

    return next();
  } catch (error) {
    return next(error);
  }
}, populate);

export default usersRouter;
