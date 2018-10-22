/**
 * EntE
 * (c) 2017-present, Simon Knott <info@simonknott.de>
 *
 * This source code is licensed under the GNU Affero General Public License
 * found in the LICENSE file in the root directory of this source tree.
 */

import { Strategy as BearerStrategy } from "passport-http-bearer";
import { JWT_PAYLOAD } from "ente-types";
import * as config from "../../helpers/config";
import { User } from "ente-db";
import axios from "axios";
import logger from "../../helpers/logger";

const { signerHost } = config.getConfig();

const signer = axios.create({ baseURL: `http://${signerHost}` });

const validate = async (token: string): Promise<JWT_PAYLOAD | null> => {
  try {
    const res = await signer.get<JWT_PAYLOAD>(`/tokens/${token}`);
    const payload = res.data;
    return payload;
  } catch (error) {
    logger.error(`JwtAuth: Error reaching downstream service "signer"`, error);
    return null;
  }
};

export const sign = async (payload: JWT_PAYLOAD): Promise<string> => {
  try {
    const res = await signer.post<string>(`/tokens`, payload);
    logger.info(
      `JwtAuth: Created a new JWT Token with paylaod ${JSON.stringify(payload)}`
    );
    return res.data;
  } catch (error) {
    logger.error(`Error posting to signer: ${error}`);
  }
};

const jwtStrategy = new BearerStrategy(async (token, done) => {
  try {
    const payload = await validate(token);
    if (!payload) {
      return done(null, false);
    }

    const { username, role } = payload;
    logger.debug(`JwtAuth: Successfully validated token for ${username}`, role);
    const user = await User.findByRoleAndUsername(role, username);

    const foundUser = !!user;
    if (foundUser) {
      logger.debug(`JwtAuth: Successfully authenticated ${username}`);
      done(null, user);
    } else {
      logger.debug(`JwtAuth: User "${username}" not found`);
      done(null, false);
    }
  } catch (error) {
    return done(error, false);
  }
});

export default jwtStrategy;
