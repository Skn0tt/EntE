import { createStore as reduxCreateStore, applyMiddleware } from "redux";
import reducer from "./reducer";
import { composeWithDevTools } from "redux-devtools-extension";
import reduxSaga from "redux-saga";
import * as Raven from "raven-js";

import saga from "./saga";
import * as select from "./selectors";
import { GET_TOKEN_REQUEST } from "./constants";
import { Action } from "redux-actions";
import { AuthState, AppState } from "./types";
import { config } from "./";

let store;

export const createStore = () => {
  const sagaMiddleware = reduxSaga({
    onError: config.onSagaError
  });
  const composeEnhancers = composeWithDevTools({});

  store = reduxCreateStore(
    reducer,
    composeEnhancers(applyMiddleware(sagaMiddleware, ...config.middlewares))
  );

  sagaMiddleware.run(saga);

  return store;
};

export default store;
