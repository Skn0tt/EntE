import { AppState, User, Slot, Entry } from "../interfaces/index";
import { createSelector } from "reselect";
import { Roles, MongoId } from "ente-types";

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
  state.getIn(["auth", "children"]).map((id: MongoId) => getUser(id)(state));

export const getUsername: Selector<string> = state =>
  state.getIn(["auth", "username"]);
export const getDisplayname: Selector<string> = state =>
  state.getIn(["auth", "displayname"]);

/**
 * Data
 */
export const getEntry = (id: MongoId): Selector<Entry> => state =>
  state.getIn(["entries", id]);
export const getEntries: Selector<Entry[]> = state =>
  state.get("entries").toArray();

export const getUser = (id: MongoId): Selector<User> => state =>
  state.getIn(["users", id]);
export const getUsers: Selector<User[]> = state => state.get("users").toArray();

export const getSlots: Selector<Slot[]> = state => state.get("slots").toArray();
export const getSlotsById = (ids: MongoId[]): Selector<Slot[]> => state =>
  ids.map(id => state.getIn(["slots", id]));

export const getTeachers = createSelector([getUsers], users =>
  users.filter(user => user.isTeacher())
);

export const getStudents = createSelector([getUsers], users =>
  users.filter(user => user.isStudent())
);
