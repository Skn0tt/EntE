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
import PowerSettingsNewIcon from "@material-ui/icons/PowerSettingsNew";
import { logout, AppState, getDisplayname } from "../redux";
import { Action } from "redux";
import { Maybe } from "monet";

/**
 * # Component Types
 */
interface LoginStatusStateProps {
  displayname: Maybe<string>;
}
const mapStateToProps = (state: AppState): LoginStatusStateProps => ({
  displayname: getDisplayname(state)
});

interface LoginStatusDispatchProps {
  logout(): void;
}
const mapDispatchToProps = (
  dispatch: Dispatch<Action>
): LoginStatusDispatchProps => ({
  logout: () => dispatch(logout())
});

type LoginStatusProps = LoginStatusStateProps & LoginStatusDispatchProps;

/**
 * # Component
 */
export const LoginStatus: React.SFC<LoginStatusProps> = props => {
  const { displayname, logout } = props;

  return (
    <ListItem>
      <ListItemIcon>
        <IconButton aria-label="logout" onClick={logout} id="logout">
          <PowerSettingsNewIcon />
        </IconButton>
      </ListItemIcon>
      <ListItemText primary={displayname.orSome("")} />
    </ListItem>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(LoginStatus);
