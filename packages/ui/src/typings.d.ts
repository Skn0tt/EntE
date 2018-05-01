declare module "material-ui-pickers";
declare module "raven-for-redux";
declare module "react-loadable";
declare module "raven-js";
declare module "react-router-enzyme-context";

interface Config {
  SENTRY_DSN_API?: string;
}

interface Window {
  __env?: Config;
}
