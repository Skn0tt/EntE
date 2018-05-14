/**
 * EntE
 * (c) 2017-present, Simon Knott <info@simonknott.de>
 * 
 * This source code is licensed under the GNU Affero General Public License
 * found in the LICENSE file in the root directory of this source tree.
 */

import { RequestHandler } from "express";

const wrapAsync = (fn: RequestHandler): RequestHandler => (req, res, next) =>
  fn(req, res, next).catch(next);

export default wrapAsync;
