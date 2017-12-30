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
  getTeachersError,
  getTeachersSuccess,
  getSlotsSuccess,
  getSlotsError,
  addResponse,
} from './actions';
import {
  GET_ENTRY_REQUEST,
  GET_ENTRIES_REQUEST,
  GET_USER_REQUEST,
  GET_USERS_REQUEST,
  CHECK_AUTH_REQUEST,
  GET_TEACHERS_REQUEST,
  GET_SLOTS_REQUEST
} from './constants';
import * as api from './api';
import { Action } from 'redux-actions';
import * as selectors from './selectors';
import { APIResponse, ICredentials, MongoId, AuthState } from '../interfaces/index';

function* dispatchUpdates(data: APIResponse) {
  const { entries, slots, users } = data;

  yield put(addResponse({ entries, slots, users }));
}

function* checkAuthSaga(action: Action<ICredentials>) {
  try {
    const result: { auth: AuthState, data: APIResponse } = yield call(api.checkAuth, action.payload);
    
    yield dispatchUpdates(result.data);
    yield put(checkAuthSuccess(result.auth));
  } catch (error) {
    yield put(checkAuthError(error));
  }
}

function* getEntrySaga(action: Action<MongoId>) {
  try {
    const auth = yield select(selectors.getAuthCredentials);
    const result = yield call(api.getEntry, action.payload, auth);
    
    yield put(getEntrySuccess());
    yield dispatchUpdates(result);
  } catch (error) {
    yield put(getEntryError(error));
  }
}

function* getEntriesSaga() {
  try {
    const auth = yield select(selectors.getAuthCredentials);
    const result = yield call(api.getEntries, auth);

    yield put(getEntriesSuccess());
    yield dispatchUpdates(result);
  } catch (error) {
    yield put(getEntriesError(error));
  }
}

function* getSlotsSaga() {
  try {
    const auth = yield select(selectors.getAuthCredentials);
    const result = yield call(api.getSlots, auth);

    yield put(getSlotsSuccess());
    yield dispatchUpdates(result);
  } catch (error) {
    yield put(getSlotsError(error));
  }
}

function* getUserSaga(action: Action<MongoId>) {
  try {
    const auth = yield select(selectors.getAuthCredentials);
    const result = yield call(api.getUser, action.payload, auth);

    yield put(getUserSuccess());
    yield dispatchUpdates(result);
  } catch (error) {
    yield put(getUserError(error));
  }
}

function* getUsersSaga() {
  try {
    const auth = yield select(selectors.getAuthCredentials);
    const result = yield call(api.getUsers, auth);

    yield put(getUsersSuccess());
    yield dispatchUpdates(result);
  } catch (error) {
    yield put(getUsersError(error));
  }
}

function* getTeachersSaga() {
  try {
    const auth = yield select(selectors.getAuthCredentials);
    const result = yield call(api.getTeachers, auth);

    yield put(getTeachersSuccess());
    yield dispatchUpdates(result);
  } catch (error) {
    yield put(getTeachersError(error));
  }
}

function* saga() {
  yield takeEvery<Action<MongoId>>(GET_ENTRY_REQUEST, getEntrySaga);
  yield takeEvery(GET_ENTRIES_REQUEST, getEntriesSaga);
  yield takeEvery<Action<MongoId>>(GET_USER_REQUEST, getUserSaga);
  yield takeEvery(GET_USERS_REQUEST, getUsersSaga);
  yield takeEvery(GET_SLOTS_REQUEST, getSlotsSaga);
  yield takeEvery(GET_TEACHERS_REQUEST, getTeachersSaga);
  yield takeEvery<Action<ICredentials>>(CHECK_AUTH_REQUEST, checkAuthSaga);
}

export default saga;