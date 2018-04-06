/**
 * Express
 */
import {
  Router,
  Response,
  Request,
  RequestHandler,
  NextFunction
} from "express";
import { body, validationResult, param } from "express-validator/check";

/**
 * EntE
 */
import { MongoId, Roles, IEntryCreate } from "ente-types";

/**
 * DB
 */
import Entry, { EntryModel } from "../../models/Entry";
import Slot, { ISlot } from "../../models/Slot";
import User from "../../models/User";

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
import * as mail from "../../helpers/mail";
import validate from "../../helpers/validate";
import { usersExist } from "../../helpers/exist";
import { isValidEntry } from "ente-validator";
import * as _ from "lodash";

/**
 * Entries Router
 * '/entries'
 *
 * Authenticated
 */
const entriesRouter = Router();

/**
 * # GET all entries for user
 */
entriesRouter.get(
  "/",
  rbac({ entries_read: true }),
  wrapAsync(async (req: PopulateRequest, res, next) => {
    switch (req.user.role as Roles) {
      /**
       * Admin: Return all Entries in this year
       */
      case Roles.ADMIN:
        req.entries = await Entry.find({
          ...thisYear
        });
        return next();

      /**
       * Parent / Manager: Return all Entries of child
       */
      case Roles.PARENT:
      case Roles.MANAGER:
        req.entries = await Entry.find({
          student: { $in: req.user.children },
          ...thisYear
        });
        return next();

      /**
       * Student: Return own Entries
       */
      case Roles.STUDENT:
        req.entries = await Entry.find({
          student: req.user._id,
          ...thisYear
        });
        return next();

      /**
       * Default: Forbidden
       */
      default:
        return res.status(403).end();
    }
  }),
  populate
);

/**
 * # GET specific entry
 */
entriesRouter.get(
  "/:entryId",
  rbac({ entries_read: true }),
  [param("entryId").isMongoId()],
  validate,
  wrapAsync(async (req: PopulateRequest, res, next) => {
    const { entryId } = req.params;
    const entry = await Entry.findById(entryId);

    if (entry === null) {
      return res.status(404).end("Couldnt find Entry.");
    }

    req.entries = [entry];

    return next();
  }),
  populate
);

/**
 * # POST a new entry
 */
entriesRouter.post(
  "/",
  rbac({ entries_create: true }),
  wrapAsync(async (req: PopulateRequest, res, next) => {
    const entry: IEntryCreate = {
      ...req.body,
      date: new Date(req.body.date),
      dateEnd: req.body.dateEnd && new Date(req.body.dateEnd),
      student: req.user.role === Roles.PARENT ? req.body.student : req.user._id
    };

    console.log(entry);

    /**
     * Check if entry is Valid
     */
    if (!isValidEntry(entry)) {
      return res.status(422).end("Entry invalid.");
    }

    /**
     * Parents can only create Entry for his own children
     */
    if (
      req.user.role === Roles.PARENT &&
      !_.includes(req.user.children, entry.student)
    ) {
      return res
        .status(403)
        .end("Can only create an entry for your own child.");
    }

    /**
     * Make sure that all teachers in slots:
     * - Exist
     * - are teachers
     */
    const allTeachersExist = await usersExist(
      _.flatten(entry.slots.map(s => s.teacher)),
      Roles.TEACHER
    );
    if (!allTeachersExist) {
      return res.status(422).end("One of the teachers does not exist.");
    }

    /**
     * Create Slots
     */
    const slots: MongoId[] = [];
    for (const slot of req.body.slots) {
      const newSlot = await Slot.create({
        date: req.body.date,
        hour_from: slot.hour_from,
        hour_to: slot.hour_to,
        teacher: slot.teacher,
        student: req.body.student || req.user._id
      });

      slots.push(newSlot._id);
    }

    /**
     * Entry is signed when
     * - creator is parent
     *  or
     * - user is adult
     */
    const signedParent: boolean =
      req.user.role === Roles.PARENT || req.user.isAdult;

    const newEntry = await Entry.create({
      ...entry,
      slots,
      signedParent
    });

    /**
     * Dispatch Sign Request
     */
    if (!newEntry.signedParent) {
      mail.dispatchSignRequest(newEntry);
    }

    req.entries = [newEntry];

    return next();
  }),
  populate
);

/**
 * # PATCH existing Entry
 * Editable fields:
 * - forSchool
 */
entriesRouter.patch(
  "/:entryId",
  rbac({
    entries_patch: true
  }),
  [param("entryId").isMongoId()],
  validate,
  wrapAsync(async (req: PopulateRequest, res, next) => {
    const entryId = req.params.entryId;
    const { forSchool } = req.body;

    const entry = await Entry.findById(entryId);
    if (!entry) {
      return res.status(404).end("Couldnt find Entry.");
    }

    /**
     * Manager needs entry student in his children
     */
    if (req.user.children.includes(entry.student)) {
      return res.status(403).end("Student is not your child.");
    }

    entry.set("forSchool", forSchool);
    await entry.save();

    req.entries = [entry];

    return next();
  }),
  populate
);

/**
 * PUT Signature on  Entry
 */
entriesRouter.put(
  "/:entryId/signed",
  rbac({ entries_sign: true }),
  [param("entryId").isMongoId(), body("value").isBoolean()],
  validate,
  wrapAsync(async (req: PopulateRequest, res, next) => {
    const entryId: MongoId = req.params.entryId;
    const value: boolean = req.body.value;

    const entry = await Entry.findById(entryId);
    if (!entry) {
      return res.status(404).end("Couldnt find Entry.");
    }

    /**
     * User cannot sign entry that doesnt belong to child
     */
    if (req.user.children.includes(entry.student)) {
      return res.status(403).end("Entry doesnt belong to your children");
    }

    /**
     * Sign
     */
    switch (req.user.role) {
      case Roles.MANAGER:
        entry.setSignatureManager(value);
        break;
      case Roles.PARENT:
        if (value) {
          entry.signParent();
        }
        break;
      default:
        return next();
    }
    await entry.save();

    /**
     * When both signedManager and signedParent, sign slots too
     */
    if (entry.signedManager && entry.signedParent) {
      const slots = await Slot.find({ _id: { $in: entry.slots } });
      slots.forEach(slot => slot.sign());

      /**
       * Save Slots
       */
      await Promise.all(slots.map(async s => await s.save()));
    }

    /**
     * Dispatch Mail
     */
    if (req.user.role === Roles.PARENT) {
      mail.dispatchSignedInformation(entry);
    }

    req.entries = [entry];
    return next();
  }),
  populate
);

export default entriesRouter;
