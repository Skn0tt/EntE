/**
 * EntE
 * (c) 2017-present, Simon Knott <info@simonknott.de>
 *
 * This source code is licensed under the GNU Affero General Public License
 * found in the LICENSE file in the root directory of this source tree.
 */

export enum Roles {
  PARENT = "parent",
  STUDENT = "student",
  TEACHER = "teacher",
  ADMIN = "admin",
  MANAGER = "manager"
}

export const rolesArr = Object.keys(Roles).map(key => (Roles as any)[key]);

export const TEACHING_ROLES = [Roles.TEACHER, Roles.MANAGER];

export const roleHasGraduationYear = (role: Roles) =>
  [Roles.STUDENT, Roles.MANAGER].includes(role);

export const roleHasChildren = (role: Roles) => role === Roles.PARENT;

export const roleIsTeaching = (role: Roles) => TEACHING_ROLES.includes(role);

export const roleHasBirthday = (role: Roles) => role === Roles.STUDENT;
