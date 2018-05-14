/**
 * EntE
 * (c) 2017-present, Simon Knott <info@simonknott.de>
 * 
 * This source code is licensed under the GNU Affero General Public License
 * found in the LICENSE file in the root directory of this source tree.
 */

import { handleActions, Action, BaseAction, ReducerMap } from "redux-actions";
import { Entry, AppState, APIResponse, User, Slot } from "./types";
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
  CREATE_ENTRY_REQUEST,
  CREATE_ENTRY_ERROR,
  CREATE_ENTRY_SUCCESS,
  CREATE_USERS_REQUEST,
  CREATE_USERS_ERROR,
  CREATE_USERS_SUCCESS,
  UPDATE_USER_REQUEST,
  UPDATE_USER_ERROR,
  UPDATE_USER_SUCCESS,
  GET_CHILDREN_REQUEST,
  GET_CHILDREN_ERROR,
  GET_CHILDREN_SUCCESS,
  GET_NEEDED_USERS_ERROR,
  GET_NEEDED_USERS_REQUEST,
  GET_NEEDED_USERS_SUCCESS,
  SIGN_ENTRY_ERROR,
  SIGN_ENTRY_REQUEST,
  SIGN_ENTRY_SUCCESS,
  UNSIGN_ENTRY_ERROR,
  UNSIGN_ENTRY_SUCCESS,
  UNSIGN_ENTRY_REQUEST,
  PATCH_FORSCHOOL_REQUEST,
  PATCH_FORSCHOOL_ERROR,
  PATCH_FORSCHOOL_SUCCESS
} from "./constants";
import { ActionType } from "redux-saga/effects";
import { Map, List } from "immutable";
import { TokenInfo, UserId, SlotId, EntryId } from "ente-types";

const asyncReducers = (request: string, error: string, success: string) => ({
  [request]: (state: AppState, action: Action<void>) =>
    state.update("loading", loading => loading + 1),
  [error]: (state: AppState, action: Action<Error>) =>
    state.update("loading", loading => loading - 1),
  [success]: (state: AppState, action: Action<void>): AppState =>
    state.update("loading", loading => loading - 1)
});

const initialState = new AppState({});

const reducer = handleActions(
  {
    /**
     * # Auth
     */
    // ## GET_TOKEN
    [GET_TOKEN_REQUEST]: state =>
      state.update("loading", loading => loading + 1),
    [GET_TOKEN_ERROR]: (state, action: Action<Error>) =>
      state.update("loading", loading => loading - 1),
    [GET_TOKEN_SUCCESS]: (state, action: Action<TokenInfo>) =>
      state
        .update("loading", loading => loading - 1)
        .setIn(["auth", "token"], action.payload!.token)
        .setIn(["auth", "exp"], action.payload!.exp)
        .setIn(["auth", "role"], action.payload!.role)
        .setIn(["auth", "displayname"], action.payload!.displayname),

    // ## REFRESH_TOKEN
    [REFRESH_TOKEN_REQUEST]: state =>
      state.update("loading", loading => loading + 1),
    [REFRESH_TOKEN_ERROR]: (state, action: Action<Error>) =>
      state.update("loading", loading => loading - 1),
    [REFRESH_TOKEN_SUCCESS]: (state, action: Action<TokenInfo>) =>
      state
        .update("loading", loading => loading - 1)
        .setIn(["auth", "token"], action.payload!.token)
        .setIn(["auth", "exp"], action.payload!.exp)
        .setIn(["auth", "role"], action.payload!.role)
        .setIn(["auth", "displayname"], action.payload!.displayname),

    // ## LOGOUT
    [LOGOUT]: (state: AppState, action: BaseAction): AppState =>
      new AppState({}),

    // ## RESET_PASSWORD
    ...asyncReducers(
      RESET_PASSWORD_REQUEST,
      RESET_PASSWORD_ERROR,
      RESET_PASSWORD_SUCCESS
    ),

    // ## SET_PASSWORD
    ...asyncReducers(
      SET_PASSWORD_REQUEST,
      SET_PASSWORD_ERROR,
      SET_PASSWORD_SUCCESS
    ),

    /**
     * # Interaction
     */
    // ## SIGN_ENTRY
    ...asyncReducers(SIGN_ENTRY_REQUEST, SIGN_ENTRY_ERROR, SIGN_ENTRY_SUCCESS),

    // ## UNSIGN_ENTRY
    ...asyncReducers(
      UNSIGN_ENTRY_REQUEST,
      UNSIGN_ENTRY_ERROR,
      UNSIGN_ENTRY_SUCCESS
    ),

    // ## PATCH_FORSCHOOl
    ...asyncReducers(
      PATCH_FORSCHOOL_REQUEST,
      PATCH_FORSCHOOL_ERROR,
      PATCH_FORSCHOOL_SUCCESS
    ),

    /**
     * # GET
     */
    // ## GET_ENTRIES
    ...asyncReducers(
      GET_ENTRIES_REQUEST,
      GET_ENTRIES_ERROR,
      GET_ENTRIES_SUCCESS
    ),

    // ## GET_ENTRY
    ...asyncReducers(GET_ENTRY_REQUEST, GET_ENTRY_ERROR, GET_ENTRY_SUCCESS),

    // ## GET_SLOTS
    ...asyncReducers(GET_SLOTS_REQUEST, GET_SLOTS_ERROR, GET_SLOTS_SUCCESS),

    // ## GET_USER
    ...asyncReducers(GET_USER_REQUEST, GET_USER_ERROR, GET_USER_SUCCESS),

    // ## GET_USERS
    ...asyncReducers(GET_USERS_REQUEST, GET_USERS_ERROR, GET_USERS_SUCCESS),

    // ## GET_TEACHERS
    ...asyncReducers(
      GET_TEACHERS_REQUEST,
      GET_TEACHERS_ERROR,
      GET_TEACHERS_SUCCESS
    ),

    // ## GET_CHILDREN
    ...asyncReducers(
      GET_CHILDREN_REQUEST,
      GET_CHILDREN_ERROR,
      GET_CHILDREN_SUCCESS
    ),

    // ## GET_NEEDED_USERS
    ...asyncReducers(
      GET_NEEDED_USERS_REQUEST,
      GET_NEEDED_USERS_ERROR,
      GET_NEEDED_USERS_SUCCESS
    ),

    // ## ADD_RESPONSE
    [ADD_RESPONSE]: (state: AppState, action: Action<APIResponse>): AppState =>
      state
        .update("users", users =>
          users.merge(
            Map<UserId, User>(
              action.payload!.users.map(user => [user.get("_id"), user])
            )
          )
        )
        .update("slots", slots =>
          slots.merge(
            Map<SlotId, Slot>(
              action.payload!.slots.map(slot => [slot.get("_id"), slot])
            )
          )
        )
        .update("entries", entries =>
          entries.merge(
            Map<EntryId, Entry>(
              action.payload!.entries.map(entry => [entry.get("_id"), entry])
            )
          )
        ),

    /**
     * # CREATE
     */
    // ## CREATE_ENTRY
    ...asyncReducers(
      CREATE_ENTRY_REQUEST,
      CREATE_ENTRY_ERROR,
      CREATE_ENTRY_SUCCESS
    ),

    // ## CREATE_USERS
    ...asyncReducers(
      CREATE_USERS_REQUEST,
      CREATE_USERS_ERROR,
      CREATE_USERS_SUCCESS
    ),

    /**
     * # UPDATE
     */
    // ## UPDATE_USERS
    ...asyncReducers(
      UPDATE_USER_REQUEST,
      UPDATE_USER_SUCCESS,
      UPDATE_USER_ERROR
    ),

    /**
     * # UI
     */
    // ## ADD_MESSAGE
    [ADD_MESSAGE]: (state: AppState, action: Action<string>): AppState =>
      state.update("messages", messages => messages.push(action.payload)),

    // ## REMOVE_MESSAGE
    [REMOVE_MESSAGE]: (state: AppState, action: Action<number>) =>
      state.update("messages", (messages: List<Error>) =>
        messages.remove(action.payload!)
      )
  } as ReducerMap<AppState, ActionType>,
  initialState
); // tslint:disable-line:align

export default reducer;
