/**
 * EntE
 * (c) 2017-present, Simon Knott <info@simonknott.de>
 *
 * This source code is licensed under the GNU Affero General Public License
 * found in the LICENSE file in the root directory of this source tree.
 */

import * as React from "react";
import CssBaseline from "@material-ui/core/CssBaseline";
import * as config from "./config";

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
import ConnectedThemeProvider from "./components/ConnectedThemeProvider";
import { LocalizedMUIPickersUtilsProvider } from "./components/LocalizedMUIPickersUtilsProvider";
import { DEFAULT_DEFAULT_LANGUAGE } from "@@types";
import MessageStream from "./components/MessageStream";
import AuthService from "./AuthService";
import InstanceConfigGate from "./components/InstanceConfigGate";
import { DrawerStateProvider } from "./components/Drawer";
import { useEffectOnce } from "react-use";

const reduxConfig: Partial<ReduxConfig> = {
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

const { SENTRY_DSN, VERSION } = config.get();

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

  reduxConfig.middlewares!.push(sentryMiddleware);
  reduxConfig.onSagaError = ErrorReporting.report;
};

if (false && !!SENTRY_DSN) {
  // TODO: enable sentry again
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
  const [store, setStore] = React.useState<Store>();
  useEffectOnce(() => {
    setupRedux(reduxConfig).then((store) => {
      setupSagaListeners(store);
      setStore(store);
    });
  });

  if (!store) {
    return null;
  }

  return (
    <StoreContext.Provider value={store}>
      <Provider store={store}>
        <ConnectedThemeProvider>
          <LocalizedMUIPickersUtilsProvider>
            <DrawerStateProvider>
              <InstanceConfigGate>
                <MessagesProvider>
                  <CssBaseline />
                  <MessageStream />
                  <AuthService />

                  {props.children}
                </MessagesProvider>
              </InstanceConfigGate>
            </DrawerStateProvider>
          </LocalizedMUIPickersUtilsProvider>
        </ConnectedThemeProvider>
      </Provider>
    </StoreContext.Provider>
  );
}
