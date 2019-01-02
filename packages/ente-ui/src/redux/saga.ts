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
  INewPassword,
  deleteUserSuccess,
  deleteEntrySuccess,
  deleteUserError,
  deleteEntryError,
  downloadExcelExportSuccess,
  downloadExcelExportError,
  setPasswordSuccess,
  setPasswordError
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
  DELETE_USER_REQUEST,
  DELETE_ENTRY_REQUEST,
  DOWNLOAD_EXCEL_EXPORT_REQUEST,
  SET_LANGUAGE
} from "./constants";
import * as api from "./api";
import { Action } from "redux-actions";
import * as selectors from "./selectors";
import { APIResponse, AuthState, BasicCredentials } from "./types";
import {
  CreateEntryDto,
  CreateUserDto,
  PatchUserDto,
  Roles,
  getByLanguage,
  Languages
} from "ente-types";
import { Maybe } from "monet";
import { addMessages } from "../context/Messages";

const translation = getByLanguage({
  en: {
    requestError: "Request failed.",
    signingError: "Signing failed.",
    invalidCredentials: "Wrong credentials.",
    resetPassword: {
      success: "You will receive an email shortly."
    },
    setPassword: {
      success: "Successfully set password.",
      error: "Failure resetting password."
    }
  },
  de: {
    requestError: "Anfrage fehlgeschlagen.",
    signingError: "Unterschrift fehlgeschlagen.",
    invalidCredentials: "Anmeldedaten sind ungültig.",
    resetPassword: {
      success: "Sie erhalten in kürze eine Email."
    },
    setPassword: {
      success: "Passwort erfolgreich gesetzt.",
      error: "Passwort konnte nicht zurückgesetzt werden."
    }
  }
});

function* dispatchUpdates(data: APIResponse) {
  yield put(addResponse(data));
}

function* getTokenSaga(action: Action<BasicCredentials>) {
  try {
    const authState: AuthState = yield call(api.getToken, action.payload!);

    yield put(getTokenSuccess(authState, action));

    const isTeacher = authState.get("role") === Roles.TEACHER;

    if (!isTeacher) {
      yield put(getNeededUsersRequest());
    }
  } catch (error) {
    const language: Languages = yield select(selectors.getLanguage);
    addMessages(translation(language).invalidCredentials);
    yield put(getTokenError(error, action));
    yield put(logout());
  }
}

function* refreshTokenSaga(action: Action<void>) {
  try {
    const token: Maybe<string> = yield select(selectors.getToken);
    const authState: AuthState = yield call(api.refreshToken, token.some());

    yield put(refreshTokenSuccess(authState, action));
  } catch (error) {
    const language: Languages = yield select(selectors.getLanguage);
    addMessages(translation(language).requestError);
    yield put(refreshTokenError(error, action));
    yield put(logout());
  }
}

function* getNeededUsersSaga(action: Action<void>) {
  try {
    const token: Maybe<string> = yield select(selectors.getToken);
    const result = yield call(api.getNeededUsers, token.some());

    yield put(getNeededUsersSuccess(action));
    yield dispatchUpdates(result);
  } catch (error) {
    yield put(getNeededUsersError(error, action));
  }
}

function* downloadExcelExportSaga(action: Action<void>) {
  try {
    const token: Maybe<string> = yield select(selectors.getToken);
    yield call(api.downloadExcelExport, token.some());

    yield put(downloadExcelExportSuccess(action));
  } catch (error) {
    yield put(downloadExcelExportError(error, action));
  }
}

function* getEntrySaga(action: Action<string>) {
  try {
    const token: Maybe<string> = yield select(selectors.getToken);
    const result = yield call(api.getEntry, action.payload!, token.some());

    yield put(getEntrySuccess(action));
    yield dispatchUpdates(result);
  } catch (error) {
    const language: Languages = yield select(selectors.getLanguage);
    addMessages(translation(language).requestError);
    yield put(getEntryError(error, action));
  }
}

function* deleteUserSaga(action: Action<string>) {
  try {
    const token: Maybe<string> = yield select(selectors.getToken);
    yield call(api.deleteUser, action.payload!, token.some());

    yield put(deleteUserSuccess(action.payload, action));
  } catch (error) {
    const language: Languages = yield select(selectors.getLanguage);
    addMessages(translation(language).requestError);
    yield put(deleteUserError(error, action));
  }
}

function* deleteEntrySaga(action: Action<string>) {
  try {
    const token: Maybe<string> = yield select(selectors.getToken);
    yield call(api.deleteEntry, action.payload!, token.some());

    yield put(deleteEntrySuccess(action.payload, action));
  } catch (error) {
    const language: Languages = yield select(selectors.getLanguage);
    addMessages(translation(language).requestError);
    yield put(deleteEntryError(error, action));
  }
}

function* getEntriesSaga(action: Action<void>) {
  try {
    const token: Maybe<string> = yield select(selectors.getToken);
    const result = yield call(api.getEntries, token.some());

    yield put(getEntriesSuccess(action));
    yield dispatchUpdates(result);
  } catch (error) {
    const language: Languages = yield select(selectors.getLanguage);
    addMessages(translation(language).requestError);
    yield put(getEntriesError(error, action));
  }
}

function* getSlotsSaga(action: Action<void>) {
  try {
    const token: Maybe<string> = yield select(selectors.getToken);
    const result = yield call(api.getSlots, token.some());

    yield put(getSlotsSuccess(action));
    yield dispatchUpdates(result);
  } catch (error) {
    const language: Languages = yield select(selectors.getLanguage);
    addMessages(translation(language).requestError);
    yield put(getSlotsError(error, action));
  }
}

function* getUserSaga(action: Action<string>) {
  try {
    const token: Maybe<string> = yield select(selectors.getToken);
    const result = yield call(api.getUser, action.payload!, token.some());

    yield put(getUserSuccess(action));
    yield dispatchUpdates(result);
  } catch (error) {
    const language: Languages = yield select(selectors.getLanguage);
    addMessages(translation(language).requestError);
    yield put(getUserError(error, action));
  }
}

function* getUsersSaga(action: Action<void>) {
  try {
    const token: Maybe<string> = yield select(selectors.getToken);
    const result = yield call(api.getUsers, token.some());

    yield put(getUsersSuccess(action));
    yield dispatchUpdates(result);
  } catch (error) {
    const language: Languages = yield select(selectors.getLanguage);
    addMessages(translation(language).requestError);
    yield put(getUsersError(error, action));
  }
}

function* createEntrySaga(action: Action<CreateEntryDto>) {
  try {
    const token: Maybe<string> = yield select(selectors.getToken);
    const result = yield call(api.createEntry, action.payload!, token.some());

    yield put(createEntrySuccess(action));
    yield dispatchUpdates(result);
  } catch (error) {
    yield put(createEntryError(error, action));
  }
}

function* createUsersSaga(action: Action<CreateUserDto[]>) {
  try {
    const token: Maybe<string> = yield select(selectors.getToken);

    const result = yield call(api.createUsers, action.payload!, token.some());
    yield dispatchUpdates(result);
    yield put(createUsersSuccess(action));

    return;
  } catch (error) {
    const ex: Error = error;
    addMessages(ex.message);
    yield put(createUsersError(ex, action));
  }
}

function* updateUserSaga(action: Action<[string, PatchUserDto]>) {
  try {
    const token: Maybe<string> = yield select(selectors.getToken);
    const result = yield call(
      api.updateUser,
      action.payload![0],
      action.payload![1],
      token.some()
    );

    yield put(updateUserSuccess(action));
    yield dispatchUpdates(result);
  } catch (error) {
    yield put(createUsersError(error, action));
  }
}

function* signEntrySaga(action: Action<string>) {
  try {
    const token: Maybe<string> = yield select(selectors.getToken);
    const result = yield call(api.signEntry, action.payload!, token.some());

    yield put(signEntrySuccess(action));
    yield dispatchUpdates(result);
  } catch (error) {
    const language: Languages = yield select(selectors.getLanguage);
    addMessages(translation(language).signingError);
    yield put(signEntryError(error, action));
  }
}

function* unsignEntrySaga(action: Action<string>) {
  try {
    const token: Maybe<string> = yield select(selectors.getToken);
    const result = yield call(api.unsignEntry, action.payload!, token.some());

    yield put(unsignEntrySuccess(action));
    yield dispatchUpdates(result);
  } catch (error) {
    const language: Languages = yield select(selectors.getLanguage);
    addMessages(translation(language).signingError);
    yield put(unsignEntryError(error, action));
  }
}

function* resetPasswordSaga(action: Action<string>) {
  try {
    const result = yield call(api.resetPassword, action.payload!);

    const language: Languages = yield select(selectors.getLanguage);
    addMessages(translation(language).resetPassword.success);
    yield put(resetPasswordSuccess(result, action));
  } catch (error) {
    const language: Languages = yield select(selectors.getLanguage);
    addMessages(translation(language).requestError);
    yield put(resetPasswordError(error, action));
  }
}

function* setPasswordSaga(action: Action<INewPassword>) {
  try {
    const result = yield call(
      api.setPassword,
      action.payload!.token,
      action.payload!.newPassword
    );

    const language: Languages = yield select(selectors.getLanguage);
    addMessages(translation(language).setPassword.success);
    yield put(setPasswordSuccess(result, action));
  } catch (error) {
    const language: Languages = yield select(selectors.getLanguage);
    addMessages(translation(language).setPassword.error);
    yield put(setPasswordError(error, action));
  }
}

function* syncLanguageSaga(action: Action<Languages>) {
  try {
    const userId: Maybe<string> = yield select(selectors.getUserId);
    const token: Maybe<string> = yield select(selectors.getToken);
    yield call(api.setLanguage, userId.some(), action.payload!, token.some());
  } catch (error) {
    console.error(error);
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
  yield takeEvery(RESET_PASSWORD_REQUEST, resetPasswordSaga);
  yield takeEvery(SET_PASSWORD_REQUEST, setPasswordSaga);
  yield takeEvery(GET_TOKEN_REQUEST, getTokenSaga);
  yield takeEvery(REFRESH_TOKEN_REQUEST, refreshTokenSaga);
  yield takeEvery(GET_NEEDED_USERS_REQUEST, getNeededUsersSaga);
  yield takeEvery(DELETE_USER_REQUEST, deleteUserSaga);
  yield takeEvery(DELETE_ENTRY_REQUEST, deleteEntrySaga);
  yield takeEvery(DOWNLOAD_EXCEL_EXPORT_REQUEST, downloadExcelExportSaga);
  yield takeEvery(SET_LANGUAGE, syncLanguageSaga);
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
