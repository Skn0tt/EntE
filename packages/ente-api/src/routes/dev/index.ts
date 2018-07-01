/**
 * EntE
 * (c) 2017-present, Simon Knott <info@simonknott.de>
 *
 * This source code is licensed under the GNU Affero General Public License
 * found in the LICENSE file in the root directory of this source tree.
 */

import { Router } from "express";
import { dispatchWeeklySummary } from "../../helpers/mail";
import wrapAsync from "../../helpers/wrapAsync";

/**
 * Develpoment Router
 * '/dev'
 *
 * Unauthenticated
 */
const devRouter = Router();

devRouter.put(
  "/dispatchWeeklySummary",
  wrapAsync(async (request, response, next) => {
    await dispatchWeeklySummary();
    response.status(200).end("Done");
  })
);

export default devRouter;
