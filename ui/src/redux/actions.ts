import { createAction } from 'redux-actions';

import {
  CREATE_ENTRY_REQUEST,
  CREATE_ENTRY_SUCCESS,
  CREATE_ENTRY_ERROR,
  GET_ENTRIES_REQUEST,
  GET_ENTRIES_SUCCESS,
  GET_ENTRIES_ERROR,
  GET_ENTRY_REQUEST,
  GET_ENTRY_SUCCESS,
  GET_ENTRY_ERROR,
  GET_USER_REQUEST,
  GET_USER_SUCCESS,
  GET_USER_ERROR,
  GET_USERS_REQUEST,
  GET_USERS_SUCCESS,
  GET_USERS_ERROR,
  CHECK_AUTH_REQUEST,
  CHECK_AUTH_SUCCESS,
  CHECK_AUTH_ERROR
} from './constants';
import { Entry, MongoId, User, AuthState, ICredentials } from '../interfaces/index';

export const createEntryRequest = createAction<Entry>(CREATE_ENTRY_REQUEST);
export const createEntrySuccess = createAction<Entry>(CREATE_ENTRY_SUCCESS);
export const createEntryError = createAction<Error>(CREATE_ENTRY_ERROR);

export const getEntriesRequest = createAction(GET_ENTRIES_REQUEST);
export const getEntriesSuccess = createAction<Entry[]>(GET_ENTRIES_SUCCESS);
export const getEntriesError = createAction<Error>(GET_ENTRIES_ERROR);

export const getEntryRequest = createAction<MongoId>(GET_ENTRY_REQUEST);
export const getEntrySuccess = createAction<Entry>(GET_ENTRY_SUCCESS);
export const getEntryError = createAction<Error>(GET_ENTRY_ERROR);

export const getUserRequest = createAction(GET_USER_REQUEST);
export const getUserSuccess = createAction<User>(GET_USER_SUCCESS);
export const getUserError = createAction<Error>(GET_USER_ERROR);

export const getUsersRequest = createAction(GET_USERS_REQUEST);
export const getUsersSuccess = createAction<User[]>(GET_USERS_SUCCESS);
export const getUsersError = createAction<Error>(GET_USERS_ERROR);

export const checkAuthRequest = createAction<ICredentials>(CHECK_AUTH_REQUEST);
export const checkAuthSuccess = createAction<AuthState>(CHECK_AUTH_SUCCESS);
export const checkAuthError = createAction<Error>(CHECK_AUTH_ERROR);
