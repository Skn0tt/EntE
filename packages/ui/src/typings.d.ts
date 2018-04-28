declare module "material-ui-pickers";
declare module "raven-for-redux";
declare module "react-loadable";
declare module "raven-js";

interface Config {
  SENTRY_DSN_API?: string;
}

interface Window {
  __env?: Config;
}
