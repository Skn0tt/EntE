import { createStore } from "./store";
import { Middleware } from "redux";

export * from "./selectors";
export * from "./actions";
export * from "./types";
export * from "./constants";

type Config = {
  baseUrl: string;
  middlewares?: Middleware[];
  onSagaError?: (err: Error) => void;
};

export let config: Config = {
  baseUrl: "",
  middlewares: []
};

const setup = (conf: Config) => {
  config = conf;

  return createStore();
};

export default setup;
