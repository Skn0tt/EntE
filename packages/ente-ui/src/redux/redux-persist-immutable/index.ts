import {
  autoRehydrate as baseAutoRehydrate,
  createPersistor as baseCreatePersistor,
  createTransform,
  getStoredState as baseGetStoredState,
  persistStore as basePersistStore,
  purgeStoredState
} from "redux-persist";

import immutableTransform from "redux-persist-transform-immutable";
import * as operators from "./operators";
import { stateReconciler } from "./reconciler";

const extendConfig = (config: any) => {
  const incomingTransforms = config.transforms || [];
  const records = config.records || null;
  let transforms = incomingTransforms;
  if (!config.skipImmutableTransform) {
    transforms = [...incomingTransforms, immutableTransform({ records })];
  }
  return { stateReconciler, ...config, ...operators, transforms };
};

const autoRehydrate = (config = {}, ...args) => {
  return baseAutoRehydrate(extendConfig(config), ...args);
};

const createPersistor = (store, config = {}, ...args) => {
  return baseCreatePersistor(store, extendConfig(config), ...args);
};

const persistStore = (store, config = {}, ...args) => {
  return basePersistStore(store, extendConfig(config), ...args);
};

const getStoredState = (config = {}, ...args) => {
  return baseGetStoredState(extendConfig(config), ...args);
};

export {
  autoRehydrate,
  createPersistor,
  createTransform,
  getStoredState,
  persistStore,
  purgeStoredState
};
