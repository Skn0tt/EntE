/**
 * EntE
 * (c) 2017-present, Simon Knott <info@simonknott.de>
 *
 * This source code is licensed under the GNU Affero General Public License
 * found in the LICENSE file in the root directory of this source tree.
 */

import { User } from "ente-db";
import { BasicStrategy } from "passport-http";
import logger from "../../helpers/logger";

const basicStrategy = new BasicStrategy(async (username, password, done) => {
  try {
    const user = await User.checkPassword(username, password);

    const success = !!user;
    if (success) {
      logger.debug(`BasicAuth: Successfully authenticated ${username}`);
      done(null, user);
    } else {
      logger.debug(
        `BasicAuth: Unsuccessfull authentication attempt by ${username}.`
      );
      done(null, false);
    }
  } catch (error) {
    logger.debug(`BasicAuth: Error at authenticating ${username}`, error);
    return done(error, false);
  }
});

export default basicStrategy;
