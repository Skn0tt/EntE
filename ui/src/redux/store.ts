import { createStore, combineReducers } from 'redux';

import entriesReducer, { EntriesState } from './reducers/entries';
import usersReducer, { UsersState } from './reducers/users';
import slotsReducer, { SlotsState } from './reducers/slots';

type AppState = {
  entries: EntriesState;
  users: UsersState;
  slots: SlotsState;
};

const reducer = combineReducers<AppState>({
  entries: entriesReducer,
  slots: slotsReducer,
  users: usersReducer,
});

const store = createStore(reducer);
export default store;