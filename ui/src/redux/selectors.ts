import { AppState, MongoId, ICredentials, User, Slot, Entry, Roles } from '../interfaces/index';
import { createSelector } from 'reselect';
/**
 * State
 */
export const isLoading = (state: AppState): boolean => state.get('loading') > 0;
export const getMessages = (state: AppState): String[] => state.get('messages').toArray();

/**
 * Auth
 */
export const isAuthValid = (state: AppState): boolean => state.getIn(['auth', 'role']) !== '';
export const wasAuthChecked = (state: AppState): boolean => state.getIn(['auth', 'checked']);

export const getRole = (state: AppState): Roles => state.getIn(['auth', 'role']);
export const getAuthCredentials = (state: AppState): ICredentials => ({
  username: state.get('auth').get('username'),
  password: state.get('auth').get('password'),
});
export const getChildren = (state: AppState): User[] => state
  .getIn(['auth', 'children'])
  .map((id: MongoId) => getUser(id)(state));

export const getUsername = (state: AppState): string => state.getIn(['auth', 'username']);
export const getDisplayname = (state: AppState): string => state.getIn(['auth', 'displayname']);

/**
 * Data
 */
export const getEntry = (id: MongoId) => (state: AppState): Entry => state.getIn(['entries', id]);
export const getEntries = (state: AppState) => state.get('entries').toArray();

export const getUser = (id: MongoId) => (state: AppState): User => state.getIn(['users', id]);
export const getUsers = (state: AppState) => state.get('users').toArray();

export const getSlots = (state: AppState) => state.get('slots').toArray();
export const getSlotsById =
  (ids: MongoId[]) =>
    (state: AppState): Slot[] =>
      ids.map(id => state.getIn(['slots', id]));

export const getTeachers = createSelector(
  [getUsers],
  users => users.filter(
    user => user.get('role') === Roles.TEACHER,
  ),
);

export const getStudents = createSelector(
  [getUsers],
  users => users.filter(
    user => user.get('role') === Roles.STUDENT,
  ),
);
