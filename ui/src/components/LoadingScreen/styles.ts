import { StyleRules } from 'material-ui/styles/withStyles';
import { Theme } from 'material-ui/styles/createMuiTheme';

const styles = (theme: Theme): StyleRules => ({
  root: {
    flexGrow: 1,
  },
  item: {
    margin: 200,
  },
});

export default styles;
