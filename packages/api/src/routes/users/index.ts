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
  isValidIsAdult,
  Validator,
  isValidUsername
} from "ente-validator";
import { MongoId, Roles, rolesArr, IUserCreate, IUser } from "ente-types";

/**
 * DB
 */
import Entry from "../../models/Entry";
import Slot from "../../models/Slot";
import User, { UserModel } from "../../models/User";

/**
 * Helpers
 */
import rbac from "../../helpers/permissions";
import validate, { check } from "../../helpers/validate";
import populate, { PopulateRequest } from "../../helpers/populate";
import wrapAsync from "../../helpers/wrapAsync";
import * as _ from "lodash";
import { usersExistByUsername, usersExist } from "../../helpers/exist";
import { isEmail } from "validator";
import { omitPassword } from "../../helpers/queryParams";

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
  wrapAsync(async (req: PopulateRequest, res, next) => {
    switch (req.user.role as Roles) {
      /**
       * Admin can see all users
       */
      case Roles.ADMIN:
        req.users = await User.find().select(omitPassword);
        return next();

      /**
       * Student can see all Teachers
       */
      case Roles.STUDENT:
        req.users = await User.find({ role: Roles.TEACHER }).select(
          omitPassword
        );
        return next();

      /**
       * Manager can see all their children
       */
      case Roles.MANAGER:
        req.users = await User.find({
          _id: { $in: req.user.children }
        }).select(omitPassword);
        return next();

      /**
       * Parents can see all their children and teachers
       */
      case Roles.PARENT:
        req.users = await User.find({
          $or: [{ _id: { $in: req.user.children } }, { role: Roles.TEACHER }]
        }).select(omitPassword);
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
  [param("userId").isMongoId()],
  validate,
  wrapAsync(async (req: PopulateRequest, res, next) => {
    const { userId } = req.params;

    const user = await User.findById(userId).select(omitPassword);
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
  check(req => <IUserCreate[]>(_.isArray(req.body) ? req.body : [req.body]), [
    {
      check: us => us.every(isValidUser),
      msg: "One of the users is not valid."
    },
    {
      check: us => usersExistByUsername(us.map(u => u.username)),
      msg: "One of the users already exists."
    },
    {
      check: us =>
        usersExist(_.flatten(us.map(u => u.children)), Roles.STUDENT),
      msg: "One of the children doesn't exist."
    }
  ]),
  wrapAsync(async (req: PopulateRequest, res, next) => {
    const users: IUserCreate[] = req.body;

    const createdUsers: UserModel[] = [];
    for (const user of users) {
      const newUser = await User.create({
        children: user.children,
        email: user.email,
        role: user.role,
        displayname: user.displayname,
        password: user.password,
        isAdult: user.isAdult,
        username: user.username
      });

      if (!newUser.password) {
        // TODO: SignUp Routine, Like invitation
        newUser.forgotPassword();
      }

      createdUsers.push(newUser);
    }

    req.users = createdUsers;

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
  [
    body("role")
      .isIn(rolesArr)
      .optional(),
    body("email")
      .isEmail()
      .optional(),
    body("username")
      .isAlphanumeric()
      .optional(),
    body("displayname")
      .isAscii()
      .optional(),
    param("userId").isMongoId()
  ],
  validate,
  wrapAsync(async (req: PopulateRequest, res, next) => {
    const { userId } = req.params;

    const user = await User.findById(userId).select(omitPassword);
    if (!user) {
      return res.status(404).end("User not found");
    }

    const { email, role, displayname, children, isAdult } = req.body;

    /**
     * `email`
     */
    if (!!email && isValidEmail(email)) {
      user.set("email", email);
    }

    /**
     * `role`
     */
    if (!!role && isValidRole(role)) {
      user.set("role", role);
    }

    /**
     * `displayname`
     */
    if (!!displayname && isValidDisplayname(displayname)) {
      user.set("displayname", displayname);
    }

    /**
     * `children`
     */
    if (!!children && (await usersExist(children, Roles.STUDENT))) {
      user.set("role", role);
    }

    /**
     * `isAdult`
     */

    if (_.isUndefined(isAdult) && isValidIsAdult(isAdult)) {
      user.set("isAdult", isAdult);
    }

    await user.save();

    req.users = [user];

    return next();
  }),
  populate
);

export default usersRouter;
