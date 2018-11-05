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
import createRavenMiddleware from "raven-for-redux";
import { MuiPickersUtilsProvider } from "material-ui-pickers";
import LuxonUtils from "material-ui-pickers/utils/luxon-utils";
import { get as getConfig } from "./config";

// Fonts
import "typeface-roboto";

import theme from "./theme";
import setupRedux, {
  AppState,
  getUsername,
  AuthState,
  GET_TOKEN_REQUEST,
  ReduxConfig
} from "ente-redux";
import { MuiThemeProvider } from "@material-ui/core";
import { Provider } from "react-redux";
import Raven from "raven-js";
import { Action } from "redux-actions";
import HttpsGate from "./components/HttpsGate";

const config: ReduxConfig = {
  baseUrl: `${location.protocol}//${location.hostname}/api`,
  onFileDownload: (file, filename) => {
    const url = window.URL.createObjectURL(file);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
  }
};

const { SENTRY_DSN_UI, ALLOW_INSECURE } = getConfig();

if (SENTRY_DSN_UI) {
  Raven.config(SENTRY_DSN_UI).install();

  const ravenMiddleWare = createRavenMiddleware(Raven, {
    actionTransformer: (action: Action<AuthState | {}>) => {
      if (action.type === GET_TOKEN_REQUEST) {
        return {
          ...action,
          payload: "deleted"
        };
      }
      return action;
    },
    getUserContext: (state: AppState) => ({ username: getUsername(state) })
  });

  config.middlewares = [ravenMiddleWare];
  config.onSagaError = Raven.captureException;
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
