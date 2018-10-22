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
 * Status Router
 * '/status'
 *
 * Unauthenticated
 */
const statusRouter = Router();

/**
 * Status
 */
statusRouter.get("/", (_, res) => res.status(200).send("OK"));

export default statusRouter;
