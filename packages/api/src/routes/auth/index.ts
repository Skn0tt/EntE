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
 * DB
 */
import User from "../../models/User";

/**
 * Helpers
 */
import { dispatchPasswortResetSuccess } from "../../helpers/mail";
import validate, { check } from "../../helpers/validate";
import wrapAsync from "../../helpers/wrapAsync";

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
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(404).end("User not found");
    }

    await user.forgotPassword();

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
    const user = await User.findOne({ resetPasswordToken: token });

    if (!user) {
      return res.status(404).end("Token was not found.");
    }

    if (+user.resetPasswordExpires < Date.now()) {
      return res.status(403).end("Token expired.");
    }

    const { newPassword } = req.body;

    user.password = newPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    dispatchPasswortResetSuccess(user.username, user.email);

    return res.status(200).send("If token existed, it succeeded.");
  })
);

export default authRouter;
