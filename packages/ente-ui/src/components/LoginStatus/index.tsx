/**
 * EntE
 * (c) 2017-present, Simon Knott <info@simonknott.de>
 *
 * This source code is licensed under the GNU Affero General Public License
 * found in the LICENSE file in the root directory of this source tree.
 */

import * as React from "react";

import styles from "./styles";
import { WithStyles } from "@material-ui/core/styles/withStyles";
import { withStyles, IconButton, List } from "@material-ui/core";
import { connect, Dispatch } from "react-redux";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import { PowerSettingsNew as PowerSettingsNewIcon } from "@material-ui/icons";
import ListItemIcon from "@material-ui/core/ListItemIcon";
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
  logout(): void;
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

export default withStyles(styles)(
  connect(mapStateToProps, mapDispatchToProps)(LoginStatus)
);
