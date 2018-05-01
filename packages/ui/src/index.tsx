import * as React from "react";
import * as ReactDOM from "react-dom";
import App from "./App";
import Reboot from "material-ui/Reboot";
import createRavenMiddleware from "raven-for-redux";
import MuiPickersUtilsProvider from "material-ui-pickers/utils/MuiPickersUtilsProvider";
import DateFnsUtils from "material-ui-pickers/utils/date-fns-utils";
import * as deLocale from "date-fns/locale/de";

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
import { MuiThemeProvider } from "material-ui";
import { Provider } from "react-redux";
import Raven from "raven-js";
import { Action } from "redux-actions";

const config: ReduxConfig = {
  baseUrl: `${location.protocol}//${location.hostname}/api`
};

if (!!window.__env && !!window.__env.SENTRY_DSN_API) {
  Raven.config(window.__env.SENTRY_DSN_API).install();

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
    <Reboot />
    <MuiThemeProvider theme={theme}>
      <MuiPickersUtilsProvider utils={DateFnsUtils} locale={deLocale}>
        <Provider store={store}>
          <App />
        </Provider>
      </MuiPickersUtilsProvider>
    </MuiThemeProvider>
  </div>
);

ReactDOM.render(<Index />, document.getElementById("root"));
