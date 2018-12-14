import { Map, fromJS } from "immutable";

export function stateReconciler(state, inboundState, reducedState, logger) {
  if (inboundState === null) {
    return reducedState;
  }

  const newState = reducedState ? reducedState : Map();
  const inboundStateImmutable = fromJS(inboundState);

  return newState.merge(inboundStateImmutable);
}
