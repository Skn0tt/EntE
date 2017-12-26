import { AppState, MongoId, ICredentials } from '../interfaces/index';

/**
 * State
 */
export const isLoading = (state: AppState): boolean => state.get('loading') > 0;

/**
 * Auth
 */
export const isAuthValid = (state: AppState): boolean => state.getIn(['auth', 'role']) !== '';
export const wasAuthChecked = (state: AppState): boolean => state.getIn(['auth', 'checked']);

export const getRole = (state: AppState): boolean => state.getIn(['auth', 'role']);
export const getAuthCredentials = (state: AppState): ICredentials => ({
  username: state.getIn(['auth', 'username']),
  password: state.getIn(['auth', 'password']),
});

/**
 * Data
 */
export const getEntry = (id: MongoId) => (state: AppState) => state.getIn(['entries', id]);
export const getEntries = (state: AppState) => state.get('entries').toArray();

export const getUser = (id: MongoId) => (state: AppState) => state.getIn(['users', id]);
export const getUsers = (state: AppState) => state.get('users').toArray();
