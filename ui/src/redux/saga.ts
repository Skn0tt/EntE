import { takeEvery, call, put, select } from 'redux-saga/effects';
import { delay } from 'redux-saga';
import {
  getEntryError,
  getEntriesError,
  getEntriesSuccess,
  getEntrySuccess,
  getUserError,
  getUsersSuccess,
  getUserSuccess,
  getUsersError,
  getTeachersError,
  getTeachersSuccess,
  getSlotsSuccess,
  getSlotsError,
  addResponse,
  createEntrySuccess,
  createEntryError,
  createUsersError,
  createUsersSuccess,
  signEntryError,
  singEntrySuccess,
  resetPasswordError,
  resetPasswordSuccess,
  addMessage,
  getTokenSuccess,
  refreshTokenSuccess,
  getTokenError,
  refreshTokenError,
  logout,
  refreshTokenRequest,
  getChildrenSuccess,
  getChildrenError,
  getNeededUsersSuccess,
  getNeededUsersError,
  getNeededUsersRequest,
} from './actions';
import {
  GET_ENTRY_REQUEST,
  GET_ENTRIES_REQUEST,
  GET_USER_REQUEST,
  GET_USERS_REQUEST,
  GET_TEACHERS_REQUEST,
  GET_SLOTS_REQUEST,
  CREATE_ENTRY_REQUEST,
  UPDATE_USER_REQUEST,
  SIGN_ENTRY_REQUEST,
  RESET_PASSWORD_REQUEST,
  SET_PASSWORD_REQUEST,
  REFRESH_TOKEN_REQUEST,
  GET_TOKEN_REQUEST,
  CREATE_USERS_REQUEST,
  GET_CHILDREN_REQUEST,
  GET_NEEDED_USERS_REQUEST,
} from './constants';
import * as api from './api';
import { Action } from 'redux-actions';
import * as selectors from './selectors';
import {
  APIResponse,
  MongoId,
  IEntryCreate,
  IUserCreate,
  IUser,
  INewPassword,
  Roles,
  ICredentials,
  TokenInfo,
} from '../interfaces/index';
import lang from '../res/lang';

const tokenRefreshDelay = 1000 * 60 * 5;

function* dispatchUpdates(data: APIResponse) {
  yield put(addResponse(data));
}

function* getTokenSaga(action: Action<ICredentials>) {
  try {
    const tokenInfo: TokenInfo = yield call(api.getToken, action.payload);

    yield put(getTokenSuccess(tokenInfo));

    yield put(getNeededUsersRequest());

    yield delay(tokenRefreshDelay);
    yield put(refreshTokenRequest());
  } catch (error) {
    yield put(addMessage(lang().message.request.error));
    yield put(getTokenError(error));
    yield put(logout());
  }
}

function* refreshTokenSaga(action: Action<void>) {
  try {
    const token = yield select(selectors.getToken);
    const tokenInfo: TokenInfo = yield call(api.refreshToken, token);

    yield put(refreshTokenSuccess(tokenInfo));

    yield delay(tokenRefreshDelay);
    yield put(refreshTokenRequest());
  } catch (error) {
    yield put(addMessage(lang().message.request.error));
    yield put(refreshTokenError(error));
    yield put(logout());
  }
}

function* getChildrenSaga(action: Action<void>) {
  try {
    const token = yield select(selectors.getToken);
    const result = yield call(api.getChildren, token);

    yield put(getChildrenSuccess());
    yield dispatchUpdates(result);
  } catch (error) {
    yield put(getChildrenError(error));
  }
}

function* getNeededUsersSaga(action: Action<void>) {
  try {
    const token = yield select(selectors.getToken);
    const result = yield call(api.getNeededUsers, token);

    yield put(getNeededUsersSuccess());
    yield dispatchUpdates(result);
  } catch (error) {
    yield put(getNeededUsersError(error));
  }
}

function* getEntrySaga(action: Action<MongoId>) {
  try {
    const token = yield select(selectors.getToken);
    const result = yield call(api.getEntry, action.payload, token);

    yield put(getEntrySuccess());
    yield dispatchUpdates(result);
  } catch (error) {
    yield put(addMessage(lang().message.request.error));
    yield put(getEntryError(error));
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

function* getUserSaga(action: Action<MongoId>) {
  try {
    const token = yield select(selectors.getToken);
    const result = yield call(api.getUser, action.payload, token);

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

function* getTeachersSaga() {
  try {
    const token = yield select(selectors.getToken);
    const result = yield call(api.getTeachers, token);

    yield put(getTeachersSuccess());
    yield dispatchUpdates(result);
  } catch (error) {
    yield put(addMessage(lang().message.request.error));
    yield put(getTeachersError(error));
  }
}

function* createEntrySaga(action: Action<IEntryCreate>) {
  try {
    const token = yield select(selectors.getToken);
    const result = yield call(api.createEntry, action.payload, token);

    yield put(createEntrySuccess());
    yield dispatchUpdates(result);
  } catch (error) {
    yield put(createEntryError(error));
  }
}

function* createUsersSaga(action: Action<IUserCreate[]>) {
  try {
    const first: IUserCreate[] = [];
    const second: IUserCreate[] = [];

    action.payload!.forEach(value => {
      if (value.role === Roles.MANAGER || value.role === Roles.PARENT) {
        second.push(value);
      } else {
        first.push(value);
      }
    });

    const token = yield select(selectors.getToken);

    if (first.length !== 0) {
      const result = yield call(api.createUser, first, token);
      yield dispatchUpdates(result);
    }

    if (second.length !== 0) {
      const result = yield call(api.createUser, second, token);
      yield dispatchUpdates(result);
    }

    yield put(createUsersSuccess());
  } catch (error) {
    yield put(createUsersError(error));
  }
}

function* updateUserSaga(action: Action<Partial<IUser>>) {
  try {
    const token = yield select(selectors.getToken);
    const result = yield call(api.updateUser, action.payload, token);

    yield put(createUsersSuccess());
    yield dispatchUpdates(result);
  } catch (error) {
    yield put(createUsersError(error));
  }
}

function* signEntrySaga(action: Action<MongoId>) {
  try {
    const token = yield select(selectors.getToken);
    const result = yield call(api.signEntry, action.payload, token);

    yield put(singEntrySuccess());
    yield dispatchUpdates(result);
  } catch (error) {
    yield put(addMessage(lang().message.sign.error));
    yield put(signEntryError(error));
  }
}

function* resetPasswordSaga(action: Action<string>) {
  try {
    const result = yield call(api.resetPassword, action.payload);

    yield put(addMessage(lang().message.resetPassword.success));
    yield put(resetPasswordSuccess(result));
  } catch (error) {
    yield put(addMessage(lang().message.request.error));
    yield put(resetPasswordError(error));
  }
}

function* setPasswordSaga(action: Action<INewPassword>) {
  try {
    const result = yield call(api.setPassword, action.payload!.token, action.payload!.password);

    yield put(addMessage(lang().message.setPassword.success));
    yield put(resetPasswordSuccess(result));
  } catch (error) {
    yield put(addMessage(lang().message.setPassword.error));
    yield put(resetPasswordError(error));
  }
}

function* saga() {
  yield takeEvery<Action<MongoId>>(GET_ENTRY_REQUEST, getEntrySaga);
  yield takeEvery(GET_ENTRIES_REQUEST, getEntriesSaga);
  yield takeEvery<Action<MongoId>>(GET_USER_REQUEST, getUserSaga);
  yield takeEvery(GET_USERS_REQUEST, getUsersSaga);
  yield takeEvery(GET_SLOTS_REQUEST, getSlotsSaga);
  yield takeEvery(GET_TEACHERS_REQUEST, getTeachersSaga);
  yield takeEvery(SIGN_ENTRY_REQUEST, signEntrySaga);
  yield takeEvery(RESET_PASSWORD_REQUEST, resetPasswordSaga);
  yield takeEvery(SET_PASSWORD_REQUEST, setPasswordSaga);
  yield takeEvery(GET_TOKEN_REQUEST, getTokenSaga);
  yield takeEvery(REFRESH_TOKEN_REQUEST, refreshTokenSaga);
  yield takeEvery(GET_CHILDREN_REQUEST, getChildrenSaga);
  yield takeEvery(GET_NEEDED_USERS_REQUEST, getNeededUsersSaga);
  yield takeEvery<Action<IEntryCreate>>(CREATE_ENTRY_REQUEST, createEntrySaga);
  yield takeEvery<Action<IUserCreate[]>>(CREATE_USERS_REQUEST, createUsersSaga);
  yield takeEvery<Action<Partial<IUser>>>(UPDATE_USER_REQUEST, updateUserSaga);
}

export default saga;
