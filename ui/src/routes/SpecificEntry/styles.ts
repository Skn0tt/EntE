import { green } from 'material-ui/colors';
import { StyleRules } from 'material-ui/styles/withStyles';
import { Theme } from 'material-ui/styles/createMuiTheme';

const styles = (theme: Theme): StyleRules => ({
  signEntryButton: {
    color: green[500],
  },
});

export default styles;
