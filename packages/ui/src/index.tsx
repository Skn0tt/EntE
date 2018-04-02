import * as React from "react";
import * as ReactDOM from "react-dom";
import App from "./App";
import registerServiceWorker from "./registerServiceWorker";
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
  GET_TOKEN_REQUEST
} from "ente-redux";
import { MuiThemeProvider } from "material-ui";
import { Provider } from "react-redux";
import Raven from "raven-js";
import { Action } from "redux-actions";

Raven.config(
  "https://c0120dd885894ce6a7f3f31917afa3be@sentry.io/264876"
).install();

const ravenMiddleWare = createRavenMiddleware(Raven, {
  actionTransformer: (action: Action<AuthState | {}>) => {
    if (action.type === GET_TOKEN_REQUEST) {
      return {
        payload: "deleted",
        ...action
      };
    }
    return action;
  },
  stateTransformer: (state: AppState) => state.get("auth").delete("password"),
  getUserContext: (state: AppState) => ({ username: getUsername(state) })
});

const store = setupRedux({
  baseUrl: `${location.protocol}//${location.hostname}/api`,
  middlewares: [ravenMiddleWare],
  onSagaError: Raven.captureException
});

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

ReactDOM.render(<Index />, document.getElementById("root") as HTMLElement);
registerServiceWorker();
