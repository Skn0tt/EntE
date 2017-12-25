import * as React from 'react';
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Hidden,
  Divider,
  withStyles,
  Drawer as MUIDrawer,
  WithStyles
} from 'material-ui';
import { Menu as MenuIcon } from 'material-ui-icons';
import LoadingIndicator from '../LoadingIndicator';

import styles from './styles';
import { AdminItems } from './items';

interface Props extends WithStyles {}

interface State {
  mobileOpen: boolean;
}

const Drawer = withStyles(styles)<{}>(
  class extends React.Component<Props, State> {
    state = {
      mobileOpen: false,
    };
  
    handleDrawerToggle = () => this.setState({ mobileOpen: !this.state.mobileOpen });
  
    render() {
      const classes = this.props.classes!;
  
      const drawer = (
        <div>
          <div className={classes.drawerHeader} />
          <Divider />
          <AdminItems />
          <Divider />
        </div>
      );
  
      return (
        <div className={classes.root}>
          <LoadingIndicator />
          <div className={classes.appFrame}>
            <AppBar className={classes.appBar}>
              <Toolbar>
                <IconButton
                  color="contrast"
                  aria-label="open drawer"
                  onClick={this.handleDrawerToggle}
                  className={classes.navIconHide}
                >
                  <MenuIcon />
                </IconButton>
                <Typography type="title" color="inherit" noWrap={true}>
                  EntschuldigungsVerfahren
                </Typography>
                <div className={classes.grow} />
                <div id="upperRightPortal" />
              </Toolbar>
            </AppBar>
            <Hidden mdUp={true}>
              <MUIDrawer
                type="temporary"
                open={this.state.mobileOpen}
                classes={{
                  paper: classes.drawerPaper,
                }}
                onClose={this.handleDrawerToggle}
                ModalProps={{
                  keepMounted: true,
                }}
              >
                {drawer}
              </MUIDrawer>
            </Hidden>
            <Hidden mdDown={true} implementation="css">
              <MUIDrawer
                type="permanent"
                open={true}
                classes={{
                  paper: classes.drawerPaper,
                }}
              >
                {drawer}
              </MUIDrawer>
            </Hidden>
            <main className={classes.content}>
              {this.props.children}
            </main>
          </div>
        </div>
      );
    }
  }
);

export default Drawer;
