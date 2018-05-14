/**
 * EntE
 * (c) 2017-present, Simon Knott <info@simonknott.de>
 * 
 * This source code is licensed under the GNU Affero General Public License
 * found in the LICENSE file in the root directory of this source tree.
 */

import { Roles, UserId } from "./types";

export type JWT_PAYLOAD = {
  username: string;
  displayname: string;
  role: Roles;
  children: UserId[];
};
