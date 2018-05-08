import * as cookie from "js-cookie";

type Config = {
  SENTRY_DSN_UI?: string;
};

let config: Config | null = null;

const CONFIG_COOKIE = "_config";

const readConfig = () => {
  const c = cookie.getJSON(CONFIG_COOKIE);

  config = c as Config;
};

export const get = () => {
  if (!config) {
    readConfig();
  }

  return config!;
};
