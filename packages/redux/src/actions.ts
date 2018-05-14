/**
 * EntE
 * (c) 2017-present, Simon Knott <info@simonknott.de>
 *
 * This source code is licensed under the GNU Affero General Public License
 * found in the LICENSE file in the root directory of this source tree.
 */

import { createAction } from "redux-actions";

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
  GET_TEACHERS_SUCCESS,
  GET_TEACHERS_REQUEST,
  GET_TEACHERS_ERROR,
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
  REMOVE_MESSAGE,
  SET_PASSWORD_REQUEST,
  SET_PASSWORD_SUCCESS,
  SET_PASSWORD_ERROR,
  ADD_MESSAGE,
  GET_TOKEN_REQUEST,
  GET_TOKEN_SUCCESS,
  GET_TOKEN_ERROR,
  REFRESH_TOKEN_REQUEST,
  REFRESH_TOKEN_SUCCESS,
  REFRESH_TOKEN_ERROR,
  CREATE_USERS_REQUEST,
  CREATE_USERS_SUCCESS,
  CREATE_USERS_ERROR,
  GET_CHILDREN_REQUEST,
  GET_CHILDREN_SUCCESS,
  GET_CHILDREN_ERROR,
  GET_NEEDED_USERS_ERROR,
  GET_NEEDED_USERS_SUCCESS,
  GET_NEEDED_USERS_REQUEST,
  UNSIGN_ENTRY_ERROR,
  UNSIGN_ENTRY_SUCCESS,
  UNSIGN_ENTRY_REQUEST,
  PATCH_FORSCHOOL_REQUEST,
  PATCH_FORSCHOOL_SUCCESS,
  PATCH_FORSCHOOL_ERROR
} from "./constants";
import { APIResponse } from "./types";
import {
  IUserCreate,
  IEntryCreate,
  IUser,
  ICredentials,
  TokenInfo,
  INewPassword,
  EntryId,
  UserId
} from "ente-types";

export const createEntryRequest = createAction<IEntryCreate>(
  CREATE_ENTRY_REQUEST
);
export const createEntrySuccess = createAction(CREATE_ENTRY_SUCCESS);
export const createEntryError = createAction<Error>(CREATE_ENTRY_ERROR);

export const createUsersRequest = createAction<
  IUserCreate[],
  IUserCreate | IUserCreate[]
>(CREATE_USERS_REQUEST, input => {
  if (Array.isArray(input)) {
    return input;
  }
  return [input];
});
export const createUsersSuccess = createAction(CREATE_USERS_SUCCESS);
export const createUsersError = createAction<Error>(CREATE_USERS_ERROR);

export const signEntryRequest = createAction<EntryId>(SIGN_ENTRY_REQUEST);
export const signEntrySuccess = createAction(SIGN_ENTRY_SUCCESS);
export const signEntryError = createAction<Error>(SIGN_ENTRY_ERROR);

export const unsignEntryRequest = createAction<EntryId>(UNSIGN_ENTRY_REQUEST);
export const unsignEntrySuccess = createAction(UNSIGN_ENTRY_SUCCESS);
export const unsignEntryError = createAction<Error>(UNSIGN_ENTRY_ERROR);

export type PatchForSchoolPayload = {
  id: EntryId;
  forSchool: boolean;
};
export const patchForSchoolRequest = createAction<PatchForSchoolPayload>(
  PATCH_FORSCHOOL_REQUEST
);
export const patchForSchoolSuccess = createAction(PATCH_FORSCHOOL_SUCCESS);
export const patchForSchoolError = createAction<Error>(PATCH_FORSCHOOL_ERROR);

export const updateUserRequest = createAction<Partial<IUser>>(
  UPDATE_USER_REQUEST
);
export const updateUserSuccess = createAction(UPDATE_USER_SUCCESS);
export const updateUserError = createAction<Error>(UPDATE_USER_ERROR);

export const getEntriesRequest = createAction(GET_ENTRIES_REQUEST);
export const getEntriesSuccess = createAction(GET_ENTRIES_SUCCESS);
export const getEntriesError = createAction<Error>(GET_ENTRIES_ERROR);

export const getEntryRequest = createAction<EntryId>(GET_ENTRY_REQUEST);
export const getEntrySuccess = createAction(GET_ENTRY_SUCCESS);
export const getEntryError = createAction<Error>(GET_ENTRY_ERROR);

export const getUserRequest = createAction<UserId>(GET_USER_REQUEST);
export const getUserSuccess = createAction(GET_USER_SUCCESS);
export const getUserError = createAction<Error>(GET_USER_ERROR);

export const getUsersRequest = createAction(GET_USERS_REQUEST);
export const getUsersSuccess = createAction(GET_USERS_SUCCESS);
export const getUsersError = createAction<Error>(GET_USERS_ERROR);

export const getTeachersRequest = createAction(GET_TEACHERS_REQUEST);
export const getTeachersSuccess = createAction(GET_TEACHERS_SUCCESS);
export const getTeachersError = createAction<Error>(GET_TEACHERS_ERROR);

export const getChildrenRequest = createAction(GET_CHILDREN_REQUEST);
export const getChildrenSuccess = createAction(GET_CHILDREN_SUCCESS);
export const getChildrenError = createAction<Error>(GET_CHILDREN_ERROR);

export const getSlotsRequest = createAction(GET_SLOTS_REQUEST);
export const getSlotsSuccess = createAction(GET_SLOTS_SUCCESS);
export const getSlotsError = createAction<Error>(GET_SLOTS_ERROR);

export const getNeededUsersRequest = createAction(GET_NEEDED_USERS_REQUEST);
export const getNeededUsersSuccess = createAction(GET_NEEDED_USERS_SUCCESS);
export const getNeededUsersError = createAction<Error>(GET_NEEDED_USERS_ERROR);

export const getTokenRequest = createAction<ICredentials>(GET_TOKEN_REQUEST);
export const getTokenSuccess = createAction<TokenInfo>(GET_TOKEN_SUCCESS);
export const getTokenError = createAction<Error>(GET_TOKEN_ERROR);

export const refreshTokenRequest = createAction(REFRESH_TOKEN_REQUEST);
export const refreshTokenSuccess = createAction<TokenInfo>(
  REFRESH_TOKEN_SUCCESS
);
export const refreshTokenError = createAction<Error>(REFRESH_TOKEN_ERROR);

export const removeMessage = createAction<number>(REMOVE_MESSAGE);
export const addMessage = createAction<string>(ADD_MESSAGE);

export const resetPasswordRequest = createAction<string>(
  RESET_PASSWORD_REQUEST
);
export const resetPasswordSuccess = createAction<string>(
  RESET_PASSWORD_SUCCESS
);
export const resetPasswordError = createAction<Error>(RESET_PASSWORD_ERROR);

export const setPasswordRequest = createAction<INewPassword>(
  SET_PASSWORD_REQUEST
);
export const setPasswordSuccess = createAction<string>(SET_PASSWORD_SUCCESS);
export const setPasswordError = createAction<Error>(SET_PASSWORD_ERROR);

export const addResponse = createAction<APIResponse>(ADD_RESPONSE);

export const logout = createAction(LOGOUT);
