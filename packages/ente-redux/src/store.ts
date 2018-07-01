/**
 * EntE
 * (c) 2017-present, Simon Knott <info@simonknott.de>
 *
 * This source code is licensed under the GNU Affero General Public License
 * found in the LICENSE file in the root directory of this source tree.
 */

import { createStore as reduxCreateStore, applyMiddleware } from "redux";
import reducer from "./reducer";
import { composeWithDevTools } from "redux-devtools-extension";
import reduxSaga from "redux-saga";

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

  const middlewares = config.middlewares || [];

  store = reduxCreateStore(
    reducer,
    composeEnhancers(applyMiddleware(sagaMiddleware, ...middlewares))
  );

  sagaMiddleware.run(saga);

  return store;
};

export default store;
