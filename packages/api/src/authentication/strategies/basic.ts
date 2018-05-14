/**
 * EntE
 * (c) 2017-present, Simon Knott <info@simonknott.de>
 *
 * This source code is licensed under the GNU Affero General Public License
 * found in the LICENSE file in the root directory of this source tree.
 */

import { User } from "ente-db";
import { BasicStrategy } from "passport-http";

const basicStrategy = new BasicStrategy(async (username, password, done) => {
  try {
    const user = await User.checkPassword(username, password);

    return done(null, user || false);
  } catch (error) {
    return done(error, false);
  }
});

export default basicStrategy;
