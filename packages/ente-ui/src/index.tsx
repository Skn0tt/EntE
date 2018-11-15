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
import { MuiPickersUtilsProvider } from "material-ui-pickers";
import LuxonUtils from "material-ui-pickers/utils/luxon-utils";
import { get as getConfig } from "./config";

// Fonts
import "typeface-roboto";

import theme from "./theme";
import setupRedux, { ReduxConfig } from "./redux";
import { MuiThemeProvider } from "@material-ui/core";
import { Provider } from "react-redux";
import * as Sentry from "@sentry/browser";
import HttpsGate from "./components/HttpsGate";
import { isSentryDsn } from "./helpers/isSentryDsn";
import { createSentryMiddleware } from "./sentry.middleware";
import { ErrorReporting } from "./ErrorReporting";

const baseUrl = `${location.protocol}//${location.hostname}`;

const config: ReduxConfig = {
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

  const sentryClient = new Sentry.BrowserClient({
    dsn,
    release: VERSION
  });

  ErrorReporting.supplySentryClient(sentryClient);

  const ravenMiddleware = createSentryMiddleware(sentryClient);

  config.middlewares.push(ravenMiddleware);
  config.onSagaError = ErrorReporting.report;
};

if (!!SENTRY_DSN) {
  setupSentry(SENTRY_DSN);
}

const store = setupRedux(config);

const Index = () => (
  <div>
    <React.StrictMode>
      <CssBaseline />
      <MuiThemeProvider theme={theme}>
        <MuiPickersUtilsProvider utils={LuxonUtils} locale="de">
          <HttpsGate disable={ALLOW_INSECURE}>
            <Provider store={store}>
              <App />
            </Provider>
          </HttpsGate>
        </MuiPickersUtilsProvider>
      </MuiThemeProvider>
    </React.StrictMode>
  </div>
);

ReactDOM.render(<Index />, document.getElementById("root"));
