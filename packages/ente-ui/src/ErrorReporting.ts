import * as config from "./config";
import Raven from "raven-js";

const sentryIsEnabled = !!config.get().SENTRY_DSN;

const report = (error: any) => {
  if (sentryIsEnabled) {
    Raven.captureException(error);
  }
};

export const ErrorReporting = {
  report
};
