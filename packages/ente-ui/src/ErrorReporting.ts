import * as Sentry from "@sentry/browser";
import { None, Maybe, Some } from "monet";

let client: Maybe<Sentry.BrowserClient> = None();

const report = (error: any) => {
  if (client.isSome()) {
    client.some().captureException(error);
  }
};

const supplySentryClient = (c: Sentry.BrowserClient) => {
  client = Some(c);
};

const isActive = () => client.isSome();

const showReportDialog = () => {
  if (client.isSome()) {
    client.some().showReportDialog();
  }
};

export const ErrorReporting = {
  report,
  supplySentryClient,
  isActive,
  showReportDialog
};
