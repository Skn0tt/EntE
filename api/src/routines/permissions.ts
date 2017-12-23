import { ROLES } from '../constants';

interface Permissions {
  slots_read?: boolean;
  slots_write?: boolean;
  entries_read?: boolean;
  entries_create?: boolean;
  entries_write?: boolean;
  users_read?: boolean;
  users_write?: boolean;
}

const adminPermissions: Permissions = {
  slots_read: true,
  slots_write: true,
  entries_read: true,
  entries_create: true,
  entries_write: true,
  users_read: true,
  users_write: true,
};

const studentPermissions: Permissions = {
  slots_read: true,
  slots_write: false,
  entries_read: true,
  entries_create: true,
  entries_write: false,
  users_read: false,
  users_write: false,
};

const parentPermissions: Permissions = {
  slots_read: true,
  slots_write: false,
  entries_read: true,
  entries_create: true,
  entries_write: true,
  users_read: false,
  users_write: false,
};

const teacherPermissions: Permissions = {
  slots_read: true,
  slots_write: true,
  entries_read: true,
  entries_create: false,
  entries_write: false,
  users_read: false,
  users_write: false,
};

/**
 * Compares a user permission set against what he needs
 * @param has
 * @param needs
 */
const compare = (has: Permissions, needs: Permissions) : boolean => {
  let result = true;
  Object.keys(needs).forEach((key) => {
    if (needs[key] && !has[key]) result = false;
  });

  return result;
};

/**
 * Checks wether user can access API endpoint
 * @param role that the user has
 * @param neededPermissions that the api needs
 * @returns true when valid
 */
const check = (role: ROLES, neededPermissions: Permissions) : boolean => {
  if (role === ROLES.ADMIN) return compare(adminPermissions, neededPermissions);
  if (role === ROLES.TEACHER) return compare(teacherPermissions, neededPermissions);
  if (role === ROLES.PARENT) return compare(parentPermissions, neededPermissions);
  if (role === ROLES.STUDENT) return compare(studentPermissions, neededPermissions);
  return false;
};

export {
  check,
  Permissions,
};
