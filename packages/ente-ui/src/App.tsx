/**
 * EntE
 * (c) 2017-present, Simon Knott <info@simonknott.de>
 *
 * This source code is licensed under the GNU Affero General Public License
 * found in the LICENSE file in the root directory of this source tree.
 */

import * as React from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import { connect } from "react-redux";
import Drawer from "./components/Drawer";
import MessageStream from "./components/MessageStream";

// Routes
import AuthenticatedRoute from "./components/AuthenticatedRoute";
import Login from "./routes/Login";
import Routes from "./Routes";
import PasswordReset from "./routes/PasswordReset";
import { Roles } from "ente-types";
import { AppState, isAuthValid, getRole } from "./redux";
import AuthService from "./AuthService";
import * as config from "./config";
import { MessagesProvider } from "./context/Messages";

const { ROTATION_PERIOD } = config.get();

interface AppStateProps {
  authValid: boolean;
  role: Roles;
}
const mapStateToProps = (state: AppState) => ({
  authValid: isAuthValid(state),
  role: getRole(state)
});

type AppProps = AppStateProps;

const App: React.SFC<AppProps> = props => (
  <BrowserRouter>
    <MessagesProvider>
      <MessageStream />
      <AuthService period={ROTATION_PERIOD} />
      <Switch>
        <Route path="/passwordReset/:token" component={PasswordReset} />
        <Route path="/login" component={Login} />
        <AuthenticatedRoute isLoggedIn={props.authValid}>
          <Drawer>
            <Routes role={props.role} />
          </Drawer>
        </AuthenticatedRoute>
      </Switch>
    </MessagesProvider>
  </BrowserRouter>
);

export default connect(mapStateToProps)(App);
