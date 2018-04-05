import { IUserCreate, rolesArr, Roles } from "ente-types";
import { SyncValidator } from "./";
import * as _ from "lodash";
import {
  isLength,
  matches,
  containsSpecialChars,
  not,
  containsSpaces
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
  not(containsSpecialChars),
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

export const isValidRole: SyncValidator<string> = role =>
  rolesArr.indexOf(role) !== -1;

// http://emailregex.com/
export const isValidEmail: SyncValidator<string> = email =>
  /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
    email
  );

export const isValidUser: SyncValidator<IUserCreate> = matches([
  u => isValidDisplayname(u.displayname),
  u => isValidUsername(u.username),
  u => isValidRole(u.role),
  u => isValidEmail(u.email),
  // If not STUDENT, must not be adult
  u => u.role === Roles.STUDENT || !u.isAdult,
  // if not MANAGER or PARENT, must not have children
  u =>
    [Roles.MANAGER, Roles.PARENT].indexOf(u.role) !== -1 ||
    u.children.length === 0
]);
