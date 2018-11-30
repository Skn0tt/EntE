/**
 * EntE
 * (c) 2017-present, Simon Knott <info@simonknott.de>
 *
 * This source code is licensed under the GNU Affero General Public License
 * found in the LICENSE file in the root directory of this source tree.
 */

import { AppState, getRole, isLoading } from "../redux";
import { Roles } from "ente-types";
import {
  AppBar,
  Hidden,
  IconButton,
  Toolbar,
  WithStyles,
  withStyles,
  Drawer as MUIDrawer,
  List,
  Divider
} from "@material-ui/core";
import * as React from "react";
import { Menu as MenuIcon } from "@material-ui/icons";
import { connect } from "react-redux";
import { RouteComponentProps, withRouter } from "react-router";
import LoginStatus from "./LoginStatus";
import RefreshButton from "./RefreshButton";
import {
  AdminItems,
  ManagerItems,
  ParentItems,
  StudentItems,
  TeacherItems
} from "./Drawer.items";
import styles from "./Drawer.styles";
import { Maybe } from "monet";

/**
 * # Component Types
 */
interface DrawerOwnProps {}
interface DrawerStateProps {
  loading: boolean;
  role: Maybe<Roles>;
}
const mapStateToProps = (state: AppState): DrawerStateProps => ({
  loading: isLoading(state),
  role: getRole(state)
});

type DrawerProps = DrawerStateProps &
  DrawerOwnProps &
  RouteComponentProps<{}> &
  WithStyles;
interface DrawerState {
  mobileOpen: boolean;
}

/**
 * # Component Logic
 */
export const toggleDrawer = (s: DrawerState): DrawerState => ({
  mobileOpen: !s.mobileOpen
});

/**
 * # Component
 */
class Drawer extends React.Component<DrawerProps, DrawerState> {
  state = {
    mobileOpen: false
  };

  handleDrawerToggle = () => this.setState(toggleDrawer);

  render() {
    const { classes, role, children } = this.props;
    const { mobileOpen } = this.state;

    const drawer = (
      <List disablePadding>
        <LoginStatus />
        <Divider />
        {
          {
            [Roles.ADMIN]: <AdminItems />,
            [Roles.TEACHER]: <TeacherItems />,
            [Roles.PARENT]: <ParentItems />,
            [Roles.STUDENT]: <StudentItems />,
            [Roles.MANAGER]: <ManagerItems />
          }[role.some()]
        }
      </List>
    );

    return (
      <div className={classes.root}>
        <div className={classes.appFrame}>
          <AppBar className={classes.appBar}>
            <Toolbar>
              <IconButton
                aria-label="open drawer"
                onClick={this.handleDrawerToggle}
                className={classes.navIconHide}
              >
                <MenuIcon />
              </IconButton>
              <img
                className={classes.logo}
                src={require("../assets/Logo.svg")}
                height={24}
              />
              <div className={classes.grow} />
              <RefreshButton />
            </Toolbar>
          </AppBar>
          <Hidden mdUp>
            <MUIDrawer
              variant="temporary"
              open={mobileOpen}
              classes={{
                paper: classes.drawerPaper
              }}
              onClose={this.handleDrawerToggle}
              ModalProps={{
                keepMounted: true
              }}
            >
              {drawer}
            </MUIDrawer>
          </Hidden>
          <Hidden smDown implementation="css">
            <MUIDrawer
              variant="permanent"
              open
              classes={{
                paper: classes.drawerPaper
              }}
            >
              {drawer}
            </MUIDrawer>
          </Hidden>
          <main className={classes.content}>{children}</main>
        </div>
      </div>
    );
  }
}

export default withStyles(styles)(
  withRouter(
    connect<DrawerStateProps, {}, DrawerOwnProps, AppState>(mapStateToProps)(
      Drawer
    )
  )
);
