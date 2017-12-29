import { takeEvery, call, put, select } from 'redux-saga/effects';
import {
  getEntryError,
  getEntriesError,
  getEntriesSuccess,
  getEntrySuccess,
  getUserError,
  getUsersSuccess,
  getUserSuccess,
  getUsersError,
  checkAuthSuccess,
  checkAuthError,
  getTeachersRequest,
} from './actions';
import {
  GET_ENTRY_REQUEST,
  GET_ENTRIES_REQUEST,
  GET_USER_REQUEST,
  GET_USERS_REQUEST,
  CHECK_AUTH_REQUEST,
  GET_TEACHERS_REQUEST
} from './constants';
import * as api from './api';
import { Action } from 'redux-actions';
import * as selectors from './selectors';
import { MongoId, ICredentials, AuthState } from '../interfaces/index';

function* checkAuthSaga(action: Action<ICredentials>) {
  try {
    const authState: AuthState = yield call(api.checkAuth, action.payload);

    yield put(checkAuthSuccess(authState));
    yield put(getTeachersRequest());
  } catch (error) {
    yield put(checkAuthError(error));
  }
}

function* getEntrySaga(action: Action<MongoId>) {
  try {
    const auth = yield select(selectors.getAuthCredentials);
    const entry = yield call(api.getEntry, action.payload, auth);

    yield put(getEntrySuccess(entry));
  } catch (error) {
    yield put(getEntryError(error));
  }
}

function* getEntriesSaga() {
  try {
    const auth = yield select(selectors.getAuthCredentials);
    const entries = yield call(api.getEntries, auth);

    yield put(getEntriesSuccess(entries));
  } catch (error) {
    yield put(getEntriesError(error));
  }
}

function* getUserSaga(action: Action<MongoId>) {
  try {
    const auth = yield select(selectors.getAuthCredentials);
    const user = yield call(api.getUser, action.payload, auth);

    yield put(getUserSuccess(user));
  } catch (error) {
    yield put(getUserError(error));
  }
}

function* getUsersSaga() {
  try {
    const auth = yield select(selectors.getAuthCredentials);
    const users = yield call(api.getUsers, auth);

    yield put(getUsersSuccess(users));
  } catch (error) {
    yield put(getUsersError(error));
  }
}

function* getTeachersSaga() {
  try {
    const auth = yield select(selectors.getAuthCredentials);
    const teachers = yield call(api.getTeachers, auth);

    yield put(getUsersSuccess(teachers));
  } catch (error) {
    yield put(getUsersError(error));
  }
}

function* saga() {
  yield takeEvery<Action<MongoId>>(GET_ENTRY_REQUEST, getEntrySaga);
  yield takeEvery(GET_ENTRIES_REQUEST, getEntriesSaga);
  yield takeEvery<Action<MongoId>>(GET_USER_REQUEST, getUserSaga);
  yield takeEvery(GET_USERS_REQUEST, getUsersSaga);
  yield takeEvery(GET_TEACHERS_REQUEST, getTeachersSaga);
  yield takeEvery<Action<ICredentials>>(CHECK_AUTH_REQUEST, checkAuthSaga);
}

export default saga;