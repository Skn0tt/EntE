import { StyleRules } from 'material-ui/styles/withStyles';
import { Theme } from 'material-ui/styles/createMuiTheme';

const styles = (theme: Theme): StyleRules => ({
  searchBar: {
    padding: 10,
  },
  table: {
    overflowX: 'auto',
  },
});

export default styles;
