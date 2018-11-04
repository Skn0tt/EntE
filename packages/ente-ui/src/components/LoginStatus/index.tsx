/**
 * EntE
 * (c) 2017-present, Simon Knott <info@simonknott.de>
 *
 * This source code is licensed under the GNU Affero General Public License
 * found in the LICENSE file in the root directory of this source tree.
 */

import * as React from "react";

import {
  IconButton,
  ListItemText,
  ListItem,
  ListItemIcon
} from "@material-ui/core";
import { connect, Dispatch } from "react-redux";
import { PowerSettingsNew as PowerSettingsNewIcon } from "@material-ui/icons";
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

type Props = StateProps & DispatchProps;

/**
 * # Component
 */
export const LoginStatus: React.SFC<Props> = props => {
  const { displayname, logout } = props;

  return (
    <ListItem>
      <ListItemIcon>
        <IconButton aria-label="logout" onClick={logout} id="logout">
          <PowerSettingsNewIcon />
        </IconButton>
      </ListItemIcon>
      <ListItemText primary={displayname} />
    </ListItem>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(LoginStatus);
