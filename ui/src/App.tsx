import * as React from 'react';
import {
  BrowserRouter,
  Route,
  Switch,
} from 'react-router-dom';
import { connect, Dispatch } from 'react-redux';
import { AppState, ICredentials, Roles } from './interfaces/index';
import { Action } from 'redux';
import { checkAuthRequest } from './redux/actions';

import * as select from './redux/selectors';
import Drawer from './components/Drawer';
import LoadingScreen from './components/LoadingScreen';

// Routes
import AuthenticatedRoute from './components/AuthenticatedRoute';
import Login from './routes/Login';
import Routes from './Routes';

interface Props {
  authValid: boolean;
  authChecked: boolean;
  authCredentials: ICredentials;
  role: Roles;
  checkAuth(credentials: ICredentials): Action;
}
interface State {}

class App extends React.Component<Props, State> {
  componentWillMount() {
    this.props.checkAuth(this.props.authCredentials);
  }

  render() {
    return (
      <BrowserRouter>
        <Switch>
          <Route path="/loading" component={LoadingScreen} />
          <Route path="/login" component={Login} />
          <AuthenticatedRoute
            authWasChecked={this.props.authChecked}
            isLoggedIn={this.props.authValid}
          >
            <Drawer>
              <Routes role={this.props.role}/>
            </Drawer>
          </AuthenticatedRoute>
        </Switch>
      </BrowserRouter>
    );
  }
}

const mapStateToProps = (state: AppState) => ({
  authCredentials: select.getAuthCredentials(state),
  authValid: select.isAuthValid(state),
  role: select.getRole(state),
  authChecked: select.wasAuthChecked(state),
});
const mapDispatchToProps = (dispatch: Dispatch<Action>) => ({
  checkAuth: (credentials: ICredentials) => dispatch(checkAuthRequest(credentials)),
});

export default connect(mapStateToProps, mapDispatchToProps)(App);
