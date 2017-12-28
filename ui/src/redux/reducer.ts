import { handleActions, Action } from 'redux-actions';
import { Entry, AppState, MongoId, User, AuthState } from '../interfaces/index';
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
  LOGOUT
} from './constants';

const initialState = new AppState({});

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
    .set('auth', action.payload)
    .update('users', (map: Map<MongoId, User>) => map.merge(
      Map<MongoId, User>(action.payload!.get('children').map(child => ([child.get('_id'), child])))
    )),
  
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
    .update('loading', loading => loading - 1)
    .update('entries', (map: Map<MongoId, Entry>) => map.withMutations(
      mutator => action.payload!.forEach(
        entry => mutator.set(entry.get('_id'), entry)
      )
    )),
  
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
    .update('entries', map => map.set(action.payload!.get('_id'), action.payload)),

  /**
   * GET_USERS
   */
  [GET_USERS_REQUEST]: state => state
    .update('loading', loading => loading + 1),
  [GET_USERS_ERROR]: (state, action) => state
    .update('loading', loading => loading - 1)
    .update('errors', errors => errors.push(action.payload)),
  [GET_USERS_SUCCESS]: (state, action) => state
    .update('loading', loading => loading - 1)
    .update('users', (map: Map<MongoId, User>) => map.withMutations(
      mutator => action.payload!.forEach(
        user => mutator.set(user.get('_id'), user)
      )
    )),

  /**
   * GET_USER
   */
  [GET_USER_REQUEST]: state => state
    .update('loading', loading => loading + 1),
  [GET_USER_ERROR]: (state, action) => state
    .update('loading', loading => loading - 1)
    .update('errors', errors => errors.push(action.payload)),
  [GET_USER_SUCCESS]: (state, action: Action<User>) => state
    .update('loading', loading => loading - 1)
    .update('users', map => map.set(action.payload!.get('_id'), action.payload)),
  
}, initialState); // tslint:disable-line:align

export default reducer;
