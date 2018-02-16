import { createStore, applyMiddleware } from 'redux';
import reducer from './reducer';
import { composeWithDevTools } from 'redux-devtools-extension';
import reduxSaga from 'redux-saga';
import * as Raven from 'raven-js';
import ravenForRedux from 'raven-for-redux';

import saga from './saga';
import { AppState, AuthState } from '../interfaces/index';
import * as select from './selectors';
import { CHECK_AUTH_SUCCESS } from './constants';
import { Action } from 'redux-actions';

const sagaMiddleware = reduxSaga({
  onError: error => Raven.captureException(error),
});
const composeEnhancers = composeWithDevTools({});
const ravenMiddleWare = ravenForRedux(Raven, {
  actionTransformer: (action: Action<AuthState | {}>) => {
    if (action.type === CHECK_AUTH_SUCCESS) {
      return {
        payload: (action.payload as AuthState).delete('password'),
        ...action,
      };
    }
    return action;
  },
  stateTransformer: (state: AppState) => state.get('auth').delete('password'),
  getUserContext: (state: AppState) => ({ username: select.getUsername(state) }),
});

const store = createStore(
  reducer,
  composeEnhancers(applyMiddleware(sagaMiddleware, ravenMiddleWare)),
);

sagaMiddleware.run(saga);

export default store;
