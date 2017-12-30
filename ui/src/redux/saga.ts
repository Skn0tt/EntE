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
  getTeachersError,
  getTeachersSuccess,
  getSlotsRequest,
  getSlotsSuccess,
  getSlotsError,
  addEntries,
  addSlots,
  addUsers,
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
import { MongoId, ICredentials, AuthState, Roles, Entry, Slot, User } from '../interfaces/index';

function* checkAuthSaga(action: Action<ICredentials>) {
  try {
    const authState: AuthState = yield call(api.checkAuth, action.payload);

    const children: User[] = authState.get('children');

    yield put(checkAuthSuccess(authState));
    yield put(addUsers(children));
    if (
      [Roles.PARENT, Roles.STUDENT]
        .indexOf(authState.get('role')) !== -1) {
      yield put(getTeachersRequest());
    }
    if (
      [Roles.TEACHER]
        .indexOf(authState.get('role')) !== -1) {
      yield put(getSlotsRequest());
    }
  } catch (error) {
    yield put(checkAuthError(error));
  }
}

function* getEntrySaga(action: Action<MongoId>) {
  try {
    const auth = yield select(selectors.getAuthCredentials);
    const entry = yield call(api.getEntry, action.payload, auth);

    const users: User[] = [];
    const slots: Slot[] = [];

    yield put(getEntrySuccess(entry));
    yield put(addUsers(users));
    yield put(addSlots(slots));
  } catch (error) {
    yield put(getEntryError(error));
  }
}

function* getEntriesSaga() {
  try {
    const auth = yield select(selectors.getAuthCredentials);
    const entries: Entry[] = yield call(api.getEntries, auth);

    const slots: Slot[] = [];
    entries.forEach((entry: Entry) => slots.push(...entry.get('slots')));

    yield put(getEntriesSuccess());
    yield put(addEntries(entries));
    yield put(addSlots(slots));
  } catch (error) {
    yield put(getEntriesError(error));
  }
}

function* getSlotsSaga() {
  try {
    const auth = yield select(selectors.getAuthCredentials);
    const slots: Slot[] = yield call(api.getSlots, auth);
    
    const users: User[] = [];
    slots.forEach((slot: Slot) => users.push(slot.get('student'), slot.get('teacher')));

    yield put(getSlotsSuccess());
    yield put(addSlots(slots));
    yield put(addUsers(users));
  } catch (error) {
    yield put(getSlotsError(error));
  }
}

function* getUserSaga(action: Action<MongoId>) {
  try {
    const auth = yield select(selectors.getAuthCredentials);
    const user: User = yield call(api.getUser, action.payload, auth);

    const children: User[] = user.get('children');

    yield put(getUserSuccess(user));
    yield put(addUsers(children));
  } catch (error) {
    yield put(getUserError(error));
  }
}

function* getUsersSaga() {
  try {
    const auth = yield select(selectors.getAuthCredentials);
    const users: User[] = yield call(api.getUsers, auth);

    const children: User[] = [];
    users.forEach((user: User) => children.push(...user.get('children')));

    yield put(getUsersSuccess());
    yield put(addUsers(users));
  } catch (error) {
    yield put(getUsersError(error));
  }
}

function* getTeachersSaga() {
  try {
    const auth = yield select(selectors.getAuthCredentials);
    const teachers = yield call(api.getTeachers, auth);

    yield put(getTeachersSuccess());
    yield put(addUsers(teachers));
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