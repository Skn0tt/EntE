import { StyleRules } from 'material-ui/styles/withStyles';
import { Theme } from 'material-ui/styles/createMuiTheme';

const styles = (theme: Theme): StyleRules => ({
  container: {
    flex: 1,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
  }
});

export default styles;
