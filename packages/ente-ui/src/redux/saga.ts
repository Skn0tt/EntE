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
  setPasswordError,
  ImportUsersRequestPayload,
  importUsersSuccess,
  ImportUsersSuccessPayload,
  updateUserError,
  importUsersError,
  FetchInstanceConfigSuccessPayload,
  fetchInstanceConfigSuccess,
  fetchInstanceConfigError,
  setDefaultLanguageSuccess,
  setDefaultLanguageError,
  SetLoginBannerRequestPayload,
  setLoginBannerSuccess,
  setLoginBannerError
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
  SET_LANGUAGE,
  IMPORT_USERS_REQUEST,
  FETCH_INSTANCE_CONFIG_REQUEST,
  SET_DEFAULT_LANGUAGE_REQUEST,
  SET_LOGIN_BANNER_REQUEST
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
  Languages,
  DEFAULT_LANGUAGE
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

function* getLanguage() {
  const language: Maybe<Languages> = yield select(selectors.getLanguage);
  return language.orSome(DEFAULT_LANGUAGE);
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
    const language: Languages = yield getLanguage();
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
    const language: Languages = yield getLanguage();
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
    const language: Languages = yield getLanguage();
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
    const language: Languages = yield getLanguage();
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
    const language: Languages = yield getLanguage();
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
    const language: Languages = yield getLanguage();
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
    const language: Languages = yield getLanguage();
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
    const language: Languages = yield getLanguage();
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
    const language: Languages = yield getLanguage();
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

function* importUsersSaga(action: Action<ImportUsersRequestPayload>) {
  try {
    const token: Maybe<string> = yield select(selectors.getToken);

    const { deleteEntries, deleteUsers, dtos } = action.payload!;

    const responses: APIResponse[] = [];

    const createdUsers: APIResponse = yield call(
      api.importUsers,
      token.some(),
      dtos,
      { deleteUsers, deleteEntries }
    );

    responses.push(createdUsers);

    const allEntries: APIResponse = yield call(api.getEntries, token.some());
    responses.push(allEntries);

    const allUsers: APIResponse = yield call(api.getUsers, token.some());
    responses.push(allUsers);

    const result: ImportUsersSuccessPayload = {
      newState: api.mergeAPIResponses(...responses)
    };

    yield put(importUsersSuccess(result, action));

    return;
  } catch (error) {
    const ex: Error = error;
    addMessages(ex.message);
    yield put(importUsersError(ex, action));
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
    yield put(updateUserError(error, action));
  }
}

function* signEntrySaga(action: Action<string>) {
  try {
    const token: Maybe<string> = yield select(selectors.getToken);
    const result = yield call(api.signEntry, action.payload!, token.some());

    yield put(signEntrySuccess(action));
    yield dispatchUpdates(result);
  } catch (error) {
    const language: Languages = yield getLanguage();
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
    const language: Languages = yield getLanguage();
    addMessages(translation(language).signingError);
    yield put(unsignEntryError(error, action));
  }
}

function* resetPasswordSaga(action: Action<string>) {
  try {
    const result = yield call(api.resetPassword, action.payload!);

    const language: Languages = yield getLanguage();
    addMessages(translation(language).resetPassword.success);
    yield put(resetPasswordSuccess(result, action));
  } catch (error) {
    const language: Languages = yield getLanguage();
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

    const language: Languages = yield getLanguage();
    addMessages(translation(language).setPassword.success);
    yield put(setPasswordSuccess(result, action));
  } catch (error) {
    const language: Languages = yield getLanguage();
    addMessages(translation(language).setPassword.error);
    yield put(setPasswordError(error, action));
  }
}

function* fetchInstanceConfigSaga(action: Action<void>) {
  try {
    const result: FetchInstanceConfigSuccessPayload = yield call(
      api.fetchInstanceConfig
    );

    yield put(fetchInstanceConfigSuccess(result, action));
  } catch (error) {
    const language: Languages = yield getLanguage();
    addMessages(translation(language).requestError);
    yield put(fetchInstanceConfigError(error, action));
  }
}

function* setDefaultLanguageSaga(action: Action<Languages>) {
  try {
    const token: Maybe<string> = yield select(selectors.getToken);
    yield call(api.setDefaultLanguage, action.payload!, token.some());

    yield put(setDefaultLanguageSuccess(action.payload, action));
  } catch (error) {
    const language: Languages = yield getLanguage();
    addMessages(translation(language).requestError);
    yield put(setDefaultLanguageError(error, action));
  }
}

function* setLoginBannerSaga(action: Action<SetLoginBannerRequestPayload>) {
  try {
    const token: Maybe<string> = yield select(selectors.getToken);
    yield call(
      api.setLoginBanner,
      action.payload!.language,
      action.payload!.text,
      token.some()
    );

    yield put(setLoginBannerSuccess(action.payload, action));
  } catch (error) {
    const language: Languages = yield getLanguage();
    addMessages(translation(language).requestError);
    yield put(setLoginBannerError(error, action));
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
  yield takeEvery(IMPORT_USERS_REQUEST, importUsersSaga);
  yield takeEvery(FETCH_INSTANCE_CONFIG_REQUEST, fetchInstanceConfigSaga);
  yield takeEvery(SET_DEFAULT_LANGUAGE_REQUEST, setDefaultLanguageSaga);
  yield takeEvery(SET_LOGIN_BANNER_REQUEST, setLoginBannerSaga);
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
