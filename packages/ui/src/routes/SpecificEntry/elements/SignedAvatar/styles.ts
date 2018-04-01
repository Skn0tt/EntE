import { StyleRules } from 'material-ui/styles/withStyles';
import { Theme } from 'material-ui/styles/createMuiTheme';
import { green } from 'material-ui/colors';

const styles = (theme: Theme): StyleRules => ({
  avatar: {
    backgroundColor: green[500],
  },
});

export default styles;
