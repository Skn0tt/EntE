import { isImmutable } from "immutable";

export function _stateIterator(state, callback) {
  return state.toSeq().forEach((item, key) => callback(item, key));
}

export function _stateGetter(state, key) {
  return isImmutable(state) ? state.get(key) : state[key];
}

export function _stateSetter(state, key, value) {
  return state.set(key, value);
}
