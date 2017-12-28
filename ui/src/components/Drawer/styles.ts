import { StyleRules } from 'material-ui/styles/withStyles';
import { Theme } from 'material-ui/styles/createMuiTheme';

export interface Style {
  root: string;
  appFrame: string;
  appBar: string;
  appBarBar: string;
  grow: string;
  navIconHide: string;
  drawerHeader: string;
  drawerPaper: string;
  content: string;
}

const drawerWidth = 240;

const styles = (theme: Theme): StyleRules =>  ({
  root: {
    width: '100%',
    zIndex: 1,
    overflow: 'hidden',
  },
  appFrame: {
    position: 'relative',
    display: 'flex',
    width: '100%',
    height: '100%',
  },
  appBar: {
    position: 'absolute',
    marginLeft: drawerWidth,
    [theme.breakpoints.up('md')]: {
      width: `calc(100% - ${drawerWidth}px)`,
    },
  },
  grow: {
    flex: '1 1 auto',
  },
  navIconHide: {
    [theme.breakpoints.up('md')]: {
      display: 'none',
    },
  },
  drawerPaper: {
    width: 250,
    [theme.breakpoints.up('md')]: {
      width: drawerWidth,
      position: 'relative',
      height: '100%',
    },
  },
  content: {
    backgroundColor: theme.palette.background.default,
    width: '100%',
    height: 'calc(100% - 56px)',
    marginTop: 56,
    [theme.breakpoints.up('sm')]: {
      height: 'calc(100% - 64px)',
      marginTop: 64,
    },
  },
});

export default styles;
