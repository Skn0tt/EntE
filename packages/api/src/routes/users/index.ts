/**
 * Express
 */
import { Router, Request, Response } from "express";
import { validationResult, body, param, oneOf } from "express-validator/check";

/**
 * EntE
 */
import {
  isValidUser,
  isValidEmail,
  isValidRole,
  isValidDisplayname,
  Validator,
  isValidUsername
} from "ente-validator";
import { MongoId, Roles, rolesArr, IUserCreate, IUser } from "ente-types";

/**
 * Helpers
 */
import rbac from "../../helpers/permissions";
import validate, { check } from "../../helpers/validate";
import populate, { PopulateRequest } from "../../helpers/populate";
import wrapAsync from "../../helpers/wrapAsync";
import * as _ from "lodash";
import { isEmail } from "validator";
import { omitPassword } from "../../helpers/queryParams";
import { User } from "ente-db";
import { dispatchPasswortResetLink } from "../../helpers/mail";

/**
 * Users Router
 * '/users'
 *
 * Authenticated
 */
const usersRouter = Router();

/**
 * GET all users
 */
usersRouter.get(
  "/",
  rbac({ users_read: true }),
  wrapAsync(async (req, res, next) => {
    switch (req.user.role as Roles) {
      /**
       * Admin can see all users
       */
      case Roles.ADMIN:
        req.users = await User.findAll();
        return next();

      /**
       * Student can see all Teachers
       */
      case Roles.STUDENT:
        req.users = await User.findByRole(Roles.TEACHER);
        return next();

      /**
       * Manager can see all their children
       */
      case Roles.MANAGER:
        req.users = await User.findByIds(req.user.children);
        return next();

      /**
       * Parents can see all their children and teachers
       */
      case Roles.PARENT:
        req.users = await User.findByRoleOrId(Roles.TEACHER, req.user.children);
        return next();

      default:
        res.status(403).end();
    }
  }),
  populate
);

/**
 * GET specific user
 */
usersRouter.get(
  "/:userId",
  rbac({ users_read: true }),
  [param("userId").isUUID()],
  validate,
  wrapAsync(async (req, res, next) => {
    const { userId } = req.params;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).end("Couldnt find requested user.");
    }

    /**
     * Authorization
     */
    switch (req.user.role as Roles) {
      /**
       * Students have read access to teachers
       */
      case Roles.STUDENT:
        if (user.role !== Roles.TEACHER) {
          return res.status(403).end();
        }
        break;

      /**
       * Managers have read access to their children
       */
      case Roles.MANAGER:
        if (!req.user.children.includes(user._id)) {
          return res.status(403).end();
        }
        break;

      /**
       * Parents have read access to their children and teachers
       */
      case Roles.PARENT:
        if (
          user.role !== Roles.TEACHER &&
          !req.user.children.includes(user._id)
        ) {
          return res.status(403).end();
        }
        break;

      default:
        break;
    }

    req.users = [user];

    return next();
  }),
  populate
);

/**
 * POST new users
 */
usersRouter.post(
  "/",
  rbac({ users_write: true }),
  (r, w, n) => {
    r.body = _.isArray(r.body) ? r.body : [r.body];
    n();
  },
  check(req => <IUserCreate[]>req.body, [
    {
      check: us => us.every(isValidUser),
      msg: "One of the users is not valid."
    },
    {
      check: us => User.usernamesAvailable(us.map(u => u.username)),
      msg: "One of the users already exists."
    },
    {
      check: us => {
        const children = _.flatten(us.map(u => u.children));
        return children.length === 0 || User.exist(children, Roles.STUDENT);
      },
      msg: "One of the children doesn't exist."
    }
  ]),
  wrapAsync(async (req, res, next) => {
    const users: IUserCreate[] = req.body;

    const newUsers = await User.create(users);

    users.forEach(async u => {
      if (!u.password) {
        const result = await User.forgotPassword(u.username);
        if (!result) {
          throw new Error("User created is not in DB?");
        }

        const { email, token } = result;
        dispatchPasswortResetLink(token, u.username, email);
      }
    });

    req.users = newUsers;

    return next();
  }),
  populate
);

/**
 * PATCH specific user
 */
usersRouter.patch(
  "/:userId",
  rbac({ users_write: true }),
  validate,
  wrapAsync(async (req, res, next) => {
    const { userId } = req.params;

    const { email, role, displayname, children, isAdult } = req.body;

    let user: IUser | null = null;

    /**
     * `email`
     */
    if (!!email && isValidEmail(email)) {
      user = await User.updateEmail(email)(userId);
      if (!user) {
        return res.status(404).end();
      }
    }

    /**
     * `role`
     */
    if (!!role && isValidRole(role)) {
      user = await User.updateRole(role)(userId);
      if (!user) {
        return res.status(404).end();
      }
    }

    /**
     * `displayname`
     */
    if (!!displayname && isValidDisplayname(displayname)) {
      user = await User.updateDisplayname(displayname)(userId);
      if (!user) {
        return res.status(404).end();
      }
    }

    /**
     * `children`
     */
    if (!!children && (await User.exist(children, Roles.STUDENT))) {
      user = await User.updateChildren(children)(userId);
      if (!user) {
        return res.status(404).end();
      }
    }

    /**
     * `isAdult`
     */

    if (!_.isUndefined(isAdult) && _.isBoolean(isAdult)) {
      user = await User.updateIsAdult(isAdult)(userId);
      if (!user) {
        return res.status(404).end();
      }
    }

    if (!!user) {
      req.users = [user];
    }

    return next();
  }),
  populate
);

export default usersRouter;
