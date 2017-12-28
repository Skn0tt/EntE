import { StyleRules } from 'material-ui/styles/withStyles';
import { Theme } from 'material-ui/styles/createMuiTheme';

const styles = (theme: Theme): StyleRules => ({
  root: {
    width: '100%',
    height: '100%',
  },
  appFrame: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default styles;
