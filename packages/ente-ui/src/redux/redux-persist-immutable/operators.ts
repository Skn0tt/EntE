// tslint:disable:function-name

import { isImmutable } from "immutable";
import { AppState, IAppState } from "../types";

export function _stateIterator(
  state: AppState,
  callback: (item: any, key: string) => void
) {
  return state.toSeq().forEach((item, key) => callback(item, key));
}

export function _stateGetter(state: AppState | any, key: keyof IAppState) {
  return isImmutable(state) ? state.get(key) : state[key];
}

export function _stateSetter(
  state: AppState,
  key: keyof IAppState,
  value: any
) {
  return state.set(key, value);
}
