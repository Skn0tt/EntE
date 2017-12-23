import * as React from 'react';
import { ReactNode } from 'react';
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Hidden,
  Divider,
  withStyles,
  WithStyles,
  Drawer as MUIDrawer
} from 'material-ui';
import { Menu as MenuIcon } from 'material-ui-icons';

import styles from './styles';
import { AdminItems } from './items';

interface Props extends WithStyles {}

interface State {
  mobileOpen: boolean;
}

const decorate = withStyles(styles);

const Drawer = decorate<{}>(
  class extends React.Component<Props, State> {
    state = {
      mobileOpen: false,
    };
  
    handleDrawerToggle = () => this.setState({ mobileOpen: !this.state.mobileOpen });
  
    render(): ReactNode {
      const { classes } = this.props;
  
      const drawer = (
        <div>
          <div className={classes.drawerHeader} />
          <Divider />
          <AdminItems />
        </div>
      );
  
      return (
        <div className={classes.root}>
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
                  keepMounted: true, // Better open performance on mobile.
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
