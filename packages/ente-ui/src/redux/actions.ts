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
  GET_TOKEN_REQUEST,
  GET_TOKEN_SUCCESS,
  GET_TOKEN_ERROR,
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
  PATCH_FORSCHOOL_REQUEST,
  PATCH_FORSCHOOL_SUCCESS,
  PATCH_FORSCHOOL_ERROR,
  DELETE_ENTRY_REQUEST,
  DELETE_ENTRY_ERROR,
  DELETE_ENTRY_SUCCESS,
  DELETE_USER_ERROR,
  DELETE_USER_SUCCESS,
  DELETE_USER_REQUEST,
  DOWNLOAD_EXCEL_EXPORT_REQUEST,
  DOWNLOAD_EXCEL_EXPORT_SUCCESS,
  DOWNLOAD_EXCEL_EXPORT_ERROR,
  SET_LANGUAGE
} from "./constants";
import { APIResponse, AuthState, BasicCredentials } from "./types";
import {
  CreateUserDto,
  CreateEntryDto,
  PatchUserDto,
  Languages
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

export type PatchForSchoolPayload = {
  id: string;
  forSchool: boolean;
};
export const patchForSchoolRequest = createAction<PatchForSchoolPayload>(
  PATCH_FORSCHOOL_REQUEST
);
export const patchForSchoolSuccess = createMetaAction<
  Action<PatchForSchoolPayload>,
  void
>(PATCH_FORSCHOOL_SUCCESS);
export const patchForSchoolError = createMetaAction<
  Action<PatchForSchoolPayload>,
  Error
>(PATCH_FORSCHOOL_ERROR);

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

export const getTokenRequest = createAction<BasicCredentials>(
  GET_TOKEN_REQUEST
);
export const getTokenSuccess = createMetaAction<
  Action<BasicCredentials>,
  AuthState
>(GET_TOKEN_SUCCESS);
export const getTokenError = createMetaAction<Action<BasicCredentials>, Error>(
  GET_TOKEN_ERROR
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

export const logout = createAction(LOGOUT);
