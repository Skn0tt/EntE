import { StyleRules } from 'material-ui/styles/withStyles';
import { Theme } from 'material-ui/styles';

const styles = (theme: Theme): StyleRules => ({
  container: theme.mixins.toolbar,
});

export default styles;
