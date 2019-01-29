/**
 * EntE
 * (c) 2017-present, Simon Knott <info@simonknott.de>
 *
 * This source code is licensed under the GNU Affero General Public License
 * found in the LICENSE file in the root directory of this source tree.
 */

import { createAction, Action } from "redux-actions";

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
  LOGOUT,
  GET_SLOTS_REQUEST,
  GET_SLOTS_SUCCESS,
  GET_SLOTS_ERROR,
  ADD_RESPONSE,
  UPDATE_USER_REQUEST,
  UPDATE_USER_SUCCESS,
  UPDATE_USER_ERROR,
  SIGN_ENTRY_REQUEST,
  SIGN_ENTRY_SUCCESS,
  SIGN_ENTRY_ERROR,
  RESET_PASSWORD_REQUEST,
  RESET_PASSWORD_SUCCESS,
  RESET_PASSWORD_ERROR,
  SET_PASSWORD_REQUEST,
  SET_PASSWORD_SUCCESS,
  SET_PASSWORD_ERROR,
  LOGIN_REQUEST,
  LOGIN_SUCCESS,
  LOGIN_ERROR,
  REFRESH_TOKEN_REQUEST,
  REFRESH_TOKEN_SUCCESS,
  REFRESH_TOKEN_ERROR,
  CREATE_USERS_REQUEST,
  CREATE_USERS_SUCCESS,
  CREATE_USERS_ERROR,
  GET_NEEDED_USERS_ERROR,
  GET_NEEDED_USERS_SUCCESS,
  GET_NEEDED_USERS_REQUEST,
  UNSIGN_ENTRY_ERROR,
  UNSIGN_ENTRY_SUCCESS,
  UNSIGN_ENTRY_REQUEST,
  DELETE_ENTRY_REQUEST,
  DELETE_ENTRY_ERROR,
  DELETE_ENTRY_SUCCESS,
  DELETE_USER_ERROR,
  DELETE_USER_SUCCESS,
  DELETE_USER_REQUEST,
  DOWNLOAD_EXCEL_EXPORT_REQUEST,
  DOWNLOAD_EXCEL_EXPORT_SUCCESS,
  DOWNLOAD_EXCEL_EXPORT_ERROR,
  SET_LANGUAGE,
  IMPORT_USERS_REQUEST,
  IMPORT_USERS_SUCCESS,
  IMPORT_USERS_ERROR,
  FETCH_INSTANCE_CONFIG_REQUEST,
  FETCH_INSTANCE_CONFIG_SUCCESS,
  FETCH_INSTANCE_CONFIG_ERROR,
  SET_LOGIN_BANNER_REQUEST,
  SET_LOGIN_BANNER_SUCCESS,
  SET_LOGIN_BANNER_ERROR,
  SET_DEFAULT_LANGUAGE_REQUEST,
  SET_DEFAULT_LANGUAGE_SUCCESS,
  SET_DEFAULT_LANGUAGE_ERROR
} from "./constants";
import { APIResponse, AuthState, BasicCredentials } from "./types";
import {
  CreateUserDto,
  CreateEntryDto,
  PatchUserDto,
  Languages,
  InstanceConfigDto
} from "ente-types";
import * as _ from "lodash";

const createMetaAction = <Meta, Payload = any>(type: string) =>
  createAction<Payload, Meta>(
    type,
    _.identity,
    (...args: any[]) => args[1] || args[0]
  );

export const createEntryRequest = createAction<CreateEntryDto>(
  CREATE_ENTRY_REQUEST
);
export const createEntrySuccess = createMetaAction<
  Action<CreateEntryDto>,
  void
>(CREATE_ENTRY_SUCCESS);
export const createEntryError = createMetaAction<Action<CreateEntryDto>, Error>(
  CREATE_ENTRY_ERROR
);

export const createUsersRequest = createAction<
  CreateUserDto[],
  CreateUserDto | CreateUserDto[]
>(CREATE_USERS_REQUEST, input => {
  if (Array.isArray(input)) {
    return input;
  }
  return [input];
});
export const createUsersSuccess = createMetaAction<
  Action<CreateUserDto[]>,
  void
>(CREATE_USERS_SUCCESS);
export const createUsersError = createMetaAction<
  Action<CreateUserDto[]>,
  Error
>(CREATE_USERS_ERROR);

export const signEntryRequest = createAction<string>(SIGN_ENTRY_REQUEST);
export const signEntrySuccess = createMetaAction<Action<string>, void>(
  SIGN_ENTRY_SUCCESS
);
export const signEntryError = createMetaAction<Action<string>, Error>(
  SIGN_ENTRY_ERROR
);

export const unsignEntryRequest = createAction<string>(UNSIGN_ENTRY_REQUEST);
export const unsignEntrySuccess = createMetaAction<Action<string>, Error>(
  UNSIGN_ENTRY_SUCCESS
);
export const unsignEntryError = createMetaAction<Action<string>, Error>(
  UNSIGN_ENTRY_ERROR
);

export const downloadExcelExportRequest = createAction(
  DOWNLOAD_EXCEL_EXPORT_REQUEST
);
export const downloadExcelExportSuccess = createMetaAction<Action<void>, void>(
  DOWNLOAD_EXCEL_EXPORT_SUCCESS
);
export const downloadExcelExportError = createMetaAction<Action<void>, Error>(
  DOWNLOAD_EXCEL_EXPORT_ERROR
);

export const updateUserRequest = createAction<[string, PatchUserDto]>(
  UPDATE_USER_REQUEST
);
export const updateUserSuccess = createMetaAction<
  Action<[string, PatchUserDto]>,
  void
>(UPDATE_USER_SUCCESS);
export const updateUserError = createMetaAction<
  Action<[string, PatchUserDto]>,
  Error
>(UPDATE_USER_ERROR);

export const getEntriesRequest = createAction(GET_ENTRIES_REQUEST);
export const getEntriesSuccess = createMetaAction<Action<void>, void>(
  GET_ENTRIES_SUCCESS
);
export const getEntriesError = createMetaAction<Action<void>, Error>(
  GET_ENTRIES_ERROR
);

export const getEntryRequest = createAction<string>(GET_ENTRY_REQUEST);
export const getEntrySuccess = createMetaAction<Action<string>, void>(
  GET_ENTRY_SUCCESS
);
export const getEntryError = createMetaAction<Action<string>, Error>(
  GET_ENTRY_ERROR
);

export const getUserRequest = createAction<string>(GET_USER_REQUEST);
export const getUserSuccess = createMetaAction<Action<string>, void>(
  GET_USER_SUCCESS
);
export const getUserError = createMetaAction<Action<string>, Error>(
  GET_USER_ERROR
);

export const getUsersRequest = createAction(GET_USERS_REQUEST);
export const getUsersSuccess = createMetaAction<Action<void>, void>(
  GET_USERS_SUCCESS
);
export const getUsersError = createMetaAction<Action<void>, Error>(
  GET_USERS_ERROR
);

export const getSlotsRequest = createAction(GET_SLOTS_REQUEST);
export const getSlotsSuccess = createMetaAction<Action<void>, void>(
  GET_SLOTS_SUCCESS
);
export const getSlotsError = createMetaAction<Action<void>, Error>(
  GET_SLOTS_ERROR
);

export const getNeededUsersRequest = createAction(GET_NEEDED_USERS_REQUEST);
export const getNeededUsersSuccess = createMetaAction<Action<void>, void>(
  GET_NEEDED_USERS_SUCCESS
);
export const getNeededUsersError = createMetaAction<Action<void>, Error>(
  GET_NEEDED_USERS_ERROR
);

export const deleteUserRequest = createAction<string>(DELETE_USER_REQUEST);
export const deleteUserSuccess = createMetaAction<Action<string>, string>(
  DELETE_USER_SUCCESS
);
export const deleteUserError = createMetaAction<Action<string>, Error>(
  DELETE_USER_ERROR
);

export const deleteEntryRequest = createAction<string>(DELETE_ENTRY_REQUEST);
export const deleteEntrySuccess = createMetaAction<Action<string>, string>(
  DELETE_ENTRY_SUCCESS
);
export const deleteEntryError = createMetaAction<Action<string>, Error>(
  DELETE_ENTRY_ERROR
);

export const loginRequest = createAction<BasicCredentials>(LOGIN_REQUEST);
export const loginSuccess = createMetaAction<
  Action<BasicCredentials>,
  AuthState
>(LOGIN_SUCCESS);
export const loginError = createMetaAction<Action<BasicCredentials>, Error>(
  LOGIN_ERROR
);

export const refreshTokenRequest = createAction(REFRESH_TOKEN_REQUEST);
export const refreshTokenSuccess = createMetaAction<Action<void>, AuthState>(
  REFRESH_TOKEN_SUCCESS
);
export const refreshTokenError = createMetaAction<Action<void>, Error>(
  REFRESH_TOKEN_ERROR
);

export const resetPasswordRequest = createAction<string>(
  RESET_PASSWORD_REQUEST
);
export const resetPasswordSuccess = createMetaAction<Action<string>, string>(
  RESET_PASSWORD_SUCCESS
);
export const resetPasswordError = createMetaAction<Action<string>, Error>(
  RESET_PASSWORD_ERROR
);

export interface INewPassword {
  token: string;
  newPassword: string;
}

export const setPasswordRequest = createAction<INewPassword>(
  SET_PASSWORD_REQUEST
);
export const setPasswordSuccess = createMetaAction<
  Action<INewPassword>,
  string
>(SET_PASSWORD_SUCCESS);
export const setPasswordError = createMetaAction<Action<INewPassword>, Error>(
  SET_PASSWORD_ERROR
);

export const addResponse = createAction<APIResponse>(ADD_RESPONSE);

export const setLanguage = createAction<Languages>(SET_LANGUAGE);

export interface ImportUsersRequestPayload {
  dtos: CreateUserDto[];
  deleteEntries: boolean;
  deleteUsers: boolean;
  deleteStudentsAndParents: boolean;
}

export interface ImportUsersSuccessPayload {
  newState?: APIResponse;
}

export const importUsersRequest = createAction<ImportUsersRequestPayload>(
  IMPORT_USERS_REQUEST
);
export const importUsersSuccess = createMetaAction<
  ImportUsersRequestPayload,
  ImportUsersSuccessPayload
>(IMPORT_USERS_SUCCESS);
export const importUsersError = createMetaAction<
  Action<ImportUsersRequestPayload>,
  Error
>(IMPORT_USERS_ERROR);

export const logout = createAction(LOGOUT);

export type FetchInstanceConfigSuccessPayload = InstanceConfigDto;

export const fetchInstanceConfigRequest = createAction(
  FETCH_INSTANCE_CONFIG_REQUEST
);
export const fetchInstanceConfigSuccess = createMetaAction<
  void,
  FetchInstanceConfigSuccessPayload
>(FETCH_INSTANCE_CONFIG_SUCCESS);
export const fetchInstanceConfigError = createMetaAction<void, Error>(
  FETCH_INSTANCE_CONFIG_ERROR
);

export interface SetLoginBannerRequestPayload {
  language: Languages;
  text: string | null;
}

export type SetLoginBannerSuccessPayload = SetLoginBannerRequestPayload;

export const setLoginBannerRequest = createAction<SetLoginBannerRequestPayload>(
  SET_LOGIN_BANNER_REQUEST
);
export const setLoginBannerSuccess = createMetaAction<
  void,
  SetLoginBannerSuccessPayload
>(SET_LOGIN_BANNER_SUCCESS);
export const setLoginBannerError = createMetaAction<void, Error>(
  SET_LOGIN_BANNER_ERROR
);

export const setDefaultLanguageRequest = createAction<Languages>(
  SET_DEFAULT_LANGUAGE_REQUEST
);
export const setDefaultLanguageSuccess = createMetaAction<
  Action<Languages>,
  Languages
>(SET_DEFAULT_LANGUAGE_SUCCESS);
export const setDefaultLanguageError = createMetaAction<
  Action<Languages>,
  Error
>(SET_DEFAULT_LANGUAGE_ERROR);
