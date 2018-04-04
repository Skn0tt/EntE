/**
 * Express
 */
import { Router, Request, RequestHandler } from "express";
import { validationResult, param } from "express-validator/check";

/**
 * EntE
 */
import { MongoId, Roles } from "ente-types";

/**
 * DB
 */
import User from "../../models/User";
import Slot, { SlotModel } from "../../models/Slot";

/**
 * Helpers
 */
import rbac, {
  check as permissionsCheck,
  Permissions
} from "../../helpers/permissions";
import populate, { PopulateRequest } from "../../helpers/populate";
import wrapAsync from "../../helpers/wrapAsync";
import { thisYear } from "../../helpers/queryParams";
import validate from "../../helpers/validate";

/**
 * Slots Router
 * '/slots'
 */
const slotsRouter = Router();

/**
 * GET all slots for user
 */
const oneYearBefore = new Date(+new Date() - 365 * 24 * 60 * 60 * 1000);
const yearParams = { date: { $gte: oneYearBefore } };
slotsRouter.get(
  "/",
  rbac({ slots_read: true }),
  wrapAsync(async (req: PopulateRequest, res, next) => {
    switch (req.user.role) {
      /**
       * Teachers have access to all of their slots
       */
      case Roles.TEACHER:
        req.slots = await Slot.find({
          teacher: req.user._id,
          ...thisYear
        });
        return next();

      /**
       * Managers / Parents have access to all of their childrens slots
       */
      case Roles.MANAGER:
      case Roles.PARENT:
        req.slots = await Slot.find({
          student: { $in: req.user.children },
          ...thisYear
        });
        return next();

      /**
       * Students have access to all of their slots
       */
      case Roles.STUDENT:
        req.slots = await Slot.find({
          student: req.user._id,
          ...thisYear
        });
        return next();

      /**
       * Admins have access to all slots
       */
      case Roles.ADMIN:
        req.slots = await Slot.find({
          ...thisYear
        });
        return next();

      default:
        return res.status(403).end();
    }
  }),
  populate
);

/**
 * GET specific slot
 */
slotsRouter.get(
  "/:slotId",
  rbac({ slots_read: true }),
  [param("slotId").isMongoId()],
  validate,
  wrapAsync(async (req: PopulateRequest, res, next) => {
    const { slotId } = req.params;

    const slot = await Slot.findById(slotId);

    if (!slot) {
      return res.status(404).end("Slot not found.");
    }

    /**
     * Authorization
     */
    switch (req.user.role as Roles) {
      /**
       * Parent / Manger has acces to slots of their children
       */
      case Roles.PARENT:
      case Roles.MANAGER:
        if (!req.user.children.includes(slot.student)) {
          return res.status(403);
        }
        break;

      /**
       * Teacher has access to their slots
       */
      case Roles.TEACHER:
        if (req.user._id !== slot.teacher) {
          return res.status(403);
        }
        break;

      /**
       * Student has access to their slots
       */
      case Roles.STUDENT:
        if (req.user._id !== slot.student) {
          return res.status(403);
        }
        break;

      default:
        break;
    }

    req.slots = [slot];

    return next();
  }),
  populate
);

export default slotsRouter;
