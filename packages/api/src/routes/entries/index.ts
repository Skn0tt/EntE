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
import { Roles, IEntryCreate, IEntry, EntryId } from "ente-types";

/**
 * Helpers
 */
import rbac, {
  check as permissionsCheck,
  Permissions
} from "../../helpers/permissions";
import populate, { PopulateRequest } from "../../helpers/populate";
import wrapAsync from "../../helpers/wrapAsync";
import * as mail from "../../helpers/mail";
import validate from "../../helpers/validate";
import { isValidEntry } from "ente-validator";
import * as _ from "lodash";
import { Entry, User, Slot } from "ente-db";

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
  wrapAsync(async (req, res, next) => {
    switch (req.user.role as Roles) {
      /**
       * Admin: Return all Entries in this year
       */
      case Roles.ADMIN:
        req.entries = await Entry.allThisYear();
        return next();

      /**
       * Parent / Manager: Return all Entries of child
       */
      case Roles.PARENT:
      case Roles.MANAGER:
        req.entries = await Entry.allThisYearBy(req.user.children);
        return next();

      /**
       * Student: Return own Entries
       */
      case Roles.STUDENT:
        req.entries = await Entry.allThisYearBy([req.user._id]);
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
  [param("entryId").isUUID()],
  validate,
  wrapAsync(async (req, res, next) => {
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
  wrapAsync(async (req, res, next) => {
    const entry: IEntryCreate = {
      ...req.body,
      date: new Date(req.body.date),
      dateEnd: req.body.dateEnd && new Date(req.body.dateEnd),
      student: req.user.role === Roles.PARENT ? req.body.student : req.user._id
    };

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
    const teacherIds = entry.slots.map(s => s.teacher);

    const allTeachersExist =
      teacherIds.length === 0 || (await User.exist(teacherIds, Roles.TEACHER));
    if (!allTeachersExist) {
      return res.status(422).end("One of the teachers does not exist.");
    }

    /**
     * Create
     */
    const signedParent: boolean =
      req.user.role === Roles.PARENT || req.user.isAdult;
    const { entry: newEntry } = await Entry.create(entry, signedParent);

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
  [param("entryId").isUUID()],
  validate,
  wrapAsync(async (req, res, next) => {
    const entryId = req.params.entryId;
    const { forSchool } = req.body;

    const entry = await Entry.setForSchool(forSchool)(e =>
      req.user.children.includes(e.student)
    )(entryId);
    if (!entry) {
      return res.status(404).end("Couldnt find Entry.");
    }

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
  [param("entryId").isUUID(), body("value").isBoolean()],
  validate,
  wrapAsync(async (req, res, next) => {
    const entryId: EntryId = req.params.entryId;
    const value: boolean = req.body.value;

    /**
     * User cannot sign entry that doesnt belong to child
     */
    const checkIsParent = (e: IEntry) => req.user.children.includes(e.student);

    /**
     * Sign
     */
    let entry: IEntry | null = null;
    switch (req.user.role) {
      case Roles.MANAGER:
        entry = await Entry.setSignedManager(value)(checkIsParent)(entryId);
        break;
      case Roles.PARENT:
        if (value) {
          entry = await Entry.setSignedParent(true)(checkIsParent)(entryId);
        }
        break;
      default:
        return next();
    }

    if (!entry) {
      return res.status(404).end("Couldnt find Entry.");
    }

    /**
     * Dispatch Mail
     */
    if (req.user.role === Roles.PARENT) {
      mail.dispatchSignedInformation(entry);
    }

    if (!!entry) {
      req.entries = [entry];
    }

    return next();
  }),
  populate
);

export default entriesRouter;
