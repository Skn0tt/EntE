/**
 * EntE
 * (c) 2017-present, Simon Knott <info@simonknott.de>
 *
 * This source code is licensed under the GNU Affero General Public License
 * found in the LICENSE file in the root directory of this source tree.
 */

import { rolesArr, Roles } from "ente-types";
import { SyncValidator, isValidPassword } from "./";
import * as _ from "lodash";
import {
  isLength,
  matches,
  containsSpecialChars,
  not,
  containsSpaces,
  containsSpecialCharsAll
} from "./shared";
import { CreateUserDto, PatchUserDto } from "../dtos";
import { url } from "inspector";

/**
 * Validates a username
 * Rules:
 * - 4-100 characters
 * - Can contain numbers
 * - No Special Characters
 */
export const isValidUsername: SyncValidator<string> = matches([
  isLength(4, 100),
  not(containsSpecialCharsAll),
  not(containsSpaces)
]);

/**
 * Validates a Displayname
 * Rules:
 * - 8-100 Characters
 * - No Special Characters
 */
export const isValidDisplayname: SyncValidator<string> = matches([
  isLength(8, 100),
  not(containsSpecialChars)
]);

export const isValidUuid: SyncValidator<string> = v =>
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
    v
  );

export const isValidRole: SyncValidator<string> = role =>
  rolesArr.indexOf(role) !== -1;

// http://emailregex.com/
export const isValidEmail: SyncValidator<string> = email =>
  /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
    email
  );

export const isValidCreateUserExcludingChildren: SyncValidator<
  CreateUserDto
> = matches([
  u => isValidDisplayname(u.displayname),
  u => isValidUsername(u.username),
  u => isValidRole(u.role),
  u => isValidEmail(u.email),
  // If password exists, must be valid
  u => !u.password || isValidPassword(u.password),
  // If not STUDENT, must not be adult
  u => u.role === Roles.STUDENT || !u.isAdult,
  // if not MANAGER or PARENT, must not have children
  u =>
    [Roles.MANAGER, Roles.PARENT].indexOf(u.role) !== -1 ||
    u.children.length === 0,
  u => ![Roles.STUDENT, Roles.MANAGER].includes(u.role) || !!u.graduationYear
]);

export const isValidCreateUser: SyncValidator<CreateUserDto> = matches([
  isValidCreateUserExcludingChildren,
  u => u.children.every(c => isValidUuid(c))
]);

export const isValidUserPatch: SyncValidator<PatchUserDto> = matches([
  u => !u.children || u.children.every(isValidUuid),
  u => !u.displayname || isValidDisplayname(u.displayname),
  u => !u.email || isValidEmail(u.email),
  u => !u.role || isValidRole(u.role)
]);
