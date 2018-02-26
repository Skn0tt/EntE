import { handleActions, Action, BaseAction, ReducerMap } from 'redux-actions';
import { Entry, AppState, APIResponse, MongoId, User, Slot, TokenInfo } from '../interfaces/index';
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
  LOGOUT,
  GET_TEACHERS_REQUEST,
  GET_TEACHERS_ERROR,
  GET_TEACHERS_SUCCESS,
  GET_SLOTS_REQUEST,
  GET_SLOTS_ERROR,
  GET_SLOTS_SUCCESS,
  ADD_RESPONSE,
  RESET_PASSWORD_REQUEST,
  RESET_PASSWORD_ERROR,
  RESET_PASSWORD_SUCCESS,
  REMOVE_MESSAGE,
  SET_PASSWORD_REQUEST,
  SET_PASSWORD_ERROR,
  SET_PASSWORD_SUCCESS,
  ADD_MESSAGE,
  GET_TOKEN_REQUEST,
  GET_TOKEN_ERROR,
  GET_TOKEN_SUCCESS,
  REFRESH_TOKEN_ERROR,
  REFRESH_TOKEN_SUCCESS,
  REFRESH_TOKEN_REQUEST,
} from './constants';
import { ActionType } from 'redux-saga/effects';
import { Map, List } from 'immutable';

const initialState = new AppState({});

const reducer = handleActions(
  {
    /**
     * GET_TOKEN
     */
    [GET_TOKEN_REQUEST]: (state) =>
      state.update('loading', loading => loading + 1),
    [GET_TOKEN_ERROR]: (state, action: Action<Error>) =>
      state.update('loading', loading => loading - 1),
    [GET_TOKEN_SUCCESS]: (state, action: Action<TokenInfo>) => state
      .update('loading', loading => loading - 1)
      .setIn(['auth', 'token'], action.payload!.token)
      .setIn(['auth', 'exp'], action.payload!.exp)
      .setIn(['auth', 'role'], action.payload!.role)
      .setIn(['auth', 'displayname'], action.payload!.displayname),

    /**
     * REFRESH_TOKEN
     */
    [REFRESH_TOKEN_REQUEST]: (state) =>
      state.update('loading', loading => loading + 1),
    [REFRESH_TOKEN_ERROR]: (state, action: Action<Error>) =>
      state.update('loading', loading => loading - 1),
    [REFRESH_TOKEN_SUCCESS]: (state, action: Action<TokenInfo>) => state
      .update('loading', loading => loading - 1)
      .setIn(['auth', 'token'], action.payload!.token)
      .setIn(['auth', 'exp'], action.payload!.exp)
      .setIn(['auth', 'role'], action.payload!.role)
      .setIn(['auth', 'displayname'], action.payload!.displayname),

    /**
     * LOGOUT
     */
    [LOGOUT]: (state: AppState, action: BaseAction): AppState => new AppState({}),

    /**
     * SIGN_ENTRY
     */
    [GET_ENTRIES_REQUEST]: (state: AppState, action: BaseAction): AppState =>
      state.update('loading', loading => loading + 1),
    [GET_ENTRIES_ERROR]: (state: AppState, action: Action<Error>): AppState =>
      state.update('loading', loading => loading - 1),
    [GET_ENTRIES_SUCCESS]: (state, action) => state.update('loading', loading => loading - 1),

    /**
     * GET_ENTRIES
     */
    [GET_ENTRIES_REQUEST]: (state: AppState, action: BaseAction): AppState =>
      state.update('loading', loading => loading + 1),
    [GET_ENTRIES_ERROR]: (state: AppState, action: Action<Error>): AppState =>
      state.update('loading', loading => loading - 1),
    [GET_ENTRIES_SUCCESS]: (state, action) => state.update('loading', loading => loading - 1),

    /**
     * GET_ENTRY
     */
    [GET_ENTRY_REQUEST]: (state, action) => state.update('loading', loading => loading + 1),
    [GET_ENTRY_ERROR]: (state, action: Action<Error>) =>
      state.update('loading', loading => loading - 1),
    [GET_ENTRY_SUCCESS]: (state, action: Action<Entry>) =>
      state.update('loading', loading => loading - 1),

    /**
     * GET_SLOTS
     */
    [GET_SLOTS_REQUEST]: (state, action) => state.update('loading', loading => loading + 1),
    [GET_SLOTS_ERROR]: (state, action: Action<Error>) =>
      state.update('loading', loading => loading - 1),
    [GET_SLOTS_SUCCESS]: (state, action) => state.update('loading', loading => loading - 1),

    /**
     * GET_USERS
     */
    [GET_USERS_REQUEST]: (state, action) => state.update('loading', loading => loading + 1),
    [GET_USERS_ERROR]: (state, action: Action<Error>) =>
      state.update('loading', loading => loading - 1),
    [GET_USERS_SUCCESS]: (state, action) => state.update('loading', loading => loading - 1),

    /**
     * GET_TEACHERS
     */
    [GET_TEACHERS_REQUEST]: (state, action) => state.update('loading', loading => loading + 1),
    [GET_TEACHERS_ERROR]: (state, action: Action<Error>) =>
      state.update('loading', loading => loading - 1),
    [GET_TEACHERS_SUCCESS]: (state, action) => state.update('loading', loading => loading - 1),

    /**
     * GET_USER
     */
    [GET_USER_REQUEST]: (state, action) => state.update('loading', loading => loading + 1),
    [GET_USER_ERROR]: (state, action: Action<Error>) =>
      state.update('loading', loading => loading - 1),
    [GET_USER_SUCCESS]: (state, action): AppState =>
      state.update('loading', loading => loading - 1),

    /**
     * RESET_PASSWORD
     */
    [RESET_PASSWORD_REQUEST]: (state, action) => state.update('loading', loading => loading + 1),
    [RESET_PASSWORD_ERROR]: (state, action: Action<Error>) =>
      state.update('loading', loading => loading - 1),
    [RESET_PASSWORD_SUCCESS]: (state, action): AppState =>
      state.update('loading', loading => loading - 1),

    /**
     * SET_PASSWORD
     */
    [SET_PASSWORD_REQUEST]: (state, action) => state.update('loading', loading => loading + 1),
    [SET_PASSWORD_ERROR]: (state, action: Action<Error>) =>
      state.update('loading', loading => loading - 1),
    [SET_PASSWORD_SUCCESS]: (state, action): AppState =>
      state.update('loading', loading => loading - 1),

    /**
     * ADD_RESPONSE
     */
    [ADD_RESPONSE]: (state: AppState, action: Action<APIResponse>): AppState =>
      state
        .update('users', users =>
          users.merge(
            Map<MongoId, User>(action.payload!.users.map(user => [user.get('_id'), user])),
          ),
        )
        .update('slots', slots =>
          slots.merge(
            Map<MongoId, Slot>(action.payload!.slots.map(slot => [slot.get('_id'), slot])),
          ),
        )
        .update('entries', entries =>
          entries.merge(
            Map<MongoId, Entry>(action.payload!.entries.map(entry => [entry.get('_id'), entry])),
          ),
        ),

    /**
     * ADD_MESSAGE
     */
    [ADD_MESSAGE]: (state: AppState, action: Action<string>): AppState =>
      state.update('messages', messages => messages.push(action.payload)),

    /**
     * REMOVE_MESSAGE
     */
    [REMOVE_MESSAGE]: (state: AppState, action: Action<number>) =>
      state.update('messages', (messages: List<Error>) => messages.remove(action.payload!)),
  } as ReducerMap<AppState, ActionType>,
  initialState,
); // tslint:disable-line:align

export default reducer;
