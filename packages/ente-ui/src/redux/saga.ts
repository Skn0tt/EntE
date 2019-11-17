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
  createEntrySuccess,
  createEntryError,
  createUsersError,
  createUsersSuccess,
  signEntryError,
  signEntrySuccess,
  resetPasswordError,
  resetPasswordSuccess,
  loginSuccess,
  refreshTokenSuccess,
  loginError,
  refreshTokenError,
  logout,
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
  setLoginBannerError,
  setParentSignatureExpiryTimeSuccess,
  setParentSignatureExpiryTimeError,
  setParentSignatureNotificationTimeSuccess,
  setParentSignatureNotificationTimeError,
  setEntryCreationDaysSuccess,
  setEntryCreationDaysError,
  addReviewedRecordSuccess,
  addReviewedRecordError,
  UpdateManagerNotesRequestPayload,
  updateManagerNotesSuccess,
  updateManagerNotesError
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
  LOGIN_REQUEST,
  CREATE_USERS_REQUEST,
  UNSIGN_ENTRY_REQUEST,
  DELETE_USER_REQUEST,
  DELETE_ENTRY_REQUEST,
  DOWNLOAD_EXCEL_EXPORT_REQUEST,
  SET_LANGUAGE,
  IMPORT_USERS_REQUEST,
  FETCH_INSTANCE_CONFIG_REQUEST,
  SET_DEFAULT_DEFAULT_LANGUAGE_REQUEST,
  SET_LOGIN_BANNER_REQUEST,
  SET_PARENT_SIGNATURE_EXPIRY_TIME_REQUEST,
  SET_PARENT_SIGNATURE_NOTIFICATION_TIME_REQUEST,
  SET_ENTRY_CREATION_DAYS_REQUEST,
  ADD_REVIEWED_RECORD_REQUEST,
  UPDATE_MANAGER_NOTES_REQUEST
} from "./constants";
import * as api from "./api";
import { Action } from "redux-actions";
import * as selectors from "./selectors";
import { APIResponse, AuthState, BasicCredentials } from "./types";
import {
  CreateEntryDto,
  CreateUserDto,
  PatchUserDto,
  Languages
} from "ente-types";
import { Maybe } from "monet";
import { getConfig } from "./config";

const onRequestError = (error: Error) => getConfig().onRequestError(error);

function* loginSaga(action: Action<BasicCredentials>) {
  try {
    const {
      apiResponse,
      authState,
      oneSelf,
      reviewedRecords
    }: api.LoginInfo = yield call(api.login, action.payload!);

    yield put(
      loginSuccess({ authState, apiResponse, oneSelf, reviewedRecords }, action)
    );
  } catch (error) {
    getConfig().onLoginFailedInvalidCredentials();
    yield put(loginError(error, action));
  }
}

function* refreshTokenSaga(action: Action<void>) {
  try {
    const token: Maybe<string> = yield select(selectors.getToken);
    const authState: AuthState = yield call(api.refreshToken, token.some());

    yield put(refreshTokenSuccess(authState, action));
  } catch (error) {
    onRequestError(error);
    yield put(refreshTokenError(error, action));
    yield put(logout());
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

    yield put(getEntrySuccess(result, action));
  } catch (error) {
    onRequestError(error);
    yield put(getEntryError(error, action));
  }
}

function* deleteUserSaga(action: Action<string>) {
  try {
    const token: Maybe<string> = yield select(selectors.getToken);
    yield call(api.deleteUser, action.payload!, token.some());

    yield put(deleteUserSuccess(action.payload, action));

    getConfig().onUserDeleted(action.payload!);
  } catch (error) {
    onRequestError(error);
    yield put(deleteUserError(error, action));
  }
}

function* deleteEntrySaga(action: Action<string>) {
  try {
    const token: Maybe<string> = yield select(selectors.getToken);
    yield call(api.deleteEntry, action.payload!, token.some());

    yield put(deleteEntrySuccess(action.payload, action));

    getConfig().onEntryDeleted(action.payload!);
  } catch (error) {
    onRequestError(error);
    yield put(deleteEntryError(error, action));
  }
}

function* getEntriesSaga(action: Action<void>) {
  try {
    const token: Maybe<string> = yield select(selectors.getToken);
    const result = yield call(api.getEntries, token.some());

    yield put(getEntriesSuccess(result, action));
  } catch (error) {
    onRequestError(error);
    yield put(getEntriesError(error, action));
  }
}

function* getSlotsSaga(action: Action<void>) {
  try {
    const token: Maybe<string> = yield select(selectors.getToken);
    const result = yield call(api.getSlots, token.some());

    yield put(getSlotsSuccess(result, action));
  } catch (error) {
    onRequestError(error);
    yield put(getSlotsError(error, action));
  }
}

function* getUserSaga(action: Action<string>) {
  try {
    const token: Maybe<string> = yield select(selectors.getToken);
    const result = yield call(api.getUser, action.payload!, token.some());

    yield put(getUserSuccess(result, action));
  } catch (error) {
    onRequestError(error);
    yield put(getUserError(error, action));
  }
}

function* getUsersSaga(action: Action<void>) {
  try {
    const token: Maybe<string> = yield select(selectors.getToken);
    const result = yield call(api.getUsers, token.some());

    yield put(getUsersSuccess(result, action));
  } catch (error) {
    onRequestError(error);
    yield put(getUsersError(error, action));
  }
}

function* createEntrySaga(action: Action<CreateEntryDto>) {
  try {
    const token: Maybe<string> = yield select(selectors.getToken);
    const result = yield call(api.createEntry, action.payload!, token.some());

    yield put(createEntrySuccess(result, action));

    getConfig().onEntryCreated(action.payload!);
  } catch (error) {
    yield put(createEntryError(error, action));
  }
}

function* createUsersSaga(action: Action<CreateUserDto[]>) {
  try {
    const token: Maybe<string> = yield select(selectors.getToken);

    const result = yield call(api.createUsers, action.payload!, token.some());

    yield put(createUsersSuccess(result, action));
    getConfig().onUsersCreated(action.payload!);
  } catch (error) {
    onRequestError(error);
    yield put(createUsersError(error, action));
  }
}

function* importUsersSaga(action: Action<ImportUsersRequestPayload>) {
  try {
    const token: Maybe<string> = yield select(selectors.getToken);

    const {
      deleteEntries,
      deleteUsers,
      deleteStudentsAndParents,
      dtos
    } = action.payload!;

    const responses: APIResponse[] = [];

    const createdUsers: APIResponse = yield call(
      api.importUsers,
      token.some(),
      dtos,
      { deleteUsers, deleteEntries, deleteStudentsAndParents }
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

    getConfig().onImportSuccessful(action.payload!);
  } catch (error) {
    onRequestError(error);
    yield put(importUsersError(error, action));
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

    yield put(updateUserSuccess(result, action));

    getConfig().onUserUpdated(action.payload![1]);
  } catch (error) {
    onRequestError(error);
    yield put(updateUserError(error, action));
  }
}

function* signEntrySaga(action: Action<string>) {
  try {
    const token: Maybe<string> = yield select(selectors.getToken);
    const result = yield call(api.signEntry, action.payload!, token.some());

    yield put(signEntrySuccess(result, action));
    getConfig().onSignedEntry(action.payload!);
  } catch (error) {
    getConfig().onSigningError(error);
    yield put(signEntryError(error, action));
  }
}

function* unsignEntrySaga(action: Action<string>) {
  try {
    const token: Maybe<string> = yield select(selectors.getToken);
    const result = yield call(api.unsignEntry, action.payload!, token.some());

    yield put(unsignEntrySuccess(result, action));
    getConfig().onUnsignedEntry(action.payload!);
  } catch (error) {
    getConfig().onSigningError(error);
    yield put(unsignEntryError(error, action));
  }
}

function* resetPasswordSaga(action: Action<string>) {
  try {
    const result = yield call(api.resetPassword, action.payload!);

    yield put(resetPasswordSuccess(result, action));
    getConfig().onPasswordResetRequested(action.payload!);
  } catch (error) {
    onRequestError(error);
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

    getConfig().onSetPasswordSuccess();
    yield put(setPasswordSuccess(result, action));
  } catch (error) {
    getConfig().onSetPasswordError(error);
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
    onRequestError(error);
    yield put(fetchInstanceConfigError(error, action));
  }
}

function* setDefaultLanguageSaga(action: Action<Languages>) {
  try {
    const token: Maybe<string> = yield select(selectors.getToken);
    yield call(api.setDefaultLanguage, action.payload!, token.some());

    yield put(setDefaultLanguageSuccess(action.payload, action));
  } catch (error) {
    onRequestError(error);
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
    onRequestError(error);
    yield put(setLoginBannerError(error, action));
  }
}

function* setParentSignatureExpiryTimeSaga(action: Action<number>) {
  try {
    const token: Maybe<string> = yield select(selectors.getToken);
    yield call(api.setParentSignatureExpiryTime, action.payload!, token.some());

    yield put(setParentSignatureExpiryTimeSuccess(action.payload, action));
  } catch (error) {
    onRequestError(error);
    yield put(setParentSignatureExpiryTimeError(error, action));
  }
}

function* setParentSignatureNotificationTimeSaga(action: Action<number>) {
  try {
    const token: Maybe<string> = yield select(selectors.getToken);
    yield call(
      api.setParentSignatureNotificationTime,
      action.payload!,
      token.some()
    );

    yield put(
      setParentSignatureNotificationTimeSuccess(action.payload, action)
    );
  } catch (error) {
    onRequestError(error);
    yield put(setParentSignatureNotificationTimeError(error, action));
  }
}

function* setEntryCreationDaysSaga(action: Action<number>) {
  try {
    const token: Maybe<string> = yield select(selectors.getToken);
    yield call(api.setEntryCreationDays, action.payload!, token.some());

    yield put(setEntryCreationDaysSuccess(action.payload, action));
  } catch (error) {
    onRequestError(error);
    yield put(setEntryCreationDaysError(error, action));
  }
}

function* syncLanguageSaga(action: Action<Languages>) {
  try {
    const userId: Maybe<string> = yield select(selectors.getOwnUserId);
    const token: Maybe<string> = yield select(selectors.getToken);
    yield call(api.setLanguage, userId.some(), action.payload!, token.some());
  } catch (error) {
    getConfig().onSyncingLanguageError(error);
  }
}

function* addReviedEntrySaga(action: Action<string>) {
  try {
    const token: Maybe<string> = yield select(selectors.getToken);

    yield call(api.addReviewedRecord, token.some(), action.payload!);

    yield put(addReviewedRecordSuccess(action.payload!, action));
  } catch (error) {
    onRequestError(error);
    yield put(addReviewedRecordError(error, action));
  }
}

function* updateManagerNotesSaga(
  action: Action<UpdateManagerNotesRequestPayload>
) {
  try {
    const { studentId, value } = action.payload!;
    const token: Maybe<string> = yield select(selectors.getToken);
    yield call(api.updateManagerNotes, studentId, value, token.some());
    yield put(updateManagerNotesSuccess(action.payload!, action));
  } catch (error) {
    yield put(updateManagerNotesError(error, action));
    onRequestError(error);
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
  yield takeEvery(LOGIN_REQUEST, loginSaga);
  yield takeEvery(REFRESH_TOKEN_REQUEST, refreshTokenSaga);
  yield takeEvery(DELETE_USER_REQUEST, deleteUserSaga);
  yield takeEvery(DELETE_ENTRY_REQUEST, deleteEntrySaga);
  yield takeEvery(DOWNLOAD_EXCEL_EXPORT_REQUEST, downloadExcelExportSaga);
  yield takeEvery(SET_LANGUAGE, syncLanguageSaga);
  yield takeEvery(IMPORT_USERS_REQUEST, importUsersSaga);
  yield takeEvery(FETCH_INSTANCE_CONFIG_REQUEST, fetchInstanceConfigSaga);
  yield takeEvery(SET_ENTRY_CREATION_DAYS_REQUEST, setEntryCreationDaysSaga);
  yield takeEvery(SET_DEFAULT_DEFAULT_LANGUAGE_REQUEST, setDefaultLanguageSaga);
  yield takeEvery(ADD_REVIEWED_RECORD_REQUEST, addReviedEntrySaga);
  yield takeEvery(
    SET_PARENT_SIGNATURE_EXPIRY_TIME_REQUEST,
    setParentSignatureExpiryTimeSaga
  );
  yield takeEvery(
    SET_PARENT_SIGNATURE_NOTIFICATION_TIME_REQUEST,
    setParentSignatureNotificationTimeSaga
  );
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
  yield takeEvery(UPDATE_MANAGER_NOTES_REQUEST, updateManagerNotesSaga);
}

export default saga;
