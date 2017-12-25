import { handleActions, Action } from 'redux-actions';
import { Entry, AppState } from '../interfaces/index';
import {
  GET_ENTRIES_REQUEST,
  GET_ENTRIES_SUCCESS,
  GET_ENTRIES_ERROR,
  GET_ENTRY_REQUEST,
  GET_ENTRY_ERROR,
  GET_ENTRY_SUCCESS
} from './constants';

const initialState = new AppState({});

const reducer = handleActions({
  /**
   * GET_ENTRIES
   */
  [GET_ENTRIES_REQUEST]: state => state
    .update('loading', loading => loading + 1),
  [GET_ENTRIES_ERROR]: state => state
    .update('loading', loading => loading - 1),
  [GET_ENTRIES_SUCCESS]: (state, action) => state
    .update('loading', loading => loading - 1)
    .update('entries', map => map.merge(action.payload)),
  
  /**
   * GET_ENTRY
   */
  [GET_ENTRY_REQUEST]: state => state
    .update('loading', loading => loading + 1),
  [GET_ENTRY_ERROR]: state => state
    .update('loading', loading => loading - 1),
  [GET_ENTRY_SUCCESS]: (state, action: Action<Entry>) => state
    .update('loading', loading => loading - 1)
    .update('entries', map => map.set(action.payload!.get('_id'), action.payload)),
  
}, initialState); // tslint:disable-line:align

export default reducer;
