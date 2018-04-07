import { IUserCreate, rolesArr, Roles } from "ente-types";
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

export const isValidMongoId: SyncValidator<string> = v =>
  /^[a-f\d]{24}$/i.test(v);

export const isValidRole: SyncValidator<string> = role =>
  rolesArr.indexOf(role) !== -1;

// http://emailregex.com/
export const isValidEmail: SyncValidator<string> = email =>
  /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
    email
  );

export const isValidUserExcludingChildren: SyncValidator<IUserCreate> = matches([
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
    u.children.length === 0
])

export const isValidUser: SyncValidator<IUserCreate> = matches([
  isValidUserExcludingChildren,
  u => u.children.every(c => isValidMongoId(c)),
]);
