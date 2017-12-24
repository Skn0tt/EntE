import { Map } from 'immutable';
import { AppState } from './reducer';

export const getEntries = (state: Map<String, AppState>) => state.get('entries').toArray();
export const getUsers = (state: Map<String, AppState>) => state.get('users').toArray();
export const getSlots = (state: Map<String, AppState>) => state.get('slots').toArray();
