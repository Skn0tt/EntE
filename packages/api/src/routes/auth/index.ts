import { Router, Response, NextFunction, Request } from "express";
import { param, validationResult } from "express-validator/check";
import * as JWT from "jsonwebtoken";
import User from "../../models/User";
import { dispatchPasswortResetSuccess } from "../../helpers/mail";

const authRouter = Router();

authRouter.post(
  "/forgot/:username",
  [param("username").isAlphanumeric()],
  async (request: Request, response: Response, next: NextFunction) => {
    const errors = validationResult(request);
    if (!errors.isEmpty())
      return response.status(422).json({ errors: errors.mapped() });

    try {
      const username: string = request.params.username;
      const user = await User.findOne({ username });

      if (user) {
        await user.forgotPassword();
      }

      return response
        .status(200)
        .end("If the user exists, routine got triggered.");
    } catch (error) {
      return next(error);
    }
  }
);

authRouter.put("/forgot/:token", async (request, response, next) => {
  try {
    const token: string = request.params.token;
    const user = await User.findOne({ resetPasswordToken: token });

    if (!user) {
      return response.status(404).end();
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
  } catch (error) {
    return next(error);
  }
});

export default authRouter;
