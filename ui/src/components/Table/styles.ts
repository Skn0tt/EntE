import { Theme, StyleRules } from 'material-ui/styles';

const styles = (theme: Theme): StyleRules => ({
  searchBar: {
    padding: 10,
  },
  fab: {
    margin: 0,
    top: 'auto',
    right: theme.spacing.unit * 2,
    bottom: theme.spacing.unit * 2,
    left: 'auto',
    position: 'fixed',
  },
  table: {
    overflowX: 'auto',
  },
});

export default styles;
