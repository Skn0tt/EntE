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
import { param, body } from "express-validator/check";

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
import validate from "../../helpers/validate";
import wrapAsync from "../../helpers/wrapAsync";
import { User } from "ente-db";
import logger from "ente-api/src/helpers/logger";

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
  wrapAsync(async (req, res) => {
    const username: string = req.params.username;

    const result = await User.forgotPassword(username);
    return result.cata(
      () => res.status(404).end("User not found"),
      ({ token, email }) => {
        dispatchPasswortResetLink(token, username, email);

        return res.status(200).end();
      }
    );
  })
);

/**
 * PUT a new password
 */
authRouter.put(
  "/forgot/:token",
  [param("token").isHexadecimal(), body("newPassword").custom(isValidPassword)],
  validate,
  wrapAsync(async (req, res) => {
    const { token } = req.params;

    const { newPassword } = req.body;
    const result = await User.setPassword(token, newPassword);
    return result.cata(
      () => res.status(404).end("Token was not found."),
      ({ username, email }) => {
        logger.info(`Set new password for ${username}.`);

        dispatchPasswortResetSuccess(username, email);

        return res.status(200).end();
      }
    );
  })
);

export default authRouter;
