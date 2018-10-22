/**
 * EntE
 * (c) 2017-present, Simon Knott <info@simonknott.de>
 *
 * This source code is licensed under the GNU Affero General Public License
 * found in the LICENSE file in the root directory of this source tree.
 */

/**
 * Express
 */
import { Router } from "express";
import { param } from "express-validator/check";

/**
 * EntE
 */
import { Roles, IUser } from "ente-types";

/**
 * Helpers
 */
import rbac from "../../helpers/permissions";
import populate from "../../helpers/populate";
import wrapAsync from "../../helpers/wrapAsync";
import validate from "../../helpers/validate";
import { Slot } from "ente-db";
import logger from "../../helpers/logger";

/**
 * Slots Router
 * '/slots'
 *
 * Authenticated
 */
const slotsRouter = Router();

/**
 * GET all slots for user
 */
slotsRouter.get(
  "/",
  rbac({ slots_read: true }),
  wrapAsync(async (req, res, next) => {
    const { username, role } = req.user as IUser;
    logger.info(`User ${username} (${role}) requested all of his slots.`);
    switch (req.user.role) {
      /**
       * Teachers have access to all of their slots
       */
      case Roles.TEACHER:
        req.slots = await Slot.allThisYearByTeacher(req.user._id);
        return next();

      /**
       * Managers / Parents have access to all of their childrens slots
       */
      case Roles.MANAGER:
      case Roles.PARENT:
        req.slots = await Slot.allThisYearByStudents([req.user.children]);
        return next();

      /**
       * Students have access to all of their slots
       */
      case Roles.STUDENT:
        req.slots = await Slot.allThisYearByStudents([req.user._id]);
        return next();

      /**
       * Admins have access to all slots
       */
      case Roles.ADMIN:
        req.slots = await Slot.allThisYear();
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
  [param("slotId").isUUID()],
  validate,
  wrapAsync(async (req, res, next) => {
    const { slotId } = req.params;

    const slot = await Slot.findById(slotId);

    return slot.cata(
      () => res.status(404).end("Slot not found."),
      slot => {
        const { username, role } = req.user as IUser;
        logger.info(`User ${username} (${role}) requested all of his slots.`);

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
      }
    );
  }),
  populate
);

export default slotsRouter;
