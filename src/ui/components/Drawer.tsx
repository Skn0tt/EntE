/**
 * EntE
 * (c) 2017-present, Simon Knott <info@simonknott.de>
 *
 * This source code is licensed under the GNU Affero General Public License
 * found in the LICENSE file in the root directory of this source tree.
 */

import { AppState, getRole, isLoading, isAdmin } from "../redux";
import { Roles } from "@@types";
import {
  AppBar,
  Hidden,
  IconButton,
  Toolbar,
  Drawer as MUIDrawer,
  List,
  Divider,
  Theme,
} from "@material-ui/core";
import * as React from "react";
import MenuIcon from "@material-ui/icons/Menu";
import { connect } from "react-redux";
import LoginStatus from "./LoginStatus";
import RefreshButton from "./RefreshButton";
import {
  AdminItems,
  ManagerItems,
  ParentItems,
  StudentItems,
  TeacherItems,
} from "./Drawer.items";
import { Maybe } from "monet";
import SettingsMenu from "./SettingsMenu";
import { useToggle } from "../helpers/useToggle";
import { makeStyles } from "@material-ui/styles";
import Logo from "../assets/Logo.svg";

interface DrawerStateContextType {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const DrawerStateContext = React.createContext<DrawerStateContextType>({
  open: false,
  setOpen: () => {},
});

function useDrawerState(): [
  boolean,
  React.Dispatch<React.SetStateAction<boolean>>
] {
  const { open, setOpen } = React.useContext(DrawerStateContext);
  return [open, setOpen];
}

export function DrawerStateProvider(props: React.PropsWithChildren<{}>) {
  const [open, setOpen] = React.useState(false);
  const value = React.useMemo(
    () => ({
      open,
      setOpen,
    }),
    [open, setOpen]
  );

  return (
    <DrawerStateContext.Provider value={value}>
      {props.children}
    </DrawerStateContext.Provider>
  );
}

const drawerWidth = 240;

const useStyles = makeStyles(
  (theme: Theme) => ({
    root: {
      width: "100%",
      zIndex: 1,
      overflowX: "hidden",
    },
    appFrame: {
      position: "relative",
      display: "flex",
      width: "100%",
      height: "100%",
    },
    appBar: {
      position: "fixed",
      marginLeft: drawerWidth,
      [theme.breakpoints.up("md")]: {
        width: `calc(100% - ${drawerWidth}px)`,
      },
    },
    toolBar: {
      paddingRight: 0,
    },
    grow: {
      flex: "1 1 auto",
    },
    logo: {
      display: "block",
      [theme.breakpoints.down("sm")]: {
        position: "fixed",
        left: "50%",
        marginLeft: "-62px",
      },
    },
    navIconHide: {
      [theme.breakpoints.up("md")]: {
        display: "none",
      },
      color: "white",
    },
    drawerPaper: {
      width: 250,
      [theme.breakpoints.up("md")]: {
        width: drawerWidth,
        position: "fixed",
        height: "100%",
      },
    },
    content: {
      width: "100%",
      minHeight: "calc(100vh - 56px)",
      marginTop: 56,
      backgroundColor: theme.palette.background.default,
      [theme.breakpoints.up("md")]: {
        height: "calc(100vh - 64px)",
        marginTop: 64,
        marginLeft: drawerWidth,
      },
    },
  }),
  { withTheme: true }
);

interface DrawerOwnProps {}
interface DrawerStateProps {
  loading: boolean;
  role: Maybe<Roles>;
  isAdmin: boolean;
}
const mapStateToProps = (state: AppState): DrawerStateProps => ({
  loading: isLoading(state),
  role: getRole(state),
  isAdmin: isAdmin(state),
});

type DrawerProps = DrawerOwnProps & DrawerStateProps;

const Drawer: React.FunctionComponent<DrawerProps> = (props) => {
  const { role, children, isAdmin } = props;
  const [mobileOpen, setMobileOpen] = useDrawerState();
  const classes = useStyles(props);

  const toggleMobileOpen = React.useCallback(() => {
    setMobileOpen((v) => !v);
  }, [setMobileOpen]);

  const drawer = (
    <List disablePadding>
      <LoginStatus />
      <Divider />
      {
        {
          [Roles.TEACHER]: <TeacherItems />,
          [Roles.PARENT]: <ParentItems />,
          [Roles.STUDENT]: <StudentItems />,
          [Roles.MANAGER]: <ManagerItems />,
        }[role.orSome(Roles.PARENT)]
      }
      {isAdmin && <AdminItems />}
    </List>
  );

  return (
    <div className={classes.root}>
      <div className={classes.appFrame}>
        <AppBar className={classes.appBar}>
          <Toolbar className={classes.toolBar}>
            <IconButton
              aria-label="open drawer"
              onClick={toggleMobileOpen}
              className={classes.navIconHide}
            >
              <MenuIcon />
            </IconButton>
            <Logo height={24} className={classes.logo} />
            <div className={classes.grow} />

            <RefreshButton />
            <SettingsMenu />
          </Toolbar>
        </AppBar>
        <Hidden mdUp>
          <MUIDrawer
            variant="temporary"
            open={mobileOpen}
            classes={{
              paper: classes.drawerPaper,
            }}
            onClose={toggleMobileOpen}
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
        <main className={classes.content}>{children}</main>
      </div>
    </div>
  );
};

export default connect<DrawerStateProps, {}, DrawerOwnProps, AppState>(
  mapStateToProps
)(Drawer);
