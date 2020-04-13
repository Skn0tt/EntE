import {
  autoRehydrate as baseAutoRehydrate,
  createPersistor as baseCreatePersistor,
  createTransform,
  getStoredState as baseGetStoredState,
  persistStore as basePersistStore,
  purgeStoredState,
} from "redux-persist";

import immutableTransform from "redux-persist-transform-immutable";
import * as operators from "./operators";
import { stateReconciler } from "./reconciler";
import { Store } from "redux";

const extendConfig = (config: any) => {
  const incomingTransforms = config.transforms || [];
  const records = config.records || null;
  let transforms = incomingTransforms;
  if (!config.skipImmutableTransform) {
    transforms = [...incomingTransforms, immutableTransform({ records })];
  }
  return { stateReconciler, ...config, ...operators, transforms };
};

const autoRehydrate = (config = {}) => {
  return baseAutoRehydrate(extendConfig(config));
};

const createPersistor = (store: Store, config = {}) => {
  return baseCreatePersistor(store, extendConfig(config));
};

const persistStore = (store: Store, config = {}, cb: any) => {
  return basePersistStore(store, extendConfig(config), cb);
};

const getStoredState = (config = {}) => {
  return baseGetStoredState(extendConfig(config));
};

export {
  autoRehydrate,
  createPersistor,
  createTransform,
  getStoredState,
  persistStore,
  purgeStoredState,
};
