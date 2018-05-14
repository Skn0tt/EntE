/**
 * EntE
 * (c) 2017-present, Simon Knott <info@simonknott.de>
 * 
 * This source code is licensed under the GNU Affero General Public License
 * found in the LICENSE file in the root directory of this source tree.
 */

import { RequestHandler } from "express";
import { Roles } from "ente-types";
import * as _ from "lodash";

interface Permissions {
  slots_read?: boolean;
  entries_read?: boolean;
  entries_create?: boolean;
  entries_write?: boolean;
  entries_sign?: boolean;
  entries_patch?: boolean;
  users_read?: boolean;
  users_write?: boolean;
}

const adminPermissions: Permissions = {
  slots_read: true,
  entries_read: true,
  entries_create: false,
  entries_write: false,
  entries_sign: false,
  entries_patch: false,
  users_read: true,
  users_write: true
};

const managerPermissions: Permissions = {
  slots_read: true,
  entries_read: true,
  entries_create: false,
  entries_sign: true,
  entries_write: true,
  entries_patch: true,
  users_read: true,
  users_write: false
};

const studentPermissions: Permissions = {
  slots_read: true,
  entries_read: true,
  entries_create: true,
  entries_write: false,
  entries_sign: false,
  entries_patch: false,
  users_read: true,
  users_write: false
};

const parentPermissions: Permissions = {
  slots_read: true,
  entries_read: true,
  entries_create: true,
  entries_write: false,
  entries_sign: true,
  entries_patch: false,
  users_read: true,
  users_write: false
};

const teacherPermissions: Permissions = {
  slots_read: true,
  entries_read: false,
  entries_create: false,
  entries_write: false,
  entries_sign: false,
  entries_patch: false,
  users_read: false,
  users_write: false
};

const perms = {
  [Roles.ADMIN]: adminPermissions,
  [Roles.MANAGER]: managerPermissions,
  [Roles.PARENT]: parentPermissions,
  [Roles.STUDENT]: studentPermissions,
  [Roles.TEACHER]: teacherPermissions
};

/**
 * Compares a user permission set against what he needs
 * @param has
 * @param needs
 */
export const compare = (has: Permissions, needs: Permissions): boolean =>
  _.every(needs, (v, rule) => !v || (has as any)[rule]);

/**
 * Checks wether user can access API endpoint
 * @param role that the user has
 * @param neededPermissions that the api needs
 * @returns true when valid
 */
const check = (role: Roles, neededPermissions: Permissions): boolean =>
  compare(perms[role], neededPermissions);

export { check, Permissions };

const rbac = (neededPermissions: Permissions): RequestHandler => (
  req,
  res,
  next
) => {
  if (!check(req.user!.role, neededPermissions)) {
    return res.status(403).end();
  }

  next();
};

export default rbac;
