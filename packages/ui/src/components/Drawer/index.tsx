import { AppState, getRole, isLoading } from "ente-redux";
import { Roles } from "ente-types";
import {
  AppBar,
  Divider,
  Hidden,
  IconButton,
  Toolbar,
  WithStyles,
  withStyles,
  Drawer as MUIDrawer
} from "material-ui";
import * as React from "react";
import { Menu as MenuIcon } from "material-ui-icons";
import { connect } from "react-redux";
import { RouteComponentProps, withRouter } from "react-router";
import LoginStatus from "../LoginStatus";
import RefreshButton from "../RefreshButton";
import {
  AdminItems,
  ManagerItems,
  ParentItems,
  StudentItems,
  TeacherItems
} from "./items";
import styles from "./styles";

/**
 * # Component Types
 */
interface StateProps {
  loading: boolean;
  role: Roles;
}
const mapStateToProps = (state: AppState) => ({
  loading: isLoading(state),
  role: getRole(state)
});

type Props = StateProps & RouteComponentProps<{}> & WithStyles;
interface State {
  mobileOpen: boolean;
}

/**
 * # Component Logic
 */
export const toggleDrawer = (s: State): State => ({
  mobileOpen: !s.mobileOpen
});

/**
 * # Component
 */
class Drawer extends React.Component<Props, State> {
  state = {
    mobileOpen: false
  };

  handleDrawerToggle = () => this.setState(toggleDrawer);

  render() {
    const { classes, role, children } = this.props;

    const drawer = (
      <>
        <LoginStatus />
        <Divider />
        {
          {
            [Roles.ADMIN]: <AdminItems />,
            [Roles.TEACHER]: <TeacherItems />,
            [Roles.PARENT]: <ParentItems />,
            [Roles.STUDENT]: <StudentItems />,
            [Roles.MANAGER]: <ManagerItems />
          }[role]
        }
      </>
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
                src={require("../../res/img/Logo.svg")}
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

export default withRouter(connect(mapStateToProps)(withStyles(styles)(Drawer)));
