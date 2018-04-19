/**
 * Express
 */
import { Router, Response, NextFunction, Request } from "express";
import { param, validationResult, body } from "express-validator/check";

/**
 * EntE
 */
import { isValidPassword, isValidUsername } from "ente-validator";

/**
 * Helpers
 */
import {
  dispatchPasswortResetSuccess,
  dispatchPasswortResetLink
} from "../../helpers/mail";
import validate, { check } from "../../helpers/validate";
import wrapAsync from "../../helpers/wrapAsync";
import { User } from "ente-db";

/**
 * Auth Router
 * '/auth'
 *
 * Unauthenticated
 */
const authRouter = Router();

/**
 * POST a new reset request
 */
authRouter.post(
  "/forgot/:username",
  [param("username").custom(isValidUsername)],
  validate,
  wrapAsync(async (req, res, next) => {
    const username: string = req.params.username;

    const result = await User.forgotPassword(username);
    if (!result) {
      return res.status(404).end("User not found");
    }

    const { token, email } = result;

    dispatchPasswortResetLink(token, username, email);

    return res.status(200).end();
  })
);

/**
 * PUT a new password
 */
authRouter.put(
  "/forgot/:token",
  [param("token").isHexadecimal(), body("newPassword").custom(isValidPassword)],
  validate,
  wrapAsync(async (req, res, next) => {
    const { token } = req.params;

    const { newPassword } = req.body;
    const result = await User.setPassword(token, newPassword);
    if (!result) {
      return res.status(404).end("Token was not found.");
    }

    dispatchPasswortResetSuccess(result.username, result.email);

    return res.status(200).end();
  })
);

export default authRouter;
