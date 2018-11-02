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
