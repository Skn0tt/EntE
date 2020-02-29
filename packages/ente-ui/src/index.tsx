/**
 * EntE
 * (c) 2017-present, Simon Knott <info@simonknott.de>
 *
 * This source code is licensed under the GNU Affero General Public License
 * found in the LICENSE file in the root directory of this source tree.
 */

import "reflect-metadata";
import * as React from "react";
import * as ReactDOM from "react-dom";
import App from "./App";
import CssBaseline from "@material-ui/core/CssBaseline";
import { get as getConfig } from "./config";
import { install as installMuiStyles } from "@material-ui/styles";

// Fonts
import "typeface-roboto";
import setupRedux, {
  ReduxConfig,
  AppState,
  updateConfig,
  getLanguage
} from "./redux";
import { Provider } from "react-redux";
import * as Sentry from "@sentry/browser";
import { HttpsGate } from "./components/HttpsGate";
import { isSentryDsn } from "./helpers/isSentryDsn";
import { createSentryMiddleware } from "./sentry.middleware";
import { ErrorReporting } from "./ErrorReporting";
import { MessagesProvider } from "./context/Messages";
import { StoreContext } from "./helpers/store-context";
import { Store } from "redux";
import { DEFAULT_DEFAULT_LANGUAGE } from "ente-types";
import { getSagaListeners } from "./saga-listeners";
import ConnectedCombinedThemeProvider from "./components/ConnectedCombinedThemeProvider";
import { LocalizedMUIPickersUtilsProvider } from "./components/LocalizedMUIPickersUtilsProvider";

installMuiStyles();

const baseUrl = `${location.protocol}//${location.hostname}`;

const config: Partial<ReduxConfig> = {
  baseUrl: `${baseUrl}/api`,
  onFileDownload: (file, filename) => {
    const url = window.URL.createObjectURL(file);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
  },
  middlewares: []
};

const { SENTRY_DSN, ALLOW_INSECURE, VERSION } = getConfig();

const setupSentry = (dsn: string) => {
  if (!isSentryDsn(dsn)) {
    console.error("Invalid Sentry DSN passed.");
    return;
  }

  const sentryConfig: Sentry.BrowserOptions = {
    dsn,
    release: VERSION
  };

  Sentry.init(sentryConfig);
  const sentryClient = new Sentry.BrowserClient(sentryConfig);

  ErrorReporting.supplySentryClient(sentryClient);

  const sentryMiddleware = createSentryMiddleware(sentryClient);

  config.middlewares!.push(sentryMiddleware);
  config.onSagaError = ErrorReporting.report;
};

if (!!SENTRY_DSN) {
  setupSentry(SENTRY_DSN);
}

const setupSagaListeners = (store: Store<AppState>) => {
  const getLanguageOfStore = () => {
    return getLanguage(store.getState()).orSome(DEFAULT_DEFAULT_LANGUAGE);
  };
  const sagaListeners = getSagaListeners(getLanguageOfStore);
  updateConfig(sagaListeners);
};

const bootstrap = async () => {
  const store = await setupRedux(config);

  setupSagaListeners(store);

  const Index = () => (
    <div>
      <React.StrictMode>
        <CssBaseline />
        <StoreContext.Provider value={store}>
          <Provider store={store}>
            <ConnectedCombinedThemeProvider>
              <LocalizedMUIPickersUtilsProvider>
                <HttpsGate disable={ALLOW_INSECURE}>
                  <MessagesProvider>
                    <App />
                  </MessagesProvider>
                </HttpsGate>
              </LocalizedMUIPickersUtilsProvider>
            </ConnectedCombinedThemeProvider>
          </Provider>
        </StoreContext.Provider>
      </React.StrictMode>
    </div>
  );

  ReactDOM.render(<Index />, document.getElementById("root"));
};

bootstrap();
