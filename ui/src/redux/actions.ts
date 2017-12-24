import { createAction } from 'redux-actions';

import {
  CREATE_ENTRY_REQUEST,
  CREATE_ENTRY_SUCCESS,
  CREATE_ENTRY_ERROR,
  GET_ENTRIES_REQUEST,
  GET_ENTRIES_SUCCESS,
  GET_ENTRIES_ERROR,
  GET_ENTRY_REQUEST,
  GET_ENTRY_SUCCESS,
  GET_ENTRY_ERROR
} from './constants';
import { Entry, MongoId } from '../interfaces/index';

export const createEntryRequest = createAction<Entry>(CREATE_ENTRY_REQUEST);
export const createEntrySuccess = createAction<Entry>(CREATE_ENTRY_SUCCESS);
export const createEntryError = createAction<Error>(CREATE_ENTRY_ERROR);

export const getEntriesRequest = createAction<null>(GET_ENTRIES_REQUEST);
export const getEntriesSuccess = createAction<Entry[]>(GET_ENTRIES_SUCCESS);
export const getEntriesError = createAction<Error>(GET_ENTRIES_ERROR);

export const getEntryRequest = createAction<MongoId>(GET_ENTRY_REQUEST);
export const getEntrySuccess = createAction<Entry>(GET_ENTRY_SUCCESS);
export const getEntryError = createAction<Error>(GET_ENTRY_ERROR);
