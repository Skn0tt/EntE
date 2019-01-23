import { Middleware } from "redux";
import { asyncLocalStorage } from "redux-persist/storages";

export type ReduxConfig = {
  baseUrl: string;
  middlewares?: Middleware[];
  onSagaError?: (err: Error) => void;
  onFileDownload: (file: Blob, filename: string) => void;
  storage: any;
};

const defaultConfig: ReduxConfig = {
  storage: asyncLocalStorage,
  baseUrl: "",
  middlewares: [],
  onFileDownload: () => {}
};

let config: ReduxConfig = defaultConfig;

export const updateConfig = (v: Partial<ReduxConfig>) => {
  config = { ...config, ...v };
};

export const getConfig = () => config;
