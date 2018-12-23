import { Middleware } from "redux";
import { Languages } from "ente-types";
import { asyncLocalStorage } from "redux-persist/storages";

export type ReduxConfig = {
  baseUrl: string;
  middlewares?: Middleware[];
  onSagaError?: (err: Error) => void;
  onFileDownload: (file: Blob, filename: string) => void;
  storage: any;
  defaultLanguage: Languages;
};

const defaultConfig: ReduxConfig = {
  storage: asyncLocalStorage,
  baseUrl: "",
  middlewares: [],
  onFileDownload: () => {},
  defaultLanguage: Languages.ENGLISH
};

let config: ReduxConfig = defaultConfig;

export const updateConfig = (v: Partial<ReduxConfig>) => {
  config = { ...config, ...v };
};

export const getConfig = () => config;
