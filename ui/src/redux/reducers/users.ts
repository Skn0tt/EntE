import { User, MongoId } from '../../interfaces/index';
import { handleActions } from 'redux-actions';
import { Map } from 'immutable';

export type UsersState = Map<MongoId, User>;

const initialState: UsersState = Map();

const reducer = handleActions<UsersState>({
}, initialState // tslint:disable-line:align
);

export default reducer;