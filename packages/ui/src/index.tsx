import * as React from 'react';
import * as ReactDOM from 'react-dom';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import Reboot from 'material-ui/Reboot';

// Fonts
import 'typeface-roboto';

import theme from './theme';
import store from './redux/store';
import { MuiThemeProvider } from 'material-ui';
import { Provider } from 'react-redux';
import * as Raven from 'raven-js';

Raven.config('https://c0120dd885894ce6a7f3f31917afa3be@sentry.io/264876').install();

const Index = () => (
  <div>
    <Reboot />
    <MuiThemeProvider theme={theme}>
      <Provider store={store}>
        <App />
      </Provider>
    </MuiThemeProvider>
  </div>
);

ReactDOM.render(<Index />, document.getElementById('root') as HTMLElement);
registerServiceWorker();
