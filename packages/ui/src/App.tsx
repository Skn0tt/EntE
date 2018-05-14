/**
 * EntE
 * (c) 2017-present, Simon Knott <info@simonknott.de>
 *
 * This source code is licensed under the GNU Affero General Public License
 * found in the LICENSE file in the root directory of this source tree.
 */

import * as React from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import { connect, Dispatch } from "react-redux";
import { Action } from "redux";
import Drawer from "./components/Drawer";
import MessageStream from "./components/MessageStream";

// Routes
import AuthenticatedRoute from "./components/AuthenticatedRoute";
import Login from "./routes/Login";
import Routes from "./Routes";
import Forgot from "./routes/Forgot";
import { Roles, ICredentials } from "ente-types";
import { AppState, isAuthValid, getRole, getTokenRequest } from "ente-redux";

interface StateProps {
  authValid: boolean;
  role: Roles;
}
const mapStateToProps = (state: AppState) => ({
  authValid: isAuthValid(state),
  role: getRole(state)
});

interface DispatchProps {
  getToken(credentials: ICredentials): Action;
}
const mapDispatchToProps = (dispatch: Dispatch<Action>) => ({
  getToken: (credentials: ICredentials) =>
    dispatch(getTokenRequest(credentials))
});

type Props = StateProps & DispatchProps;

const App: React.SFC<Props> = props => (
  <BrowserRouter>
    <React.Fragment>
      <MessageStream />
      <Switch>
        <Route path="/forgot/:token" component={Forgot} />
        <Route path="/login" component={Login} />
        <AuthenticatedRoute isLoggedIn={props.authValid}>
          <Drawer>
            <Routes role={props.role} />
          </Drawer>
        </AuthenticatedRoute>
      </Switch>
    </React.Fragment>
  </BrowserRouter>
);

export default connect(mapStateToProps, mapDispatchToProps)(App);
