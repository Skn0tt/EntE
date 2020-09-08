/**
 * EntE
 * (c) 2017-present, Simon Knott <info@simonknott.de>
 *
 * This source code is licensed under the GNU Affero General Public License
 * found in the LICENSE file in the root directory of this source tree.
 */

import { rolesArr } from "../roles";
import * as _ from "lodash";
import {
  isLength,
  matches,
  not,
  containsSpaces,
  containsForbiddenChars,
  SyncValidator,
} from "./shared";
import { containsUnknownChar } from "./containsUnknownChar";
import { Validator } from "class-validator";

const v = new Validator();

export const isValidClass: SyncValidator<string> = (s) => v.isAscii(s);

/**
 * Validates a username
 * Rules:
 * - 1-100 characters
 * - Can contain numbers
 * - No Special Characters
 */
export const isValidUsername: SyncValidator<string> = matches([
  isLength(1, 100),
  not(containsUnknownChar),
  not(containsForbiddenChars),
  not(containsSpaces),
]);

/**
 * Validates a firstname / lastname
 * Rules:
 * - 8-100 Characters
 * - No Special Characters
 */
export const isValidName: SyncValidator<string> = matches([
  isLength(1, 100),
  not(containsForbiddenChars),
]);

export const isValidUuid: SyncValidator<string> = (v) =>
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
    v
  );

export const isValidRole: SyncValidator<string> = (role) =>
  rolesArr.indexOf(role) !== -1;

// http://emailregex.com/
export const isValidEmail: SyncValidator<string> = (email) =>
  /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
    email
  );

export const isValidUuidOrUsername: SyncValidator<string> = (v) =>
  isValidUuid(v) || isValidUsername(v);
