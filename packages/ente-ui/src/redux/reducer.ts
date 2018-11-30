/**
 * EntE
 * (c) 2017-present, Simon Knott <info@simonknott.de>
 *
 * This source code is licensed under the GNU Affero General Public License
 * found in the LICENSE file in the root directory of this source tree.
 */

import { handleActions, Action, ReducerMap } from "redux-actions";
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
  GET_SLOTS_REQUEST,
  GET_SLOTS_ERROR,
  GET_SLOTS_SUCCESS,
  ADD_RESPONSE,
  RESET_PASSWORD_REQUEST,
  RESET_PASSWORD_ERROR,
  RESET_PASSWORD_SUCCESS,
  SET_PASSWORD_REQUEST,
  SET_PASSWORD_ERROR,
  SET_PASSWORD_SUCCESS,
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
  PATCH_FORSCHOOL_SUCCESS,
  DELETE_USER_ERROR,
  DELETE_USER_REQUEST,
  DELETE_USER_SUCCESS,
  DELETE_ENTRY_ERROR,
  DELETE_ENTRY_SUCCESS,
  DOWNLOAD_EXCEL_EXPORT_REQUEST,
  DOWNLOAD_EXCEL_EXPORT_ERROR,
  DOWNLOAD_EXCEL_EXPORT_SUCCESS
} from "./constants";
import { ActionType } from "redux-saga/effects";
import { Map, List, Record } from "immutable";
import {
  AppState,
  AuthState,
  APIResponse,
  UserN,
  SlotN,
  EntryN
} from "./types";
import { Some } from "monet";

const withoutEntries = (...ids: string[]) => (state: AppState) => {
  const entries = state
    .get("entriesMap")
    .filter(e => ids.includes(e.get("id")));
  const woEntries = state.update("entriesMap", e =>
    e.withMutations(m => {
      entries.forEach(e => {
        m.delete(e.get("id"));
      });
    })
  );

  const slotIds: string[] = entries
    .map(e => e.get("slotIds"))
    .flatten(1)
    .valueSeq()
    .toArray();

  const withoutSlots = woEntries.update("slotsMap", s =>
    s.withMutations(m => {
      slotIds.forEach(s => {
        m.delete(s);
      });
    })
  );

  return withoutSlots;
};

const asyncReducers = (request: string, error: string) => ({
  [request]: (state: AppState, action: Action<void>) =>
    state.update("loading", loading => loading + 1),
  [error]: (state: AppState, action: Action<Error>) =>
    state.update("loading", loading => loading - 1)
});

const asyncReducersFull = (
  request: string,
  error: string,
  success: string
) => ({
  ...asyncReducers(request, error),
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
    [GET_TOKEN_SUCCESS]: (state, action: Action<AuthState>) =>
      state
        .set("auth", Some(action.payload))
        .update("loading", loading => loading - 1),

    // ## REFRESH_TOKEN
    [REFRESH_TOKEN_REQUEST]: state =>
      state.update("loading", loading => loading + 1),
    [REFRESH_TOKEN_ERROR]: (state, action: Action<Error>) =>
      state.update("loading", loading => loading - 1),
    [REFRESH_TOKEN_SUCCESS]: (state, action: Action<AuthState>) =>
      state
        .set("auth", Some(action.payload))
        .update("loading", loading => loading - 1),

    // ## LOGOUT
    [LOGOUT]: (state: AppState): AppState =>
      new AppState({
        loading: state.get("loading")
      }),

    // ## RESET_PASSWORD
    ...asyncReducersFull(
      RESET_PASSWORD_REQUEST,
      RESET_PASSWORD_ERROR,
      RESET_PASSWORD_SUCCESS
    ),

    // ## SET_PASSWORD
    ...asyncReducersFull(
      SET_PASSWORD_REQUEST,
      SET_PASSWORD_ERROR,
      SET_PASSWORD_SUCCESS
    ),

    /**
     * # Interaction
     */
    // ## SIGN_ENTRY
    ...asyncReducersFull(
      SIGN_ENTRY_REQUEST,
      SIGN_ENTRY_ERROR,
      SIGN_ENTRY_SUCCESS
    ),

    // ## UNSIGN_ENTRY
    ...asyncReducersFull(
      UNSIGN_ENTRY_REQUEST,
      UNSIGN_ENTRY_ERROR,
      UNSIGN_ENTRY_SUCCESS
    ),

    // ## DOWNLOAD_EXCEL_EXPORT
    ...asyncReducersFull(
      DOWNLOAD_EXCEL_EXPORT_REQUEST,
      DOWNLOAD_EXCEL_EXPORT_ERROR,
      DOWNLOAD_EXCEL_EXPORT_SUCCESS
    ),

    // ## PATCH_FORSCHOOl
    ...asyncReducersFull(
      PATCH_FORSCHOOL_REQUEST,
      PATCH_FORSCHOOL_ERROR,
      PATCH_FORSCHOOL_SUCCESS
    ),

    // ## DELETE_USER
    ...asyncReducers(DELETE_USER_REQUEST, DELETE_USER_ERROR),
    [DELETE_USER_SUCCESS]: (state: AppState, action: Action<string>) => {
      const userId = action.payload;

      const minusLoading = state.update("loading", l => l - 1);

      const withoutUser = minusLoading.deleteIn(["usersMap", userId]);

      const entriesOfUser = state
        .get("entriesMap")
        .filter(e => e.get("studentId") === userId);

      return withoutEntries(
        ...entriesOfUser
          .map(m => m.get("id"))
          .valueSeq()
          .toArray()
      )(withoutUser);
    },

    // ## DELETE_ENTRY
    ...asyncReducers(DELETE_ENTRY_ERROR, DELETE_ENTRY_ERROR),
    [DELETE_ENTRY_SUCCESS]: (state: AppState, action: Action<string>) => {
      const entryId = action.payload;
      const minusLoading = state.update("loading", l => l - 1);
      return withoutEntries(entryId)(minusLoading);
    },

    /**
     * # GET
     */
    // ## GET_ENTRIES
    ...asyncReducersFull(
      GET_ENTRIES_REQUEST,
      GET_ENTRIES_ERROR,
      GET_ENTRIES_SUCCESS
    ),

    // ## GET_ENTRY
    ...asyncReducersFull(GET_ENTRY_REQUEST, GET_ENTRY_ERROR, GET_ENTRY_SUCCESS),

    // ## GET_SLOTS
    ...asyncReducersFull(GET_SLOTS_REQUEST, GET_SLOTS_ERROR, GET_SLOTS_SUCCESS),

    // ## GET_USER
    ...asyncReducersFull(GET_USER_REQUEST, GET_USER_ERROR, GET_USER_SUCCESS),

    // ## GET_USERS
    ...asyncReducersFull(GET_USERS_REQUEST, GET_USERS_ERROR, GET_USERS_SUCCESS),

    // ## GET_NEEDED_USERS
    ...asyncReducersFull(
      GET_NEEDED_USERS_REQUEST,
      GET_NEEDED_USERS_ERROR,
      GET_NEEDED_USERS_SUCCESS
    ),

    // ## ADD_RESPONSE
    [ADD_RESPONSE]: (state: AppState, action: Action<APIResponse>): AppState =>
      state
        .update("usersMap", users =>
          users.merge(
            Map<string, UserN>(
              action.payload!.users.map(
                user => [user.get("id"), user] as [string, UserN]
              )
            )
          )
        )
        .update("slotsMap", slots =>
          slots.merge(
            Map<string, SlotN>(
              action.payload!.slots.map(
                slot => [slot.get("id"), slot] as [string, SlotN]
              )
            )
          )
        )
        .update("entriesMap", entries =>
          entries.merge(
            Map<string, EntryN>(
              action.payload!.entries.map(
                entry => [entry.get("id"), entry] as [string, EntryN]
              )
            )
          )
        ),

    /**
     * # CREATE
     */
    // ## CREATE_ENTRY
    ...asyncReducersFull(
      CREATE_ENTRY_REQUEST,
      CREATE_ENTRY_ERROR,
      CREATE_ENTRY_SUCCESS
    ),

    // ## CREATE_USERS
    ...asyncReducersFull(
      CREATE_USERS_REQUEST,
      CREATE_USERS_ERROR,
      CREATE_USERS_SUCCESS
    ),

    /**
     * # UPDATE
     */
    // ## UPDATE_USERS
    ...asyncReducersFull(
      UPDATE_USER_REQUEST,
      UPDATE_USER_SUCCESS,
      UPDATE_USER_ERROR
    )
  } as ReducerMap<AppState, ActionType>,
  initialState
); // tslint:disable-line:align

export default reducer;
