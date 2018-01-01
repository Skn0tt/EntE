import { Theme } from 'material-ui/styles';
import { StyleRules } from 'material-ui/styles/withStyles';

const styles = (theme: Theme): StyleRules => ({
  modal: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  paper: {
    padding: 50,
  },
});
export default styles;
