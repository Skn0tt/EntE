import { createStore } from 'redux';
import { combineReducers } from 'redux-immutable';
import { Map, Record } from 'immutable';

import entriesReducer from './reducers/entries';
import usersReducer from './reducers/users';
import slotsReducer from './reducers/slots';

/*
type AppState = {
  entries: EntriesState;
  users: UsersState;
  slots: SlotsState;
};
*/

const initialState = Record({
  entries: Map(),
  users: Map(),
  slots: Map(),
});

const reducer = combineReducers({
  entries: entriesReducer,
  slots: slotsReducer,
  users: usersReducer,
}, initialState); // tslint:disable-line:align

const store = createStore(reducer);
export default store;
