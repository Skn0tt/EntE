/**
 * EntE
 * (c) 2017-present, Simon Knott <info@simonknott.de>
 *
 * This source code is licensed under the GNU Affero General Public License
 * found in the LICENSE file in the root directory of this source tree.
 */

import { createStore as reduxCreateStore, applyMiddleware, Store } from "redux";
import reducer, { initialState } from "./reducer";
import { composeWithDevTools } from "redux-devtools-extension";
import reduxSaga from "redux-saga";
import {
  autoRehydrate,
  persistStore,
  createTransform
} from "./redux-persist-immutable";
import saga from "./saga";
import { AppState, IAppState, UserN, SlotN, AuthState, EntryN } from "./types";
import * as _ from "lodash";
import { getConfig } from "./config";

const keysToRemove: (keyof IAppState)[] = ["pendingActions"];
const removeUnneededTransform = createTransform(
  (inboundState: AppState, key: string) =>
    keysToRemove.indexOf(key as keyof IAppState) !== -1
      ? initialState.get(key as keyof IAppState)
      : inboundState,
  _.identity
);

const startPersistance = (store: Store) => {
  let persistor: any;
  return new Promise((resolve, reject) => {
    persistor = persistStore(
      store,
      {
        storage: getConfig().storage,
        transforms: [removeUnneededTransform],
        records: [UserN, SlotN, AuthState, AppState, EntryN]
      },
      () => resolve(persistor)
    );
  });
};

let store: Store | null = null;
let persistor: any;

export const createStore = async () => {
  const sagaMiddleware = reduxSaga({
    onError: getConfig().onSagaError
  });
  const composeEnhancers = composeWithDevTools({});

  const middlewares = getConfig().middlewares || [];

  store = reduxCreateStore(
    reducer as any,
    composeEnhancers(
      applyMiddleware(sagaMiddleware, ...middlewares),
      autoRehydrate()
    )
  );

  sagaMiddleware.run(saga);

  persistor = await startPersistance(store);

  return store;
};

export default (store as unknown) as Store;
