import { Map } from 'immutable';

export const getEntries = (state: Map<String, any>) => state.get('entries');
