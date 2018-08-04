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

/**
 * EntE
 */
import { JWT_PAYLOAD } from "ente-types";

/**
 * Helpers
 */
import * as jwt from "../../authentication/strategies/jwt";
import wrapAsync from "../../helpers/wrapAsync";

/**
 * Token Router
 * '/token'
 *
 * Authenticated
 */
const tokenRouter = Router();

tokenRouter.get(
  "/",
  wrapAsync(async (req, res) => {
    const payload: JWT_PAYLOAD = {
      username: req.user.username,
      displayname: req.user.displayname,
      role: req.user.role,
      children: req.user.children
    };

    const token = await jwt.sign(payload);

    return res.status(200).send(token);
  })
);

export default tokenRouter;
