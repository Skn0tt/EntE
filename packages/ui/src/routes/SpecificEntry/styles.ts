import { green, red, common } from 'material-ui/colors';
import { StyleRules } from 'material-ui/styles/withStyles';
import { Theme } from 'material-ui/styles/createMuiTheme';

const styles = (theme: Theme): StyleRules => ({
  list: {
    width: "100%",
  },
  listItem: {
    width: "100%",
  },
  signEntryButton: {
    backgroundColor: green[500],
    color: common.white
  },
  unsignEntryButton: {
    color: red[500],
  },
});

export default styles;
