import { AppState } from '../interfaces/index';

export const getEntries = (state: AppState) => state.get('entries').toArray();
export const getUsers = (state: AppState) => state.get('users').toArray();
export const getSlots = (state: AppState) => state.get('slots').toArray();
export const isLoading = (state: AppState): boolean => state.get('loading') > 0;
