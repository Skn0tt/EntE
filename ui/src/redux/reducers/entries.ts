import { handleActions, createAction, Action } from 'redux-actions';
import { Map } from 'immutable';
import { Entry } from '../../interfaces/index';
import {
  CREATE_ENTRY_REQUEST,
  CREATE_ENTRY_SUCCESS,
  GET_ENTRY_REQUEST,
  GET_ENTRIES_REQUEST,
  GET_ENTRIES_SUCCESS,
  GET_ENTRIES_ERROR,
  GET_ENTRY_SUCCESS,
  GET_ENTRY_ERROR,
  errorPayload
} from '../constants';

export type EntriesState = Map<String, Entry>;

const initialState: EntriesState = Map();

type createEntryRequestPayload = Entry;
type createEntrySuccessPayload = Entry;
type getEntryRequestPayload = String;
type getEntrySuccessPayload = Entry;

export const createEntryRequest = createAction<Entry>(CREATE_ENTRY_REQUEST);
export const createEntrySuccess = createAction<Entry>(CREATE_ENTRY_SUCCESS);
export const createEntryError = createAction<Entry>(CREATE_ENTRY_SUCCESS);

export const getEntriesRequest = createAction<String>(GET_ENTRIES_REQUEST);
export const getEntriesSuccess = createAction<String>(GET_ENTRIES_SUCCESS);
export const getEntriesError = createAction<String>(GET_ENTRIES_ERROR);

export const getEntryRequest = createAction<String>(GET_ENTRY_REQUEST);
export const getEntrySuccess = createAction<String>(GET_ENTRY_SUCCESS);
export const getEntryError = createAction<String>(GET_ENTRY_ERROR);

const reducer = handleActions<EntriesState>({
  [GET_ENTRY_REQUEST]: (state, action: Action<getEntryRequestPayload>): EntriesState => state,
  [GET_ENTRY_SUCCESS]: (state, action: Action<getEntrySuccessPayload>): EntriesState => state.set(action.payload.),
  [GET_ENTRY_ERROR]: (state, action: Action<errorPayload>): EntriesState => state,
}, initialState // tslint:disable-line:align
);

export default reducer;