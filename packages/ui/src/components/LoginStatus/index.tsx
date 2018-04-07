import * as React from "react";

import styles from "./styles";
import { WithStyles } from "material-ui/styles/withStyles";
import { withStyles, IconButton, List } from "material-ui";
import { connect, Dispatch } from "react-redux";
import ListItem from "material-ui/List/ListItem";
import ListItemText from "material-ui/List/ListItemText";
import { PowerSettingsNew as PowerSettingsNewIcon } from "material-ui-icons";
import ListItemIcon from "material-ui/List/ListItemIcon";
import { logout, AppState, getDisplayname } from "ente-redux";
import { Action } from "redux";

/**
 * # Component Types
 */
interface StateProps {
  displayname: string;
}
const mapStateToProps = (state: AppState): StateProps => ({
  displayname: getDisplayname(state)
});

interface DispatchProps {
  logout();
}
const mapDispatchToProps = (dispatch: Dispatch<Action>): DispatchProps => ({
  logout: () => dispatch(logout())
});

type Props = StateProps & DispatchProps & WithStyles;

/**
 * # Component
 */
export const LoginStatus: React.SFC<Props> = props => {
  const { classes, displayname, logout } = props;

  return (
    <div className={classes.container}>
      <List>
        <ListItem>
          <ListItemIcon>
            <IconButton aria-label="logout" onClick={logout} className="logout">
              <PowerSettingsNewIcon />
            </IconButton>
          </ListItemIcon>
          <ListItemText primary={displayname} />
        </ListItem>
      </List>
    </div>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(
  withStyles(styles)(LoginStatus)
);
