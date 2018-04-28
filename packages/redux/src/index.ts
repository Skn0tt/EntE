import { createStore } from "./store";
import { Middleware } from "redux";

export * from "./selectors";
export * from "./actions";
export * from "./types";
export * from "./constants";

export type ReduxConfig = {
  baseUrl: string;
  middlewares?: Middleware[];
  onSagaError?: (err: Error) => void;
};

export let config: ReduxConfig = {
  baseUrl: "",
  middlewares: []
};

const setup = (conf: ReduxConfig) => {
  config = conf;

  return createStore();
};

export default setup;
