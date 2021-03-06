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
  ParentSignatureTimesN,
} from "./types";
import { createSelector } from "reselect";
import {
  Roles,
  Languages,
  DEFAULT_DEFAULT_LANGUAGE,
  EntryReasonCategory,
} from "@@types";
import { Maybe } from "monet";
import * as _ from "lodash";
import { Map, Set } from "immutable";
import { FilterScope } from "../filter-scope";
import { ColorScheme } from "../theme";
import { ADD_REVIEWED_RECORD_REQUEST } from "./constants";
import { Action } from "redux-actions";

export const transferReviewedRecords: (state: AppState) => AppState = _.memoize(
  (state: AppState): AppState => {
    const reviewedRecords = getReviewedRecords(state);
    return reviewedRecords.reduce((state, recordId) => {
      function setIsInReviewedRecordsTrue(item: (SlotN | EntryN) | null) {
        if (!item) {
          return null;
        }

        return (item as any).set("isInReviewedRecords", true);
      }

      if (state.hasIn(["entriesMap", recordId])) {
        return state.updateIn(
          ["entriesMap", recordId],
          setIsInReviewedRecordsTrue
        );
      }

      if (state.hasIn(["slotsMap", recordId])) {
        return state.updateIn(
          ["slotsMap", recordId],
          setIsInReviewedRecordsTrue
        );
      }

      return state;
    }, state);
  }
);

type Selector<T> = (state: AppState) => T;

/**
 * State
 */
export const isLoading: Selector<boolean> = (state) =>
  state.get("pendingActions").size > 0;
export const isTypePending: Selector<(
  type: string
) => boolean> = _.memoize((state: AppState) => (type: string) =>
  !!state.get("pendingActions").find((action) => action.type === type)
);
export const isActionPending: Selector<(
  action: Action<any>
) => boolean> = _.memoize((state: AppState) => (action: Action<any>) =>
  !!state.get("pendingActions").find((v) => _.isEqual(action, v))
);

/**
 * Auth
 */
export const isAuthValid: Selector<boolean> = (state) => {
  const authState = getAuthState(state);
  return authState.cata(
    () => false,
    (a) => {
      const exp = a.get("exp");
      return Date.now() < +exp;
    }
  );
};
export const isParent: Selector<Maybe<boolean>> = (state) => {
  const role = getRole(state);
  return role.map((r) => r === Roles.PARENT);
};

export const getAuthState: Selector<Maybe<AuthState>> = (state) =>
  Maybe.fromNull(state.get("auth"));

export const getRole: Selector<Maybe<Roles>> = (state) => {
  const oneSelf = getOneSelf(state);
  return oneSelf.map((s) => s.get("role"));
};

export const isAdmin: Selector<boolean> = (state) => {
  const oneSelf = getOneSelf(state);
  return oneSelf.map((s) => s.get("isAdmin") || false).orSome(false);
};

export const hasChildren = createSelector([getRole], (role) =>
  role.map(roleHasChildren)
);

export const canCreateEntries = createSelector([getRole], (role) =>
  role.map((role) => role === Roles.STUDENT || role === Roles.PARENT)
);

export const getToken: Selector<Maybe<string>> = (state) => {
  const authState = getAuthState(state);
  return authState.map((s) => s.get("token"));
};

export const getChildren: Selector<Maybe<UserN[]>> = (state) => {
  const oneSelf = getOneSelf(state);
  return oneSelf.map((s) => {
    const childrenIds = s.get("childrenIds");
    return childrenIds
      .map((id) => getUser(id)(state))
      .filter((c) => c.isSome())
      .map((c) => c.some());
  });
};

export const getDisplayname: Selector<Maybe<string>> = (state) => {
  const oneSelf = getOneSelf(state);
  return oneSelf.map((s) => s.get("displayname"));
};

export const getFirstName: Selector<Maybe<string>> = (state) => {
  const oneSelf = getOneSelf(state);
  return oneSelf.map((s) => s.get("firstName"));
};

export const getLastName: Selector<Maybe<string>> = (state) => {
  const oneSelf = getOneSelf(state);
  return oneSelf.map((s) => s.get("lastName"));
};

export const getUsername: Selector<Maybe<string>> = (state) => {
  const oneSelf = getOneSelf(state);
  return oneSelf.map((s) => s.get("username"));
};

export const getOwnUserId: Selector<Maybe<string>> = (state) => {
  const oneSelf = getOneSelf(state);
  return oneSelf.map((s) => s.get("id"));
};

export const getOneSelf: Selector<Maybe<UserN>> = (state) => {
  return Maybe.fromNull(state.get("oneSelf"));
};

export const getOneSelvesClass: Selector<Maybe<string>> = (state) => {
  const oneSelf = getOneSelf(state);
  return oneSelf.flatMap((u) => Maybe.fromFalsy(u.get("class")));
};

/**
 * Data
 */
export const getEntry = (id: string): Selector<Maybe<EntryN>> => (state) =>
  Maybe.fromUndefined(transferReviewedRecords(state).getIn(["entriesMap", id]));

export const getEntries: Selector<EntryN[]> = (state) =>
  transferReviewedRecords(state)
    .get("entriesMap")
    .toArray()
    .map(([_, value]) => value);

export const getUser = (id: string): Selector<Maybe<UserN>> => (state) =>
  Maybe.fromUndefined(transferReviewedRecords(state).getIn(["usersMap", id]));

export const getUsers: Selector<UserN[]> = (state) =>
  transferReviewedRecords(state)
    .get("usersMap")
    .toArray()
    .map(([_, value]) => value);

export const getUserMap: Selector<Map<string, UserN>> = (state) =>
  transferReviewedRecords(state).get("usersMap");

export const getSlotsMap: Selector<Map<string, SlotN>> = (state) =>
  transferReviewedRecords(state).get("slotsMap");

export const getSlots: Selector<SlotN[]> = (state) =>
  getSlotsMap(transferReviewedRecords(state))
    .toArray()
    .map(([_, value]) => value);

export const getSlotsById = (ids: string[]): Selector<SlotN[]> => (state) =>
  ids
    .map((id) => transferReviewedRecords(state).getIn(["slotsMap", id]))
    .filter((s) => !!s);

export const getTeachers = createSelector([getUsers], (users) =>
  users.filter(userIsTeacher)
);

export const getTeachingUsers = createSelector([getUsers], (users) =>
  users.filter(userIsTeaching)
);

export const getStudents = createSelector([getUsers], (users) =>
  users.filter(userIsStudent)
);

export const getStudentsOfClass = (_class: string) =>
  createSelector([getStudents], (students) =>
    students.filter((s) => s.get("class") === _class)
  );

export const getInstanceConfig: Selector<Maybe<InstanceConfigN>> = (state) =>
  Maybe.fromNull(state.get("instanceConfig"));

export const getHiddenEntryReasonCategories: Selector<EntryReasonCategory[]> = (
  state
) =>
  getInstanceConfig(state)
    .map((u) => u.get("hiddenEntryReasonCategories"))
    .orSome([]);

export const getOneSelvesLanguage: Selector<Maybe<Languages>> = (state) =>
  getOneSelf(state).flatMap((u) => Maybe.fromFalsy(u.get("language")));

export const isSubscribedToWeeklySummary: Selector<Maybe<boolean>> = (state) =>
  getOneSelf(state).flatMap((u) =>
    Maybe.fromFalsy(u.get("subscribedToWeeklySummary"))
  );

export const getDefaultLanguage: Selector<Maybe<Languages>> = (state) => {
  const instanceConfig = getInstanceConfig(state);
  return instanceConfig.map((i) => i.get("defaultLanguage"));
};

export const getLanguage: Selector<Languages> = (state) =>
  getOneSelvesLanguage(state)
    .orElse(getDefaultLanguage(state))
    .orSome(DEFAULT_DEFAULT_LANGUAGE);

export const getParentSignatureTimes: Selector<Maybe<ParentSignatureTimesN>> = (
  state
) => {
  const instanceConfig = getInstanceConfig(state);
  return instanceConfig.map((i) => i.get("parentSignatureTimes"));
};

export const getEntryCreationDeadline: Selector<Maybe<number>> = (state) => {
  const instanceConfig = getInstanceConfig(state);
  return instanceConfig.map((i) => i.get("entryCreationDeadline"));
};

export const getParentSignatureExpiryTime: Selector<Maybe<number>> = (
  state
) => {
  return getParentSignatureTimes(state).map((v) => v.get("expiry"));
};

export const getParentSignatureNotificationTime: Selector<Maybe<number>> = (
  state
) => {
  return getParentSignatureTimes(state).map((v) => v.get("notification"));
};

export const getLoginBanners: Selector<Maybe<Map<Languages, string>>> = (
  state
) => {
  const instanceConfig = getInstanceConfig(state);
  return instanceConfig.map((i) => i.get("loginBanners"));
};

export const isInstanceConfigPresent: Selector<boolean> = (state) =>
  getLoginBanners(state).isSome();

export const isInstanceConfigUpToDate: Selector<boolean> = (state) => {
  const instanceConfig = getInstanceConfig(state);
  return instanceConfig
    .filter((config) => config.has("hiddenEntryReasonCategories"))
    .isSome();
};

export const getLoginBannerForLanguage = (
  language: Languages
): Selector<Maybe<string>> => (state) =>
  getLoginBanners(state).flatMap((loginBanners) => {
    return Maybe.fromFalsy(loginBanners.get(language));
  });

export const getCurrentLoginBanner: Selector<Maybe<string>> = (state) => {
  const currentLanguage = getLanguage(state);
  const lang = currentLanguage;
  const result = getLoginBannerForLanguage(lang)(state);
  return result;
};

export const getFilterScope: Selector<FilterScope> = (state) =>
  state.get("timeScope");

export const getColorScheme: Selector<ColorScheme> = (state) =>
  state.get("colorScheme");

export const getReviewedRecords: Selector<Set<string>> = (state) => {
  const reviewedRecords = state.get("reviewedRecords") || Set();

  const pendingActions = state.get("pendingActions");

  const currentlyAdding = pendingActions
    .filter((action) => action.type === ADD_REVIEWED_RECORD_REQUEST)
    .map((a) => {
      const { payload } = a as Action<string>;
      return payload;
    });

  return reviewedRecords.union(currentlyAdding);
};
