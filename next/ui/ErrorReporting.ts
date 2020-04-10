import * as Sentry from "@sentry/browser";
import { None, Maybe, Some } from "monet";

let client: Maybe<Sentry.BrowserClient> = None();

type EventId = string;

const report = async (error: any): Promise<Maybe<EventId>> => {
  return await client.cata(
    async () => None<string>(),
    async client => {
      const event_id = client.captureException(error);
      return Maybe.fromUndefined(event_id);
    }
  );
};

const supplySentryClient = (c: Sentry.BrowserClient) => {
  client = Some(c);
};

const isActive = () => client.isSome();

const showReportDialog = (eventId: string) =>
  client.forEach(c => c.showReportDialog({ eventId }));

export const ErrorReporting = {
  report,
  supplySentryClient,
  isActive,
  showReportDialog
};
