/**
 * EntE
 * (c) 2017-present, Simon Knott <info@simonknott.de>
 *
 * This source code is licensed under the GNU Affero General Public License
 * found in the LICENSE file in the root directory of this source tree.
 */

import {
  isLength,
  containsNumbers,
  matches,
  containsSpecialChars,
  SyncValidator,
} from "./shared";

/**
 * Checks a password for being valid.
 * Rules:
 * - 8-100 characters
 * - >=1 number
 * - >=1 special character ( ?!&/(!"") )
 * - can contain spaces
 */
export const isValidPassword: SyncValidator<string> = matches([
  isLength(8, 100),
  containsNumbers,
  containsSpecialChars,
]);
