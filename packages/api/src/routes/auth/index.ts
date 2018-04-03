import { Router, Response, NextFunction, Request } from "express";
import { param, validationResult, body } from "express-validator/check";
import User from "../../models/User";
import { dispatchPasswortResetSuccess } from "../../helpers/mail";
import validate from "../../helpers/validate";
import wrapAsync from "../../helpers/wrapAsync";
import { isValidPassword } from "ente-validator";

const authRouter = Router();

authRouter.post(
  "/forgot/:username",
  [param("username").isAlphanumeric()],
  validate,
  wrapAsync(async (request, response, next) => {
    const username: string = request.params.username;
    const user = await User.findOne({ username });

    if (user) {
      await user.forgotPassword();
    }

    return response
      .status(200)
      .end("If the user exists, routine got triggered.");
  })
);

authRouter.put(
  "/forgot/:token",
  [
    param("username").isHexadecimal(),
    body("newPassword").custom(isValidPassword)
  ],
  validate,
  wrapAsync(async (request, response, next) => {
    const token: string = request.params.token;
    const user = await User.findOne({ resetPasswordToken: token });

    if (!user) {
      return response.status(404).end("Token was not found.");
    }

    if (+user.resetPasswordExpires < Date.now()) {
      next();
    }

    if (+user.resetPasswordExpires >= Date.now()) {
      const newPassword = request.body.newPassword;

      user.password = newPassword;
      user.resetPasswordToken = undefined;
      user.resetPasswordExpires = undefined;

      await user.save();

      await dispatchPasswortResetSuccess(user.username, user.email);
    }

    return response.status(200).send("If token existed, it succeeded.");
  })
);

export default authRouter;
