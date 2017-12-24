import { Map } from 'immutable';
import { AppState } from './reducer';

export const getEntries = (state: Map<String, AppState>) => state.get('entries').toList();
export const getUsers = (state: Map<String, AppState>) => state.get('users').toList();
export const getSlots = (state: Map<String, AppState>) => state.get('slots').toList();
