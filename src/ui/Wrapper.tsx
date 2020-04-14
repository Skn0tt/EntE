/**
 * EntE
 * (c) 2017-present, Simon Knott <info@simonknott.de>
 *
 * This source code is licensed under the GNU Affero General Public License
 * found in the LICENSE file in the root directory of this source tree.
 */

import * as React from "react";
import CssBaseline from "@material-ui/core/CssBaseline";
import { get as getConfig } from "./config";
import { install as installMuiStyles } from "@material-ui/styles";

// Fonts

import setupRedux, {
  ReduxConfig,
  AppState,
  updateConfig,
  getLanguage,
} from "./redux";
import { Provider } from "react-redux";
import * as Sentry from "@sentry/browser";
import { isSentryDsn } from "./helpers/isSentryDsn";
import { createSentryMiddleware } from "./sentry.middleware";
import { ErrorReporting } from "./ErrorReporting";
import { MessagesProvider } from "./context/Messages";
import { StoreContext } from "./helpers/store-context";
import { Store } from "redux";
import { getSagaListeners } from "./saga-listeners";
import ConnectedCombinedThemeProvider from "./components/ConnectedCombinedThemeProvider";
import { LocalizedMUIPickersUtilsProvider } from "./components/LocalizedMUIPickersUtilsProvider";
import { DEFAULT_DEFAULT_LANGUAGE } from "@@types";
import MessageStream from "./components/MessageStream";
import AuthService from "./AuthService";
import InstanceConfigGate from "./components/InstanceConfigGate";

installMuiStyles();

const config: Partial<ReduxConfig> = {
  onFileDownload: (file, filename) => {
    const url = window.URL.createObjectURL(file);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
  },
  middlewares: [],
};

const { SENTRY_DSN, VERSION, ROTATION_PERIOD } = getConfig();

const setupSentry = (dsn: string) => {
  if (!isSentryDsn(dsn)) {
    console.error("Invalid Sentry DSN passed.");
    return;
  }

  const sentryConfig: Sentry.BrowserOptions = {
    dsn,
    release: VERSION,
  };

  Sentry.init(sentryConfig);
  const sentryClient = new Sentry.BrowserClient(sentryConfig);

  ErrorReporting.supplySentryClient(sentryClient);

  const sentryMiddleware = createSentryMiddleware(sentryClient);

  config.middlewares!.push(sentryMiddleware);
  config.onSagaError = ErrorReporting.report;
};

if (false && !!SENTRY_DSN) {
  // TODO: enable sentr yagain
  setupSentry(SENTRY_DSN!);
}

const setupSagaListeners = (store: Store<AppState>) => {
  const getLanguageOfStore = () => {
    return getLanguage(store.getState()).orSome(DEFAULT_DEFAULT_LANGUAGE);
  };
  const sagaListeners = getSagaListeners(getLanguageOfStore);
  updateConfig(sagaListeners);
};

export function Wrapper(props: React.PropsWithChildren<{}>) {
  const store = React.useMemo(() => {
    const store = setupRedux(config);
    setupSagaListeners(store);
    return store;
  }, []);

  return (
    <StoreContext.Provider value={store}>
      <Provider store={store}>
        <ConnectedCombinedThemeProvider>
          <LocalizedMUIPickersUtilsProvider>
            <InstanceConfigGate>
              <MessagesProvider>
                <CssBaseline />
                <MessageStream />
                <AuthService period={ROTATION_PERIOD} />

                {props.children}
              </MessagesProvider>
            </InstanceConfigGate>
          </LocalizedMUIPickersUtilsProvider>
        </ConnectedCombinedThemeProvider>
      </Provider>
    </StoreContext.Provider>
  );
}
