import * as React from 'react';
import * as ReactDOM from 'react-dom';
import App from './App';
import registerServiceWorker from './registerServiceWorker';

// Fonts
import 'typeface-roboto';

import theme from './theme';
import store from './redux/store';
import { MuiThemeProvider } from 'material-ui';
import { Provider } from 'react-redux';

const Index = () => (
  <MuiThemeProvider theme={theme}>
    <Provider store={store}>
      <App />
    </Provider>
  </MuiThemeProvider>
);

ReactDOM.render(
  <Index />,
  document.getElementById('root') as HTMLElement
);
registerServiceWorker();
