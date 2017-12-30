import { handleActions, Action } from 'redux-actions';
import { Entry, AppState, MongoId, User, AuthState, Slot } from '../interfaces/index';
import { Map } from 'immutable';
import {
  GET_ENTRIES_REQUEST,
  GET_ENTRIES_SUCCESS,
  GET_ENTRIES_ERROR,
  GET_ENTRY_REQUEST,
  GET_ENTRY_ERROR,
  GET_ENTRY_SUCCESS,
  GET_USER_REQUEST,
  GET_USERS_ERROR,
  GET_USER_ERROR,
  GET_USER_SUCCESS,
  GET_USERS_REQUEST,
  GET_USERS_SUCCESS,
  CHECK_AUTH_REQUEST,
  CHECK_AUTH_ERROR,
  CHECK_AUTH_SUCCESS,
  LOGOUT,
  GET_TEACHERS_REQUEST,
  GET_TEACHERS_ERROR,
  GET_TEACHERS_SUCCESS,
  GET_SLOTS_REQUEST,
  GET_SLOTS_ERROR,
  GET_SLOTS_SUCCESS,
  ADD_USERS,
  ADD_SLOTS,
  ADD_ENTRIES
} from './constants';

const initialState = new AppState({});

const keepDefined = (prev: any, next: any) => next ? next : prev;

const reducer = handleActions({
  /**
   * CHECK_AUTH
   */
  [CHECK_AUTH_REQUEST]: state => state
    .update('loading', loading => loading + 1),
  [CHECK_AUTH_ERROR]: (state, action) => state
    .update('loading', loading => loading - 1)
    .update('errors', errors => errors.push(action.payload)),
  [CHECK_AUTH_SUCCESS]: (state, action: Action<AuthState>) => state
    .update('loading', loading => loading - 1)
    .set('auth', action.payload),
  
  /**
   * LOGOUT
   */
  [LOGOUT]: (state: AppState, action) => state
    .set('auth', new AuthState({
      checked: true,
    })),
  
  /**
   * GET_ENTRIES
   */
  [GET_ENTRIES_REQUEST]: state => state
    .update('loading', loading => loading + 1),
  [GET_ENTRIES_ERROR]: (state, action) => state
    .update('loading', loading => loading - 1)
    .update('errors', errors => errors.push(action.payload)),
  [GET_ENTRIES_SUCCESS]: (state, action) => state
    .update('loading', loading => loading - 1),
  
  /**
   * GET_ENTRY
   */
  [GET_ENTRY_REQUEST]: state => state
    .update('loading', loading => loading + 1),
  [GET_ENTRY_ERROR]: (state, action) => state
    .update('loading', loading => loading - 1)
    .update('errors', errors => errors.push(action.payload)),
  [GET_ENTRY_SUCCESS]: (state, action: Action<Entry>) => state
    .update('loading', loading => loading - 1)
    .setIn(['entries', action.payload!.get('_id')], action.payload),

  /**
   * GET_SLOTS
   */
  [GET_SLOTS_REQUEST]: state => state
    .update('loading', loading => loading + 1),
  [GET_SLOTS_ERROR]: (state, action) => state
    .update('loading', loading => loading - 1)
    .update('errors', errors => errors.push(action.payload)),
  [GET_SLOTS_SUCCESS]: (state, action) => state
    .update('loading', loading => loading - 1),

  /**
   * GET_USERS
   */
  [GET_USERS_REQUEST]: state => state
    .update('loading', loading => loading + 1),
  [GET_USERS_ERROR]: (state, action) => state
    .update('loading', loading => loading - 1)
    .update('errors', errors => errors.push(action.payload)),
  [GET_USERS_SUCCESS]: (state, action) => state
    .update('loading', loading => loading - 1),

  /**
   * GET_TEACHERS
   */
  [GET_TEACHERS_REQUEST]: state => state
    .update('loading', loading => loading + 1),
  [GET_TEACHERS_ERROR]: (state, action) => state
    .update('loading', loading => loading - 1)
    .update('errors', errors => errors.push(action.payload)),
  [GET_TEACHERS_SUCCESS]: (state, action) => state
    .update('loading', loading => loading - 1),

  /**
   * GET_USER
   */
  [GET_USER_REQUEST]: state => state
    .update('loading', loading => loading + 1),
  [GET_USER_ERROR]: (state, action) => state
    .update('loading', loading => loading - 1)
    .update('errors', errors => errors.push(action.payload)),
  [GET_USER_SUCCESS]: (state, action: Action<User>) => state
    .update('loading', loading => loading - 1),

  /**
   * ADD_USERS
   */
  [ADD_USERS]: (state, action) => state
    .update('users', (map: Map<MongoId, User>) => map.mergeDeepWith(
      keepDefined,
      Map<MongoId, User>(action.payload!.map((user: User) => [user.get('_id'), user]))
    )),

  /**
   * ADD_SLOTS
   */
  [ADD_SLOTS]: (state, action) => state
    .update('slots', (map: Map<MongoId, Slot>) => map.mergeDeepWith(
      keepDefined,
      Map<MongoId, Slot>(action.payload!.map((slot: Slot) => [slot.get('_id'), slot]))
    )),

  /**
   * ADD_ENTRIES
   */
  [ADD_ENTRIES]: (state, action) => state
    .update('entries', (map: Map<MongoId, Entry>) => map.mergeDeepWith(
      keepDefined,
      Map<MongoId, Entry>(action.payload!.map((entry: Entry) => [entry.get('_id'), entry]))
    )),
  
}, initialState); // tslint:disable-line:align

export default reducer;
