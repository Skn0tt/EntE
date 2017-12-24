import { createStore, applyMiddleware } from 'redux';
import reducer from './reducer';
import { composeWithDevTools } from 'redux-devtools-extension';
import createSagaMiddleware from 'redux-saga';

import mySaga from './saga';

const sagaMiddleware = createSagaMiddleware();

const composeEnhancers = composeWithDevTools({});
const store = createStore(reducer, composeEnhancers(
  applyMiddleware(sagaMiddleware),
));

sagaMiddleware.run(mySaga);

export default store;
