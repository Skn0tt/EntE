/**
 * EntE
 * (c) 2017-present, Simon Knott <info@simonknott.de>
 *
 * This source code is licensed under the GNU Affero General Public License
 * found in the LICENSE file in the root directory of this source tree.
 */

import { handleActions, Action, ActionMeta } from "redux-actions";
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
  RESET_PASSWORD_REQUEST,
  RESET_PASSWORD_ERROR,
  RESET_PASSWORD_SUCCESS,
  SET_PASSWORD_REQUEST,
  SET_PASSWORD_ERROR,
  SET_PASSWORD_SUCCESS,
  LOGIN_REQUEST,
  LOGIN_ERROR,
  LOGIN_SUCCESS,
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
  SIGN_ENTRY_ERROR,
  SIGN_ENTRY_REQUEST,
  SIGN_ENTRY_SUCCESS,
  UNSIGN_ENTRY_ERROR,
  UNSIGN_ENTRY_SUCCESS,
  UNSIGN_ENTRY_REQUEST,
  DELETE_USER_ERROR,
  DELETE_USER_REQUEST,
  DELETE_USER_SUCCESS,
  DELETE_ENTRY_ERROR,
  DELETE_ENTRY_SUCCESS,
  DOWNLOAD_EXCEL_EXPORT_REQUEST,
  DOWNLOAD_EXCEL_EXPORT_ERROR,
  DOWNLOAD_EXCEL_EXPORT_SUCCESS,
  SET_LANGUAGE,
  IMPORT_USERS_REQUEST,
  IMPORT_USERS_ERROR,
  IMPORT_USERS_SUCCESS,
  FETCH_INSTANCE_CONFIG_REQUEST,
  FETCH_INSTANCE_CONFIG_ERROR,
  FETCH_INSTANCE_CONFIG_SUCCESS,
  SET_DEFAULT_DEFAULT_LANGUAGE_REQUEST,
  SET_DEFAULT_DEFAULT_LANGUAGE_ERROR,
  SET_DEFAULT_DEFAULT_LANGUAGE_SUCCESS,
  SET_LOGIN_BANNER_REQUEST,
  SET_LOGIN_BANNER_ERROR,
  SET_LOGIN_BANNER_SUCCESS,
  SET_PARENT_SIGNATURE_EXPIRY_TIME_REQUEST,
  SET_PARENT_SIGNATURE_EXPIRY_TIME_ERROR,
  SET_PARENT_SIGNATURE_EXPIRY_TIME_SUCCESS,
  SET_PARENT_SIGNATURE_NOTIFICATION_TIME_REQUEST,
  SET_PARENT_SIGNATURE_NOTIFICATION_TIME_ERROR,
  SET_PARENT_SIGNATURE_NOTIFICATION_TIME_SUCCESS,
  SET_TIME_SCOPE,
  SET_COLOR_SCHEME
} from "./constants";
import {
  AppState,
  AuthState,
  APIResponse,
  UserN,
  SlotN,
  EntryN,
  InstanceConfigN,
  ParentSignatureTimesN
} from "./types";
import * as _ from "lodash";
import { Languages } from "ente-types";
import { Map } from "immutable";
import {
  ImportUsersSuccessPayload,
  FetchInstanceConfigSuccessPayload,
  SetLoginBannerSuccessPayload,
  LoginSuccessPayload
} from "./actions";
import { TimeScope } from "../time-scope";
import { ColorScheme } from "../theme";
import { getOwnUserId } from "./selectors";

const addResponse = (state: AppState, apiResponse: APIResponse) =>
  state
    .update("usersMap", users =>
      users.merge(
        Map<string, UserN>(
          apiResponse.users.map(
            user => [user.get("id"), user] as [string, UserN]
          )
        )
      )
    )
    .update("slotsMap", slots =>
      slots.merge(
        Map<string, SlotN>(
          apiResponse.slots.map(
            slot => [slot.get("id"), slot] as [string, SlotN]
          )
        )
      )
    )
    .update("entriesMap", entries =>
      entries.merge(
        Map<string, EntryN>(
          apiResponse.entries.map(
            entry => [entry.get("id"), entry] as [string, EntryN]
          )
        )
      )
    );

const addResponseUpdater = (
  state: AppState,
  action: Action<APIResponse>
): AppState => addResponse(state, action.payload!);

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
    state.update("pendingActions", pending => pending.add(action)),
  [error]: (state: AppState, action: ActionMeta<Error, Action<any>>) =>
    state.update("pendingActions", pending => pending.remove(action.meta))
});

const asyncReducersFullWithoutMetaPayload = (
  request: string,
  error: string,
  success: string,
  update: (state: AppState, action: Action<any>) => AppState = _.identity
) => ({
  [request]: (state: AppState, action: Action<void>) =>
    state.update("pendingActions", pending =>
      pending.add({ type: action.type })
    ),
  [error]: (state: AppState, action: ActionMeta<Error, Action<any>>) =>
    state.update("pendingActions", pending =>
      pending.filter(p => p.type !== action.meta.type)
    ),
  [success]: (
    state: AppState,
    action: ActionMeta<void, Action<any>>
  ): AppState =>
    update(
      state.update("pendingActions", pending =>
        pending.filter(p => p.type !== action.meta.type)
      ),
      action
    )
});

const asyncReducersFull = (
  request: string,
  error: string,
  success: string,
  update: (state: AppState, action: Action<any>) => AppState = _.identity
) => ({
  ...asyncReducers(request, error),
  [success]: (
    state: AppState,
    action: ActionMeta<void, Action<any>>
  ): AppState => {
    const withoutPending = state.update("pendingActions", pending =>
      pending.remove(action.meta)
    );
    const updated = update(withoutPending, action);
    return updated;
  }
});

export const initialState = new AppState({});

const reducer = handleActions<AppState | undefined, any>(
  {
    /**
     * # Auth
     */
    // ## GET_TOKEN
    ...asyncReducersFullWithoutMetaPayload(
      LOGIN_REQUEST,
      LOGIN_ERROR,
      LOGIN_SUCCESS,
      (state, action: Action<LoginSuccessPayload>) => {
        const { apiResponse, authState } = action.payload!;

        return addResponse(state.set("auth", authState), apiResponse);
      }
    ),

    // ## REFRESH_TOKEN
    ...asyncReducersFull(
      REFRESH_TOKEN_REQUEST,
      REFRESH_TOKEN_ERROR,
      REFRESH_TOKEN_SUCCESS,
      (state: AppState, action: Action<AuthState>) =>
        state.set("auth", action.payload!)
    ),

    // ## LOGOUT
    [LOGOUT]: (state?: AppState): AppState =>
      new AppState({
        pendingActions: state!.get("pendingActions"),
        colorScheme: state!.get("colorScheme")
      }),

    // ## SET_TIME_SCOPE
    [SET_TIME_SCOPE]: (
      state?: AppState,
      action?: Action<TimeScope>
    ): AppState => state!.set("timeScope", action!.payload!),

    // ## SET_COLOR_SCHEME
    [SET_COLOR_SCHEME]: (
      state?: AppState,
      action?: Action<ColorScheme>
    ): AppState => state!.set("colorScheme", action!.payload!),

    // ## RESET_PASSWORD
    ...asyncReducersFull(
      RESET_PASSWORD_REQUEST,
      RESET_PASSWORD_ERROR,
      RESET_PASSWORD_SUCCESS
    ),

    // ## IMPORT_USERS
    ...asyncReducersFull(
      IMPORT_USERS_REQUEST,
      IMPORT_USERS_ERROR,
      IMPORT_USERS_SUCCESS,
      (state: AppState, action: Action<ImportUsersSuccessPayload>) => {
        const { newState } = action.payload!;

        if (_.isUndefined(newState)) {
          return state;
        }

        const usersById = _.keyBy(newState.users, (u: UserN) => u.get("id"));
        const slotsById = _.keyBy(newState.slots, (s: SlotN) => s.get("id"));
        const entriesById = _.keyBy(newState.entries, (e: EntryN) =>
          e.get("id")
        );

        return state
          .set("entriesMap", Map(entriesById))
          .set("usersMap", Map(usersById))
          .set("slotsMap", Map(slotsById));
      }
    ),

    // ## SET_PASSWORD
    ...asyncReducersFullWithoutMetaPayload(
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
      SIGN_ENTRY_SUCCESS,
      addResponseUpdater
    ),

    // ## UNSIGN_ENTRY
    ...asyncReducersFull(
      UNSIGN_ENTRY_REQUEST,
      UNSIGN_ENTRY_ERROR,
      UNSIGN_ENTRY_SUCCESS,
      addResponseUpdater
    ),

    // ## DOWNLOAD_EXCEL_EXPORT
    ...asyncReducersFull(
      DOWNLOAD_EXCEL_EXPORT_REQUEST,
      DOWNLOAD_EXCEL_EXPORT_ERROR,
      DOWNLOAD_EXCEL_EXPORT_SUCCESS
    ),

    // ## DELETE_USER
    ...asyncReducersFull(
      DELETE_USER_REQUEST,
      DELETE_USER_ERROR,
      DELETE_USER_SUCCESS,
      (state: AppState, action: Action<string>) => {
        const userId = action.payload;

        const withoutUser = state.deleteIn(["usersMap", userId]);

        const entriesOfUser = state
          .get("entriesMap")
          .filter(e => e.get("studentId") === userId);

        return withoutEntries(
          ...entriesOfUser
            .map(m => m.get("id"))
            .valueSeq()
            .toArray()
        )(withoutUser);
      }
    ),

    // ## DELETE_ENTRY
    ...asyncReducersFull(
      DELETE_ENTRY_ERROR,
      DELETE_ENTRY_ERROR,
      DELETE_ENTRY_SUCCESS,
      (state, action) => withoutEntries(action.payload)(state)
    ),

    /**
     * # GET
     */
    // ## GET_ENTRIES
    ...asyncReducersFull(
      GET_ENTRIES_REQUEST,
      GET_ENTRIES_ERROR,
      GET_ENTRIES_SUCCESS,
      (state, action: Action<APIResponse>) => {
        const stateWithoutOldData = state
          .set("entriesMap", Map())
          .set("slotsMap", Map());

        return addResponse(stateWithoutOldData, action.payload!);
      }
    ),

    // ## GET_ENTRY
    ...asyncReducersFull(
      GET_ENTRY_REQUEST,
      GET_ENTRY_ERROR,
      GET_ENTRY_SUCCESS,
      addResponseUpdater
    ),

    // ## GET_SLOTS
    ...asyncReducersFull(
      GET_SLOTS_REQUEST,
      GET_SLOTS_ERROR,
      GET_SLOTS_SUCCESS,
      (state, action: Action<APIResponse>) => {
        const stateWithoutOldData = state.set("slotsMap", Map());

        return addResponse(stateWithoutOldData, action.payload!);
      }
    ),

    // ## GET_USER
    ...asyncReducersFull(
      GET_USER_REQUEST,
      GET_USER_ERROR,
      GET_USER_SUCCESS,
      addResponseUpdater
    ),

    // ## GET_USERS
    ...asyncReducersFull(
      GET_USERS_REQUEST,
      GET_USERS_ERROR,
      GET_USERS_SUCCESS,
      (state, action: Action<APIResponse>) => {
        const stateWithoutOldData = state.set("usersMap", Map());

        return addResponse(stateWithoutOldData, action.payload!);
      }
    ),

    /**
     * # CREATE
     */
    // ## CREATE_ENTRY
    ...asyncReducersFull(
      CREATE_ENTRY_REQUEST,
      CREATE_ENTRY_ERROR,
      CREATE_ENTRY_SUCCESS,
      addResponseUpdater
    ),

    // ## CREATE_USERS
    ...asyncReducersFull(
      CREATE_USERS_REQUEST,
      CREATE_USERS_ERROR,
      CREATE_USERS_SUCCESS,
      addResponseUpdater
    ),

    // ## FETCH_INSTANCE_CONFIG
    ...asyncReducersFull(
      FETCH_INSTANCE_CONFIG_REQUEST,
      FETCH_INSTANCE_CONFIG_ERROR,
      FETCH_INSTANCE_CONFIG_SUCCESS,
      (state: AppState, action: Action<FetchInstanceConfigSuccessPayload>) => {
        const { payload } = action;
        const {
          defaultLanguage,
          loginBanners,
          parentSignatureTimes
        } = payload!;
        const instanceConfigN = new InstanceConfigN({
          defaultLanguage,
          loginBanners: Map(loginBanners as any),
          parentSignatureTimes: ParentSignatureTimesN(parentSignatureTimes)
        });
        return state.set("instanceConfig", instanceConfigN);
      }
    ),

    // ## SET_DEFAULT_DEFAULT_LANGUAGE
    ...asyncReducersFull(
      SET_DEFAULT_DEFAULT_LANGUAGE_REQUEST,
      SET_DEFAULT_DEFAULT_LANGUAGE_ERROR,
      SET_DEFAULT_DEFAULT_LANGUAGE_SUCCESS,
      (state: AppState, action: Action<Languages>) => {
        const { payload } = action;
        return state.setIn(["instanceConfig", "defaultLanguage"], payload);
      }
    ),

    // ## SET_PARENT_SIGNATURE_EXPIRY_TIME
    ...asyncReducersFull(
      SET_PARENT_SIGNATURE_EXPIRY_TIME_REQUEST,
      SET_PARENT_SIGNATURE_EXPIRY_TIME_ERROR,
      SET_PARENT_SIGNATURE_EXPIRY_TIME_SUCCESS,
      (state: AppState, action: Action<number>) => {
        const { payload } = action;
        return state.setIn(
          ["instanceConfig", "parentSignatureTimes", "expiry"],
          payload
        );
      }
    ),

    // ## SET_PARENT_SIGNATURE_NOTIFICATION_TIME
    ...asyncReducersFull(
      SET_PARENT_SIGNATURE_NOTIFICATION_TIME_REQUEST,
      SET_PARENT_SIGNATURE_NOTIFICATION_TIME_ERROR,
      SET_PARENT_SIGNATURE_NOTIFICATION_TIME_SUCCESS,
      (state: AppState, action: Action<number>) => {
        const { payload } = action;
        return state.setIn(
          ["instanceConfig", "parentSignatureTimes", "notification"],
          payload
        );
      }
    ),

    // ## SET_LOGIN_BANNER
    ...asyncReducersFull(
      SET_LOGIN_BANNER_REQUEST,
      SET_LOGIN_BANNER_ERROR,
      SET_LOGIN_BANNER_SUCCESS,
      (state: AppState, action: Action<SetLoginBannerSuccessPayload>) => {
        const { language, text } = action.payload!;
        return state.setIn(["instanceConfig", "loginBanners", language], text);
      }
    ),

    /**
     * # UPDATE
     */
    // ## UPDATE_USERS
    ...asyncReducersFull(
      UPDATE_USER_REQUEST,
      UPDATE_USER_ERROR,
      UPDATE_USER_SUCCESS,
      addResponseUpdater
    ),

    [SET_LANGUAGE]: (
      state: AppState | undefined,
      action: Action<Languages>
    ) => {
      const ownId = getOwnUserId(state!);

      return state!.setIn(["usersMap", ownId, "language"], action.payload);
    }
  },
  initialState
);

export default reducer;
