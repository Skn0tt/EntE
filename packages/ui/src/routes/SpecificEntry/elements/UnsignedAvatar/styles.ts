import { StyleRules } from 'material-ui/styles/withStyles';
import { Theme } from 'material-ui/styles/createMuiTheme';
import pink from 'material-ui/colors/pink';

const styles = (theme: Theme): StyleRules => ({
  avatar: {
    backgroundColor: pink[500],
  },
});

export default styles;
