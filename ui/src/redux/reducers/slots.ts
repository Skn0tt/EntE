import { Slot, MongoId } from '../../interfaces/index';
import { handleActions } from 'redux-actions';
import { Map } from 'immutable';

export type SlotsState = Map<MongoId, Slot>;

const initialState: SlotsState = Map();

const reducer = handleActions<SlotsState>({
}, initialState // tslint:disable-line:align
);

export default reducer;