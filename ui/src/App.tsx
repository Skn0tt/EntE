import * as React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { connect, Dispatch } from 'react-redux';
import { AppState, ICredentials, Roles } from './interfaces/index';
import { Action } from 'redux';
import { checkAuthRequest } from './redux/actions';

import * as select from './redux/selectors';
import Drawer from './components/Drawer';
import MessageStream from './components/MessageStream';

// Routes
import AuthenticatedRoute from './components/AuthenticatedRoute';
import Login from './routes/Login';
import Routes from './Routes';
import Forgot from './routes/Forgot';

interface StateProps {
  authValid: boolean;
  authCredentials: ICredentials;
  role: Roles;
}
const mapStateToProps = (state: AppState) => ({
  authCredentials: select.getAuthCredentials(state),
  authValid: select.isAuthValid(state),
  role: select.getRole(state),
});

interface DispatchProps {
  checkAuth(credentials: ICredentials): Action;
}
const mapDispatchToProps = (dispatch: Dispatch<Action>) => ({
  checkAuth: (credentials: ICredentials) => dispatch(checkAuthRequest(credentials)),
});

type Props = StateProps & DispatchProps;

class App extends React.Component<Props> {
  componentWillMount() {
    this.props.checkAuth(this.props.authCredentials);
  }

  render() {
    return (
      <BrowserRouter>
        <React.Fragment>
          <MessageStream />
          <Switch>
            <Route path="/forgot/:token" component={Forgot} />
            <Route path="/login" component={Login} />
            <AuthenticatedRoute isLoggedIn={this.props.authValid}>
              <Drawer>
                <Routes role={this.props.role} />
              </Drawer>
            </AuthenticatedRoute>
          </Switch>
        </React.Fragment>
      </BrowserRouter>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
