/**
 * EntE
 * (c) 2017-present, Simon Knott <info@simonknott.de>
 *
 * This source code is licensed under the GNU Affero General Public License
 * found in the LICENSE file in the root directory of this source tree.
 */

import * as React from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import { connect, MapDispatchToPropsParam } from "react-redux";
import Drawer from "./components/Drawer";
import MessageStream from "./components/MessageStream";

// Routes
import AuthenticatedRoute from "./components/AuthenticatedRoute";
import Login from "./routes/Login/Login";
import Routes from "./Routes";
import PasswordReset from "./routes/PasswordReset";
import { Roles } from "ente-types";
import { AppState, isAuthValid, getRole, logout } from "./redux";
import AuthService from "./AuthService";
import * as config from "./config";
import { Maybe } from "monet";
import withErrorBoundary from "./hocs/withErrorBoundary";
import Invitation from "./routes/Invitation/Invitation";
import InstanceConfigGate from "./components/InstanceConfigGate";
import { TableStatePersistenceProvider } from "./context/TableStatePersistence";

const { ROTATION_PERIOD } = config.get();

interface AppStateProps {
  authValid: boolean;
  role: Maybe<Roles>;
}
const mapStateToProps = (state: AppState) => ({
  authValid: isAuthValid(state),
  role: getRole(state)
});

interface AppDispatchProps {
  purgeStaleData: () => void;
}
const mapDispatchToProps: MapDispatchToPropsParam<
  AppDispatchProps,
  {}
> = dispatch => ({
  purgeStaleData: () => dispatch(logout())
});

type AppProps = AppStateProps & AppDispatchProps;

const App: React.FunctionComponent<AppProps> = props => {
  const { authValid, role, purgeStaleData } = props;

  return (
    <InstanceConfigGate>
      <BrowserRouter>
        <>
          <MessageStream />
          <AuthService period={ROTATION_PERIOD} />
          <Switch>
            <Route path="/passwordReset/:token" component={PasswordReset} />
            <Route path="/invitation/:token" component={Invitation} />
            <Route path="/login" component={Login} />
            <AuthenticatedRoute
              isLoggedIn={authValid}
              purgeStaleData={purgeStaleData}
            >
              <TableStatePersistenceProvider>
                <Drawer>
                  <Routes role={role.orSome(Roles.STUDENT)} />
                </Drawer>
              </TableStatePersistenceProvider>
            </AuthenticatedRoute>
          </Switch>
        </>
      </BrowserRouter>
    </InstanceConfigGate>
  );
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withErrorBoundary()(App));
