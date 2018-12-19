import { Map, fromJS } from "immutable";
import { AppState } from "../types";

export function stateReconciler(
  state: AppState,
  inboundState: AppState | null,
  reducedState: AppState,
  logger: any
) {
  if (inboundState === null) {
    return reducedState;
  }

  const inboundStateImmutable = fromJS(inboundState);

  if (!reducedState) {
    return inboundStateImmutable;
  }

  return reducedState.merge(inboundStateImmutable);
}
