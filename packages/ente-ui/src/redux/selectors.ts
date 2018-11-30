/**
 * EntE
 * (c) 2017-present, Simon Knott <info@simonknott.de>
 *
 * This source code is licensed under the GNU Affero General Public License
 * found in the LICENSE file in the root directory of this source tree.
 */

import {
  AppState,
  userIsTeacher,
  userIsStudent,
  UserN,
  EntryN,
  SlotN,
  roleHasChildren,
  AuthState
} from "./types";
import { createSelector } from "reselect";
import { Roles } from "ente-types";
import { Maybe } from "monet";
import * as _ from "lodash";
import { Action } from "redux";

type Selector<T> = (state: AppState) => T;

/**
 * State
 */
export const isLoading: Selector<boolean> = state =>
  state.get("pendingActions").size > 0;
export const isTypePending: Selector<(type: string) => boolean> = _.memoize(
  (state: AppState) => (type: string) =>
    !!state.get("pendingActions").find(action => action.type === type)
);
export const isActionPending: Selector<(action: Action) => boolean> = _.memoize(
  (state: AppState) => (action: Action) =>
    !!state.get("pendingActions").find(v => _.isEqual(action, v))
);

/**
 * Auth
 */
export const isAuthValid: Selector<boolean> = state => {
  const authState = state.get("auth");
  return authState.cata(
    () => false,
    a => {
      const exp = a.get("exp");
      return Date.now() < +exp;
    }
  );
};
export const isParent: Selector<boolean> = state => {
  const role = getRole(state);
  return role === Roles.PARENT;
};

export const getAuthState: Selector<Maybe<AuthState>> = state =>
  state.get("auth");

export const getRole: Selector<Roles> = state => {
  const authState = state.get("auth");
  return authState.cata(() => undefined, s => s.get("role"));
};

export const hasChildren = createSelector([getRole], role =>
  roleHasChildren(role)
);
export const canCreateEntries = createSelector(
  [getRole],
  role => role === Roles.STUDENT || role === Roles.PARENT
);
export const getToken: Selector<string> = state => {
  const authState = state.get("auth");
  return authState.cata(() => undefined, s => s.get("token"));
};

export const getChildren: Selector<UserN[]> = state => {
  const authState = state.get("auth");
  return authState.cata(
    () => [],
    s => {
      const children = s.get("children");
      return children.map(id => getUser(id)(state)).filter(c => !!c);
    }
  );
};

export const getDisplayname: Selector<string> = state => {
  const authState = state.get("auth");
  return authState.cata(() => undefined, s => s.get("displayname"));
};

export const getUsername: Selector<string> = state => {
  const authState = state.get("auth");
  return authState.cata(() => undefined, s => s.get("username"));
};

/**
 * Data
 */
export const getEntry = (id: string): Selector<EntryN> => state =>
  state.getIn(["entriesMap", id]);

export const getEntries: Selector<EntryN[]> = state =>
  state
    .get("entriesMap")
    .toArray()
    .map(([_, value]) => value);

export const getUser = (id: string): Selector<UserN> => state =>
  state.getIn(["usersMap", id]);

export const getUsers: Selector<UserN[]> = state =>
  state
    .get("usersMap")
    .toArray()
    .map(([_, value]) => value);

export const getSlots: Selector<SlotN[]> = state =>
  state
    .get("slotsMap")
    .toArray()
    .map(([_, value]) => value);

export const getSlotsById = (ids: string[]): Selector<SlotN[]> => state =>
  ids.map(id => state.getIn(["slotsMap", id]));

export const getTeachers = createSelector([getUsers], users =>
  users.filter(userIsTeacher)
);

export const getStudents = createSelector([getUsers], users =>
  users.filter(userIsStudent)
);
