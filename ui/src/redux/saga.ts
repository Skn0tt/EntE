import { takeEvery, call, put } from 'redux-saga/effects';
import {
  getEntryError,
  getEntriesError,
  getEntriesSuccess,
  getEntrySuccess,
  getUserError,
  getUsersSuccess,
  getUserSuccess,
  getUsersError,
} from './actions';
import {
  GET_ENTRY_REQUEST,
  GET_ENTRIES_REQUEST,
  GET_USER_REQUEST,
  GET_USERS_REQUEST
} from './constants';
import * as api from './api';
import { Action } from 'redux-actions';
import { MongoId } from '../interfaces/index';

function* getEntrySaga(action: Action<MongoId>) {
  try {
    const entry = yield call(api.getEntry, action.payload);

    yield put(getEntrySuccess(entry));
  } catch (error) {
    yield put(getEntryError(error));
  }
}

function* getEntriesSaga() {
  try {
    const entries = yield call(api.getEntries);

    yield put(getEntriesSuccess(entries));
  } catch (error) {
    yield put(getEntriesError(error));
  }
}

function* getUserSaga(action: Action<MongoId>) {
  try {
    const user = yield call(api.getUser, action.payload);

    yield put(getUserSuccess(user));
  } catch (error) {
    yield put(getUserError(error));
  }
}

function* getUsersSaga() {
  try {
    const users = yield call(api.getUsers);

    yield put(getUsersSuccess(users));
  } catch (error) {
    yield put(getUsersError(error));
  }
}

function* saga() {
  yield takeEvery<Action<MongoId>>(GET_ENTRY_REQUEST, getEntrySaga);
  yield takeEvery(GET_ENTRIES_REQUEST, getEntriesSaga);
  yield takeEvery<Action<MongoId>>(GET_USER_REQUEST, getUserSaga);
  yield takeEvery(GET_USERS_REQUEST, getUsersSaga);
}

export default saga;