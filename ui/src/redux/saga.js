import { takeEvery, call, put } from 'redux-saga/effects';
import {
  getEntryError, getEntriesError, getEntriesSuccess,
} from './actions';
import {
  GET_ENTRY_REQUEST, GET_ENTRIES_REQUEST
} from './constants';
import * as api from './api';

function* getEntrySaga() {
  try {

  } catch (error) {
    yield put(getEntryError(error))
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

function* saga() {
  yield takeEvery(GET_ENTRY_REQUEST, getEntrySaga);
  yield takeEvery(GET_ENTRIES_REQUEST, getEntriesSaga);
}

export default saga;