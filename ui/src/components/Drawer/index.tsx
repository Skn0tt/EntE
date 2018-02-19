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
  WithStyles,
  LinearProgress,
} from 'material-ui';
import { Menu as MenuIcon } from 'material-ui-icons';
import * as select from '../../redux/selectors';

import styles from './styles';
import { AdminItems, ManagerItems, TeacherItems, StudentItems, ParentItems } from './items';
import RefreshButton from '../RefreshButton';
import { connect } from 'react-redux';
import { AppState, Roles } from '../../interfaces/index';
import { withRouter, RouteComponentProps } from 'react-router';
import LoginStatus from '../LoginStatus';

interface StateProps {
  loading: boolean;
  role: Roles;
}
const mapStateToProps = (state: AppState) => ({
  loading: select.isLoading(state),
  role: select.getRole(state),
});

type Props = StateProps & RouteComponentProps<{}> & WithStyles;
interface State {
  mobileOpen: boolean;
}

const Drawer = withRouter(
  connect<StateProps>(mapStateToProps)(
    withStyles(styles)(
      class extends React.Component<Props, State> {
        state = {
          mobileOpen: false,
        };

        handleDrawerToggle = () => this.setState({ mobileOpen: !this.state.mobileOpen });

        render() {
          const { classes, loading } = this.props;

          const drawer = (
            <div>
              <LoginStatus />
              <Divider />
              {this.props.role === Roles.ADMIN && <AdminItems />}
              {this.props.role === Roles.TEACHER && <TeacherItems />}
              {this.props.role === Roles.PARENT && <ParentItems />}
              {this.props.role === Roles.STUDENT && <StudentItems />}
              {this.props.role === Roles.MANAGER && <ManagerItems />}
            </div>
          );

          return (
            <div className={classes.root}>
              <div className={classes.appFrame}>
                <AppBar className={classes.appBar}>
                  {loading && (
                    <LinearProgress variant="query" className={classes.loadingIndicator} />
                  )}
                  <Toolbar>
                    <IconButton
                      aria-label="open drawer"
                      onClick={this.handleDrawerToggle}
                      className={classes.navIconHide}
                    >
                      <MenuIcon />
                    </IconButton>
                    <Typography variant="title" color="inherit" noWrap>
                      EntE
                    </Typography>
                    <div className={classes.grow} />
                    <RefreshButton />
                  </Toolbar>
                </AppBar>
                <Hidden mdUp>
                  <MUIDrawer
                    variant="temporary"
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
                <Hidden smDown implementation="css">
                  <MUIDrawer
                    variant="permanent"
                    open
                    classes={{
                      paper: classes.drawerPaper,
                    }}
                  >
                    {drawer}
                  </MUIDrawer>
                </Hidden>
                <main className={classes.content}>{this.props.children}</main>
              </div>
            </div>
          );
        }
      },
    ),
  ),
);

export default Drawer;
