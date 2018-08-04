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

const { signerHost } = config.getConfig();

const signer = axios.create({ baseURL: `http://${signerHost}` });

const validate = async (token: string): Promise<JWT_PAYLOAD | null> => {
  try {
    const res = await signer.get<JWT_PAYLOAD>(`/tokens/${token}`);
    const payload = res.data;
    return payload;
  } catch (error) {
    return null;
  }
};

export const sign = async (payload: JWT_PAYLOAD): Promise<string> => {
  const res = await signer.post<string>(`/tokens`, payload);
  return res.data;
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
