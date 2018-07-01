/**
 * EntE
 * (c) 2017-present, Simon Knott <info@simonknott.de>
 *
 * This source code is licensed under the GNU Affero General Public License
 * found in the LICENSE file in the root directory of this source tree.
 */

import * as JWT from "jsonwebtoken";
import { Strategy as BearerStrategy } from "passport-http-bearer";
import { promisify } from "util";
import { JWT_PAYLOAD } from "ente-types";
import { User } from "ente-db";
import axios from "axios";

type Secrets = {
  old: string;
  current: string;
};
export const getSecrets = async (): Promise<Secrets> => {
  const response = await axios.get<Secrets>("http://rotator/secrets");
  return response.data;
};

export const getFirstSecret = async () => (await getSecrets()).current;

const validate = async (token: string): Promise<JWT_PAYLOAD | null> => {
  try {
    // Get Secrets
    const { old: oldSecret, current: currentSecret } = await getSecrets();

    try {
      // current secret
      const payload = JWT.verify(token, currentSecret) as JWT_PAYLOAD;
      return payload;
    } catch (error) {
      try {
        // old secret
        const oldPayload = JWT.verify(token, oldSecret) as JWT_PAYLOAD;
        return oldPayload;
      } catch (error) {
        // both are wrong
        return null;
      }
    }
  } catch (error) {
    throw error;
  }
};

const jwtStrategy = new BearerStrategy(async (token, done) => {
  try {
    const payload = await validate(token);
    if (!payload) {
      return done(null, false);
    }

    const { username, role } = payload;
    const user = await User.findByRoleAndUsername(role, username);

    return done(null, user || false);
  } catch (error) {
    return done(error, false);
  }
});

export default jwtStrategy;
