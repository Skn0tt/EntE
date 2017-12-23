import * as React from 'react';
import { MuiThemeProvider, createMuiTheme } from 'material-ui';
import {
  BrowserRouter,
  Route
} from 'react-router-dom';
import { Provider } from 'react-redux';

import Drawer from './components/Drawer';

import store from './redux/store';

// Routes
import Entries from './routes/Entries';
import Slots from './routes/Slots';
import Users from './routes/Users';

const Home = () => (
  <div>
    Home!
  </div>
);

const Routes = () => (
  <React.Fragment>
    <Route exact={true} path="/" component={Home}/>
    <Route path="/entries" component={Entries}/>
    <Route path="/slots" component={Slots}/>
    <Route path="/users" component={Users}/>
  </React.Fragment>
);

const theme = createMuiTheme();

const App = () => (
  <MuiThemeProvider theme={theme}>
    <Provider store={store}>
      <BrowserRouter>
        <Drawer>
          <Routes />
        </Drawer>
      </BrowserRouter>
    </Provider>
  </MuiThemeProvider>
);

export default App;
