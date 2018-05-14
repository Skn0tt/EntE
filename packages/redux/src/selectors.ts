/**
 * EntE
 * (c) 2017-present, Simon Knott <info@simonknott.de>
 * 
 * This source code is licensed under the GNU Affero General Public License
 * found in the LICENSE file in the root directory of this source tree.
 */

import {
  AppState,
  User,
  Slot,
  Entry,
  userIsTeacher,
  userIsStudent
} from "./types";
import { createSelector } from "reselect";
import { Roles, EntryId, UserId, SlotId } from "ente-types";

type Selector<T> = (state: AppState) => T;

/**
 * State
 */
export const isLoading: Selector<boolean> = state => state.get("loading") > 0;
export const getMessages: Selector<String[]> = state =>
  state.get("messages").toArray();

/**
 * Auth
 */
export const isAuthValid: Selector<boolean> = state =>
  state.getIn(["auth", "token"]) !== "" &&
  +(state.getIn(["auth", "exp"]) as Date) < Date.now();
export const isParent: Selector<boolean> = state =>
  state.getIn(["auth", "role"]) === Roles.PARENT;

export const getRole: Selector<Roles> = state => state.getIn(["auth", "role"]);

export const hasChildren = createSelector(
  [getRole],
  role => role === Roles.MANAGER || role === Roles.PARENT
);
export const canCreateEntries = createSelector(
  [getRole],
  role => role === Roles.STUDENT || role === Roles.PARENT
);
export const getToken: Selector<string> = state =>
  state.getIn(["auth", "token"]);
export const getChildren: Selector<User[]> = state =>
  state.getIn(["auth", "children"]).map((id: UserId) => getUser(id)(state));

export const getUsername: Selector<string> = state =>
  state.getIn(["auth", "username"]);
export const getDisplayname: Selector<string> = state =>
  state.getIn(["auth", "displayname"]);

/**
 * Data
 */
export const getEntry = (id: EntryId): Selector<Entry> => state =>
  state.getIn(["entries", id]);
export const getEntries: Selector<Entry[]> = state =>
  state.get("entries").toArray();

export const getUser = (id: UserId): Selector<User> => state =>
  state.getIn(["users", id]);
export const getUsers: Selector<User[]> = state => state.get("users").toArray();

export const getSlots: Selector<Slot[]> = state => state.get("slots").toArray();
export const getSlotsById = (ids: SlotId[]): Selector<Slot[]> => state =>
  ids.map(id => state.getIn(["slots", id]));

export const getTeachers = createSelector([getUsers], users =>
  users.filter(userIsTeacher)
);

export const getStudents = createSelector([getUsers], users =>
  users.filter(userIsStudent)
);
