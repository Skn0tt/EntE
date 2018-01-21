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
  createEntrySuccess,
  createEntryError,
  createUserError,
  createUserSuccess,
  signEntryError,
  singEntrySuccess,
  resetPasswordError,
  resetPasswordSuccess,
} from './actions';
import {
  GET_ENTRY_REQUEST,
  GET_ENTRIES_REQUEST,
  GET_USER_REQUEST,
  GET_USERS_REQUEST,
  CHECK_AUTH_REQUEST,
  GET_TEACHERS_REQUEST,
  GET_SLOTS_REQUEST,
  CREATE_ENTRY_REQUEST,
  CREATE_USER_REQUEST,
  UPDATE_USER_REQUEST,
  SIGN_ENTRY_REQUEST,
  RESET_PASSWORD_REQUEST,
  SET_PASSWORD_REQUEST,
} from './constants';
import * as api from './api';
import { Action } from 'redux-actions';
import * as selectors from './selectors';
import { 
  APIResponse,
  ICredentials,
  MongoId,
  IEntryCreate,
  IUserCreate,
  IUser,
  INewPassword,
  Roles,
} from '../interfaces/index';

function* dispatchUpdates(data: APIResponse) {
  yield put(addResponse(data));
}

function* checkAuthSaga(action: Action<ICredentials>) {
  try {
    const result = yield call(api.checkAuth, action.payload);
    
    yield dispatchUpdates(result);
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

function* createEntrySaga(action: Action<IEntryCreate>) {
  try {
    const auth = yield select(selectors.getAuthCredentials);
    const result = yield call(api.createEntry, action.payload, auth);

    yield put(createEntrySuccess());
    yield dispatchUpdates(result);
  } catch (error) {
    yield put(createEntryError(error));
  }
}

function* createUserSaga(action: Action<IUserCreate[]>) {
  try {
    const first: IUserCreate[] = [];
    const second: IUserCreate[] = [];

    action.payload!.forEach((value) => {
      if (
        value.role === Roles.MANAGER || value.role === Roles.PARENT
      ) { second.push(value); }
      else { first.push(value); }
    });
    
    const auth = yield select(selectors.getAuthCredentials);
    
    if (first.length !== 0) {
      const result = yield call(api.createUser, first, auth);
      yield dispatchUpdates(result);
    }
    
    if (second.length !== 0) {
      const result = yield call(api.createUser, second, auth);
      yield dispatchUpdates(result);
    }

    yield put(createUserSuccess());
  } catch (error) {
    yield put(createUserError(error));
  }
}

function* updateUserSaga(action: Action<Partial<IUser>>) {
  try {
    const auth = yield select(selectors.getAuthCredentials);
    const result = yield call(api.updateUser, action.payload, auth);

    yield put(createUserSuccess());
    yield dispatchUpdates(result);
  } catch (error) {
    yield put(createUserError(error));
  }
}

function* signEntrySaga(action: Action<MongoId>) {
  try {
    const auth = yield select(selectors.getAuthCredentials);
    const result = yield call(api.signEntry, action.payload, auth);

    yield put(singEntrySuccess());
    yield dispatchUpdates(result);
  } catch (error) {
    yield put(signEntryError(error));
  }
}

function* resetPasswordSaga(action: Action<string>) {
  try {
    const result = yield call(api.resetPassword, action.payload);
    yield put(resetPasswordSuccess(result));
  } catch (error) {
    yield put(resetPasswordError(error));
  }
}

function* setPasswordSaga(action: Action<INewPassword>) {
  try {
    const result = yield call(api.setPassword, action.payload!.token, action.payload!.password);
    yield put(resetPasswordSuccess(result));
  } catch (error) {
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
  yield takeEvery<Action<ICredentials>>(CHECK_AUTH_REQUEST, checkAuthSaga);
  yield takeEvery<Action<IEntryCreate>>(CREATE_ENTRY_REQUEST, createEntrySaga);
  yield takeEvery<Action<IUserCreate[]>>(CREATE_USER_REQUEST, createUserSaga);
  yield takeEvery<Action<Partial<IUser>>>(UPDATE_USER_REQUEST, updateUserSaga);
}

export default saga;
