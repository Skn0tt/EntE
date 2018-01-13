import { handleActions, Action, BaseAction, ReducerMap } from 'redux-actions';
import { Entry, AppState, AuthState, APIResponse, MongoId, User, Slot } from '../interfaces/index';
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
  ADD_RESPONSE,
  REMOVE_ERROR,
} from './constants';
import { ActionType } from 'redux-saga/effects';
import { Map, List } from 'immutable';

const initialState = new AppState({});

const reducer = handleActions({
  /**
   * CHECK_AUTH
   */
  [CHECK_AUTH_REQUEST]: (state, action: BaseAction): AppState => state
    .update('loading', loading => loading + 1),
  [CHECK_AUTH_ERROR]: (state, action): AppState => state
    .update('loading', loading => loading - 1)
    .update('errors', errors => errors.push(action.payload)),
  [CHECK_AUTH_SUCCESS]: (state, action): AppState => state
    .update('loading', loading => loading - 1)
    .set('auth', action.payload),

  /**
   * LOGOUT
   */
  [LOGOUT]: (state: AppState, action: BaseAction): AppState => state
    .set('auth', new AuthState({
      checked: true,
    })),
  
  /**
   * SIGN_ENTRY
   */
  [GET_ENTRIES_REQUEST]: (state: AppState, action: BaseAction): AppState => state
    .update('loading', loading => loading + 1),
  [GET_ENTRIES_ERROR]: (state: AppState, action): AppState => state
    .update('loading', loading => loading - 1)
    .update('errors', errors => errors.push(action.payload)),
  [GET_ENTRIES_SUCCESS]: (state, action) => state
    .update('loading', loading => loading - 1),
  
  /**
   * GET_ENTRIES
   */
  [GET_ENTRIES_REQUEST]: (state: AppState, action: BaseAction): AppState => state
    .update('loading', loading => loading + 1),
  [GET_ENTRIES_ERROR]: (state: AppState, action): AppState => state
    .update('loading', loading => loading - 1)
    .update('errors', errors => errors.push(action.payload)),
  [GET_ENTRIES_SUCCESS]: (state, action) => state
    .update('loading', loading => loading - 1),
  
  /**
   * GET_ENTRY
   */
  [GET_ENTRY_REQUEST]: (state, action) => state
    .update('loading', loading => loading + 1),
  [GET_ENTRY_ERROR]: (state, action) => state
    .update('loading', loading => loading - 1)
    .update('errors', errors => errors.push(action.payload)),
  [GET_ENTRY_SUCCESS]: (state, action: Action<Entry>) => state
    .update('loading', loading => loading - 1),

  /**
   * GET_SLOTS
   */
  [GET_SLOTS_REQUEST]: (state, action) => state
    .update('loading', loading => loading + 1),
  [GET_SLOTS_ERROR]: (state, action) => state
    .update('loading', loading => loading - 1)
    .update('errors', errors => errors.push(action.payload)),
  [GET_SLOTS_SUCCESS]: (state, action) => state
    .update('loading', loading => loading - 1),

  /**
   * GET_USERS
   */
  [GET_USERS_REQUEST]: (state, action) => state
    .update('loading', loading => loading + 1),
  [GET_USERS_ERROR]: (state, action) => state
    .update('loading', loading => loading - 1)
    .update('errors', errors => errors.push(action.payload)),
  [GET_USERS_SUCCESS]: (state, action) => state
    .update('loading', loading => loading - 1),

  /**
   * GET_TEACHERS
   */
  [GET_TEACHERS_REQUEST]: (state, action) => state
    .update('loading', loading => loading + 1),
  [GET_TEACHERS_ERROR]: (state, action) => state
    .update('loading', loading => loading - 1)
    .update('errors', errors => errors.push(action.payload)),
  [GET_TEACHERS_SUCCESS]: (state, action) => state
    .update('loading', loading => loading - 1),

  /**
   * GET_USER
   */
  [GET_USER_REQUEST]: (state, action) => state
    .update('loading', loading => loading + 1),
  [GET_USER_ERROR]: (state, action) => state
    .update('loading', loading => loading - 1)
    .update('errors', errors => errors.push(action.payload)),
  [GET_USER_SUCCESS]: (state, action): AppState => state
    .update('loading', loading => loading - 1),

  /**
   * ADD_RESPONSE
   */
  [ADD_RESPONSE]: (state: AppState, action: Action<APIResponse>): AppState => state
    .update('users', users => users.merge(
      Map<MongoId, User>(action.payload!.users.map(user => [user.get('_id'), user])),
    ))
    .update('slots', slots => slots.merge(
      Map<MongoId, Slot>(action.payload!.slots.map(slot => [slot.get('_id'), slot])),
    ))
    .update('entries', entries => entries.merge(
      Map<MongoId, Entry>(action.payload!.entries.map(entry => [entry.get('_id'), entry])),
    )),

  /**
   * REMOVE_ERROR
   */
  [REMOVE_ERROR]: (state: AppState, action: Action<number>) => state
    .update('errors', (errors: List<Error>) => errors.remove(action.payload!)),

} as ReducerMap<AppState, ActionType>, initialState); // tslint:disable-line:align

export default reducer;
