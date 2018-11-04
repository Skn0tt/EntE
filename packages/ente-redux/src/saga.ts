/**
 * EntE
 * (c) 2017-present, Simon Knott <info@simonknott.de>
 *
 * This source code is licensed under the GNU Affero General Public License
 * found in the LICENSE file in the root directory of this source tree.
 */

import { takeEvery, call, put, select } from "redux-saga/effects";
import {
  getEntryError,
  getEntriesError,
  getEntriesSuccess,
  getEntrySuccess,
  getUserError,
  getUsersSuccess,
  getUserSuccess,
  getUsersError,
  getSlotsSuccess,
  getSlotsError,
  addResponse,
  createEntrySuccess,
  createEntryError,
  createUsersError,
  createUsersSuccess,
  signEntryError,
  signEntrySuccess,
  resetPasswordError,
  resetPasswordSuccess,
  addMessage,
  getTokenSuccess,
  refreshTokenSuccess,
  getTokenError,
  refreshTokenError,
  logout,
  getNeededUsersSuccess,
  getNeededUsersError,
  getNeededUsersRequest,
  updateUserSuccess,
  unsignEntryError,
  unsignEntrySuccess,
  PatchForSchoolPayload,
  patchForSchoolSuccess,
  patchForSchoolError,
  INewPassword,
  deleteUserSuccess,
  deleteEntrySuccess,
  deleteUserError,
  deleteEntryError,
  downloadExcelExportSuccess,
  downloadExcelExportError
} from "./actions";
import {
  GET_ENTRY_REQUEST,
  GET_ENTRIES_REQUEST,
  GET_USER_REQUEST,
  GET_USERS_REQUEST,
  GET_SLOTS_REQUEST,
  CREATE_ENTRY_REQUEST,
  UPDATE_USER_REQUEST,
  SIGN_ENTRY_REQUEST,
  RESET_PASSWORD_REQUEST,
  SET_PASSWORD_REQUEST,
  REFRESH_TOKEN_REQUEST,
  GET_TOKEN_REQUEST,
  CREATE_USERS_REQUEST,
  GET_NEEDED_USERS_REQUEST,
  UNSIGN_ENTRY_REQUEST,
  PATCH_FORSCHOOL_REQUEST,
  DELETE_USER_REQUEST,
  DELETE_ENTRY_REQUEST,
  DOWNLOAD_EXCEL_EXPORT_REQUEST
} from "./constants";
import * as api from "./api";
import { Action } from "redux-actions";
import * as selectors from "./selectors";
import { APIResponse, AuthState, BasicCredentials } from "./types";
import lang from "ente-lang";
import { Map } from "immutable";
import { CreateEntryDto, CreateUserDto, Roles, PatchUserDto } from "ente-types";

function* dispatchUpdates(data: APIResponse) {
  yield put(addResponse(data));
}

function* getTokenSaga(action: Action<BasicCredentials>) {
  try {
    const authState: AuthState = yield call(api.getToken, action.payload!);

    yield put(getTokenSuccess(authState));

    yield put(getNeededUsersRequest());
  } catch (error) {
    yield put(addMessage(lang().message.request.error));
    yield put(getTokenError(error));
    yield put(logout());
  }
}

function* refreshTokenSaga(action: Action<void>) {
  try {
    const token = yield select(selectors.getToken);
    const authState: AuthState = yield call(api.refreshToken, token);

    yield put(refreshTokenSuccess(authState));
  } catch (error) {
    yield put(addMessage(lang().message.request.error));
    yield put(refreshTokenError(error));
    yield put(logout());
  }
}

function* getNeededUsersSaga() {
  try {
    const token = yield select(selectors.getToken);
    const result = yield call(api.getNeededUsers, token);

    yield put(getNeededUsersSuccess());
    yield dispatchUpdates(result);
  } catch (error) {
    yield put(getNeededUsersError(error));
  }
}

function* downloadExcelExportSaga() {
  try {
    const token = yield select(selectors.getToken);
    yield call(api.downloadExcelExport, token);

    yield put(downloadExcelExportSuccess());
  } catch (error) {
    yield put(downloadExcelExportError(error));
  }
}

function* getEntrySaga(action: Action<string>) {
  try {
    const token = yield select(selectors.getToken);
    const result = yield call(api.getEntry, action.payload!, token);

    yield put(getEntrySuccess());
    yield dispatchUpdates(result);
  } catch (error) {
    yield put(addMessage(lang().message.request.error));
    yield put(getEntryError(error));
  }
}

function* deleteUserSaga(action: Action<string>) {
  try {
    const token = yield select(selectors.getToken);
    yield call(api.deleteUser, action.payload!, token);

    yield put(deleteUserSuccess(action.payload));
  } catch (error) {
    yield put(addMessage(lang().message.request.error));
    yield put(deleteUserError(error));
  }
}

function* deleteEntrySaga(action: Action<string>) {
  try {
    const token = yield select(selectors.getToken);
    yield call(api.deleteEntry, action.payload!, token);

    yield put(deleteEntrySuccess(action.payload));
  } catch (error) {
    yield put(addMessage(lang().message.request.error));
    yield put(deleteEntryError(error));
  }
}

function* getEntriesSaga() {
  try {
    const token = yield select(selectors.getToken);
    const result = yield call(api.getEntries, token);

    yield put(getEntriesSuccess());
    yield dispatchUpdates(result);
  } catch (error) {
    yield put(addMessage(lang().message.request.error));
    yield put(getEntriesError(error));
  }
}

function* getSlotsSaga() {
  try {
    const token = yield select(selectors.getToken);
    const result = yield call(api.getSlots, token);

    yield put(getSlotsSuccess());
    yield dispatchUpdates(result);
  } catch (error) {
    yield put(addMessage(lang().message.request.error));
    yield put(getSlotsError(error));
  }
}

function* getUserSaga(action: Action<string>) {
  try {
    const token = yield select(selectors.getToken);
    const result = yield call(api.getUser, action.payload!, token);

    yield put(getUserSuccess());
    yield dispatchUpdates(result);
  } catch (error) {
    yield put(addMessage(lang().message.request.error));
    yield put(getUserError(error));
  }
}

function* getUsersSaga() {
  try {
    const token = yield select(selectors.getToken);
    const result = yield call(api.getUsers, token);

    yield put(getUsersSuccess());
    yield dispatchUpdates(result);
  } catch (error) {
    yield put(addMessage(lang().message.request.error));
    yield put(getUsersError(error));
  }
}

function* createEntrySaga(action: Action<CreateEntryDto>) {
  try {
    const token = yield select(selectors.getToken);
    const result = yield call(api.createEntry, action.payload!, token);

    yield put(createEntrySuccess());
    yield dispatchUpdates(result);
  } catch (error) {
    yield put(createEntryError(error));
  }
}

function* patchForSchoolSaga(action: Action<PatchForSchoolPayload>) {
  try {
    const token = yield select(selectors.getToken);
    const result = yield call(
      api.patchForSchool,
      action.payload!.id,
      action.payload!.forSchool,
      token
    );

    yield put(patchForSchoolSuccess());
    yield dispatchUpdates(result);
  } catch (error) {
    yield put(patchForSchoolError(error));
  }
}

function* createUsersSaga(action: Action<CreateUserDto[]>) {
  try {
    const token = yield select(selectors.getToken);

    const result = yield call(api.createUsers, action.payload!, token);
    yield dispatchUpdates(result);
    yield put(createUsersSuccess());

    return;
  } catch (error) {
    const ex: Error = error;
    yield put(addMessage(ex.message));
    yield put(createUsersError(ex));
  }
}

function* updateUserSaga(action: Action<[string, PatchUserDto]>) {
  try {
    const token = yield select(selectors.getToken);
    const result = yield call(
      api.updateUser,
      action.payload[0],
      action.payload[1],
      token
    );

    yield put(updateUserSuccess());
    yield dispatchUpdates(result);
  } catch (error) {
    yield put(createUsersError(error));
  }
}

function* signEntrySaga(action: Action<string>) {
  try {
    const token = yield select(selectors.getToken);
    const result = yield call(api.signEntry, action.payload!, token);

    yield put(signEntrySuccess());
    yield dispatchUpdates(result);
  } catch (error) {
    yield put(addMessage(lang().message.sign.error));
    yield put(signEntryError(error));
  }
}

function* unsignEntrySaga(action: Action<string>) {
  try {
    const token = yield select(selectors.getToken);
    const result = yield call(api.unsignEntry, action.payload!, token);

    yield put(unsignEntrySuccess());
    yield dispatchUpdates(result);
  } catch (error) {
    yield put(addMessage(lang().message.sign.error));
    yield put(unsignEntryError(error));
  }
}

function* resetPasswordSaga(action: Action<string>) {
  try {
    const result = yield call(api.resetPassword, action.payload!);

    yield put(addMessage(lang().message.resetPassword.success));
    yield put(resetPasswordSuccess(result));
  } catch (error) {
    yield put(addMessage(lang().message.request.error));
    yield put(resetPasswordError(error));
  }
}

function* setPasswordSaga(action: Action<INewPassword>) {
  try {
    const result = yield call(
      api.setPassword,
      action.payload!.token,
      action.payload!.newPassword
    );

    yield put(addMessage(lang().message.setPassword.success));
    yield put(resetPasswordSuccess(result));
  } catch (error) {
    yield put(addMessage(lang().message.setPassword.error));
    yield put(resetPasswordError(error));
  }
}

function* saga() {
  yield takeEvery<Action<string>>(GET_ENTRY_REQUEST, getEntrySaga);
  yield takeEvery<Action<void>>(GET_ENTRIES_REQUEST, getEntriesSaga);
  yield takeEvery<Action<string>>(GET_USER_REQUEST, getUserSaga);
  yield takeEvery(GET_USERS_REQUEST, getUsersSaga);
  yield takeEvery(GET_SLOTS_REQUEST, getSlotsSaga);
  yield takeEvery(SIGN_ENTRY_REQUEST, signEntrySaga);
  yield takeEvery(UNSIGN_ENTRY_REQUEST, unsignEntrySaga);
  yield takeEvery(PATCH_FORSCHOOL_REQUEST, patchForSchoolSaga);
  yield takeEvery(RESET_PASSWORD_REQUEST, resetPasswordSaga);
  yield takeEvery(SET_PASSWORD_REQUEST, setPasswordSaga);
  yield takeEvery(GET_TOKEN_REQUEST, getTokenSaga);
  yield takeEvery(REFRESH_TOKEN_REQUEST, refreshTokenSaga);
  yield takeEvery(GET_NEEDED_USERS_REQUEST, getNeededUsersSaga);
  yield takeEvery(DELETE_USER_REQUEST, deleteUserSaga);
  yield takeEvery(DELETE_ENTRY_REQUEST, deleteEntrySaga);
  yield takeEvery(DOWNLOAD_EXCEL_EXPORT_REQUEST, downloadExcelExportSaga);
  yield takeEvery<Action<CreateEntryDto>>(
    CREATE_ENTRY_REQUEST,
    createEntrySaga
  );
  yield takeEvery<Action<CreateUserDto[]>>(
    CREATE_USERS_REQUEST,
    createUsersSaga
  );
  yield takeEvery<Action<[string, PatchUserDto]>>(
    UPDATE_USER_REQUEST,
    updateUserSaga
  );
}

export default saga;
