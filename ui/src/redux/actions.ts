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
  CHECK_AUTH_ERROR,
  LOGOUT,
  GET_TEACHERS_SUCCESS,
  GET_TEACHERS_REQUEST,
  GET_TEACHERS_ERROR,
  GET_SLOTS_REQUEST,
  GET_SLOTS_SUCCESS,
  GET_SLOTS_ERROR,
  ADD_RESPONSE,
  CREATE_USER_REQUEST,
  CREATE_USER_SUCCESS,
  CREATE_USER_ERROR,
  UPDATE_USER_REQUEST,
  UPDATE_USER_SUCCESS,
  UPDATE_USER_ERROR,
  SIGN_ENTRY_REQUEST,
  SIGN_ENTRY_SUCCESS,
  SIGN_ENTRY_ERROR,
  REMOVE_ERROR,
} from './constants';
import {
  MongoId,
  AuthState,
  ICredentials,
  IEntryCreate,
  APIResponse,
  IUserCreate,
  IUser,
} from '../interfaces/index';

export type ActionType =
  IEntryCreate |
  Error |
  MongoId |
  ICredentials |
  AuthState |
  Error |
  APIResponse;

export const createEntryRequest = createAction<IEntryCreate>(CREATE_ENTRY_REQUEST);
export const createEntrySuccess = createAction(CREATE_ENTRY_SUCCESS);
export const createEntryError = createAction<Error>(CREATE_ENTRY_ERROR);

export const createUserRequest = createAction<IUserCreate>(CREATE_USER_REQUEST);
export const createUserSuccess = createAction(CREATE_USER_SUCCESS);
export const createUserError = createAction<Error>(CREATE_USER_ERROR);

export const signEntryRequest = createAction<MongoId>(SIGN_ENTRY_REQUEST);
export const singEntrySuccess = createAction(SIGN_ENTRY_SUCCESS);
export const signEntryError = createAction<Error>(SIGN_ENTRY_ERROR);

export const updateUserRequest = createAction<Partial<IUser>>(UPDATE_USER_REQUEST);
export const updateUserSuccess = createAction(UPDATE_USER_SUCCESS);
export const updateUserError = createAction<Error>(UPDATE_USER_ERROR);

export const getEntriesRequest = createAction(GET_ENTRIES_REQUEST);
export const getEntriesSuccess = createAction(GET_ENTRIES_SUCCESS);
export const getEntriesError = createAction<Error>(GET_ENTRIES_ERROR);

export const getEntryRequest = createAction<MongoId>(GET_ENTRY_REQUEST);
export const getEntrySuccess = createAction(GET_ENTRY_SUCCESS);
export const getEntryError = createAction<Error>(GET_ENTRY_ERROR);

export const getUserRequest = createAction<MongoId>(GET_USER_REQUEST);
export const getUserSuccess = createAction(GET_USER_SUCCESS);
export const getUserError = createAction<Error>(GET_USER_ERROR);

export const getUsersRequest = createAction(GET_USERS_REQUEST);
export const getUsersSuccess = createAction(GET_USERS_SUCCESS);
export const getUsersError = createAction<Error>(GET_USERS_ERROR);

export const getTeachersRequest = createAction(GET_TEACHERS_REQUEST);
export const getTeachersSuccess = createAction(GET_TEACHERS_SUCCESS);
export const getTeachersError = createAction<Error>(GET_TEACHERS_ERROR);

export const getSlotsRequest = createAction(GET_SLOTS_REQUEST);
export const getSlotsSuccess = createAction(GET_SLOTS_SUCCESS);
export const getSlotsError = createAction<Error>(GET_SLOTS_ERROR);

export const checkAuthRequest = createAction<ICredentials>(CHECK_AUTH_REQUEST);
export const checkAuthSuccess = createAction<AuthState>(CHECK_AUTH_SUCCESS);
export const checkAuthError = createAction<Error>(CHECK_AUTH_ERROR);

export const removeError = createAction<number>(REMOVE_ERROR);

export const addResponse = createAction<APIResponse>(ADD_RESPONSE);

export const logout = createAction(LOGOUT);
