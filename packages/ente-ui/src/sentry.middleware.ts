import { Middleware } from "redux";
import * as Sentry from "@sentry/browser";
import * as selectors from "./redux/selectors";
import {
  GET_TOKEN_REQUEST,
  GET_TOKEN_SUCCESS,
  REFRESH_TOKEN_SUCCESS
} from "./redux";

enum SentryBreadcrumbCategories {
  REDUX_ACTION = "redux-action"
}

const IGNORED_ACTION_TYPES = [
  GET_TOKEN_REQUEST,
  GET_TOKEN_SUCCESS,
  REFRESH_TOKEN_SUCCESS
];

export const createSentryMiddleware = (
  sentryClient: Sentry.BrowserClient
): Middleware => store => next => action => {
  Sentry.withScope(scope => {
    const username = selectors
      .getUsername(store.getState())
      .orSome("NOT_LOGGED_IN");
    scope.setUser({ username });

    if (!IGNORED_ACTION_TYPES.includes(action.type)) {
      sentryClient.addBreadcrumb(
        {
          category: SentryBreadcrumbCategories.REDUX_ACTION,
          data: action
        },
        {},
        scope
      );
    }

    try {
      return next(action);
    } catch (err) {
      if (IGNORED_ACTION_TYPES.includes(action.type)) {
        return;
      }

      console.error("Caught an exception!", err);
      sentryClient.captureException(err, {}, scope);
    }
  });
};
