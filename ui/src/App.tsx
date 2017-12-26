import * as React from 'react';
import {
  BrowserRouter,
  Route,
  Switch
} from 'react-router-dom';
import { connect, Dispatch } from 'react-redux';
import { AppState, ICredentials } from './interfaces/index';
import { Action } from 'redux';
import { checkAuthRequest } from './redux/actions';
import { Redirect } from 'react-router';

import * as select from './redux/selectors';
import Drawer from './components/Drawer';

// Routes
import Entries from './routes/Entries';
import Users from './routes/Users';
import SpecificEntry from './routes/SpecificEntry';
import SpecificUser from './routes/SpecificUser';
import Loading from './routes/Loading';
import Login from './routes/Login';

const Home = () => (
  <div>
    Home!
  </div>
);

const Routes = () => (
  <React.Fragment>
    <Switch>
      <Route exact={true} path="/" component={Home}/>
      <Route path="/entries" component={Entries}/>
      <Route path="/users" component={Users}/>
    </Switch>
    <Switch>
      <Route path="/users/:userId" component={SpecificUser} />
      <Route path="/entries/:entryId" component={SpecificEntry} />
    </Switch>
  </React.Fragment>
);

interface Props {
  authValid: boolean;
  authChecked: boolean;
  authCredentials: ICredentials;
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
        <div>
          <Switch>
            <Route path="/loading" component={Loading} />
            <Route path="/login" component={Login} />
            <Drawer>
              <Routes />
            </Drawer>
          </Switch>
          {!this.props.authValid && <Redirect to="/login" />}
          {!this.props.authChecked && <Redirect to="/loading" />}
        </div>
      </BrowserRouter>
    );
  }
}

const mapStateToProps = (state: AppState) => ({
  authCredentials: select.getAuthCredentials(state),
  authValid: select.isAuthValid(state),
  authChecked: select.wasAuthChecked(state),
});
const mapDispatchToProps = (dispatch: Dispatch<Action>) => ({
  checkAuth: (credentials: ICredentials) => dispatch(checkAuthRequest(credentials)),
});

export default connect(mapStateToProps, mapDispatchToProps)(App);
