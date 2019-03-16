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
  AuthState,
  userIsTeaching,
  InstanceConfigN,
  ParentSignatureTimesN
} from "./types";
import { createSelector } from "reselect";
import { Roles, Languages, DEFAULT_LANGUAGE } from "ente-types";
import { Maybe } from "monet";
import * as _ from "lodash";
import { Action } from "redux";
import { Map } from "immutable";
import { TimeScope } from "../time-scope";

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
  const authState = getAuthState(state);
  return authState.cata(
    () => false,
    a => {
      const exp = a.get("exp");
      return Date.now() < +exp;
    }
  );
};
export const isParent: Selector<Maybe<boolean>> = state => {
  const role = getRole(state);
  return role.map(r => r === Roles.PARENT);
};

export const getAuthState: Selector<Maybe<AuthState>> = state =>
  Maybe.fromNull(state.get("auth"));

export const getRole: Selector<Maybe<Roles>> = state => {
  const authState = getAuthState(state);
  return authState.map(s => s.get("role"));
};

export const hasChildren = createSelector(
  [getRole],
  role => role.map(roleHasChildren)
);

export const canCreateEntries = createSelector(
  [getRole],
  role => role.map(role => role === Roles.STUDENT || role === Roles.PARENT)
);

export const getToken: Selector<Maybe<string>> = state => {
  const authState = getAuthState(state);
  return authState.map(s => s.get("token"));
};

export const getChildren: Selector<Maybe<UserN[]>> = state => {
  const authState = getAuthState(state);
  return authState.map(s => {
    const childrenIds = s.get("children");
    const children = childrenIds.map(id => getUser(id)(state));
    return children.filter(c => c.isSome()).map(c => c.some());
  });
};

export const getDisplayname: Selector<Maybe<string>> = state => {
  const authState = getAuthState(state);
  return authState.map(s => s.get("displayname"));
};

export const getUsername: Selector<Maybe<string>> = state => {
  const authState = getAuthState(state);
  return authState.map(s => s.get("username"));
};

export const getUserId: Selector<Maybe<string>> = state => {
  const authState = getAuthState(state);
  return authState.map(s => s.get("userId"));
};

export const getOneSelf: Selector<Maybe<UserN>> = state => {
  const userId = getUserId(state);
  return userId.flatMap(id => getUser(id)(state));
};

export const getOneSelvesGraduationYear: Selector<Maybe<number>> = state => {
  const oneSelf = getOneSelf(state);
  return oneSelf.flatMap(u => Maybe.fromFalsy(u.get("graduationYear")));
};

/**
 * Data
 */
export const getEntry = (id: string): Selector<Maybe<EntryN>> => state =>
  Maybe.fromUndefined(state.getIn(["entriesMap", id]));

export const getEntries: Selector<EntryN[]> = state =>
  state
    .get("entriesMap")
    .toArray()
    .map(([_, value]) => value);

export const getUser = (id: string): Selector<Maybe<UserN>> => state =>
  Maybe.fromUndefined(state.getIn(["usersMap", id]));

export const getUsers: Selector<UserN[]> = state =>
  state
    .get("usersMap")
    .toArray()
    .map(([_, value]) => value);

export const getSlotsMap: Selector<Map<string, SlotN>> = state =>
  state.get("slotsMap");

export const getSlots: Selector<SlotN[]> = state =>
  getSlotsMap(state)
    .toArray()
    .map(([_, value]) => value);

export const getSlotsById = (ids: string[]): Selector<SlotN[]> => state =>
  ids.map(id => state.getIn(["slotsMap", id])).filter(s => !!s);

export const getTeachers = createSelector(
  [getUsers],
  users => users.filter(userIsTeacher)
);

export const getTeachingUsers = createSelector(
  [getUsers],
  users => users.filter(userIsTeaching)
);

export const getStudents = createSelector(
  [getUsers],
  users => users.filter(userIsStudent)
);

export const getInstanceConfig: Selector<Maybe<InstanceConfigN>> = state =>
  Maybe.fromNull(state.get("instanceConfig"));

export const getLanguage: Selector<Maybe<Languages>> = state =>
  Maybe.fromNull(state.get("language"));

export const getDefaultLanguage: Selector<Maybe<Languages>> = state => {
  const instanceConfig = getInstanceConfig(state);
  return instanceConfig.map(i => i.get("defaultLanguage"));
};

export const getParentSignatureTimes: Selector<
  Maybe<ParentSignatureTimesN>
> = state => {
  const instanceConfig = getInstanceConfig(state);
  return instanceConfig.map(i => i.get("parentSignatureTimes"));
};

export const getParentSignatureExpiryTime: Selector<Maybe<number>> = state => {
  return getParentSignatureTimes(state).map(v => v.get("expiry"));
};

export const getParentSignatureNotificationTime: Selector<
  Maybe<number>
> = state => {
  return getParentSignatureTimes(state).map(v => v.get("notification"));
};

export const getLoginBanners: Selector<
  Maybe<Map<Languages, string>>
> = state => {
  const instanceConfig = getInstanceConfig(state);
  return instanceConfig.map(i => i.get("loginBanners"));
};

export const isInstanceConfigPresent: Selector<boolean> = state =>
  getLoginBanners(state).isSome();

export const getLoginBannerForLanguage = (
  language: Languages
): Selector<Maybe<string>> => state =>
  getLoginBanners(state).flatMap(loginBanners => {
    return Maybe.fromFalsy(loginBanners.get(language));
  });

export const getCurrentLoginBanner: Selector<Maybe<string>> = state => {
  const currentLanguage = getLanguage(state);
  const lang = currentLanguage.orSome(DEFAULT_LANGUAGE);
  const result = getLoginBannerForLanguage(lang)(state);
  return result;
};

export const getTimeScope: Selector<TimeScope> = state =>
  state.get("timeScope");
