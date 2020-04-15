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
  ListItemIcon,
} from "@material-ui/core";
import { useDispatch, useSelector } from "react-redux";
import PowerSettingsNewIcon from "@material-ui/icons/PowerSettingsNew";
import { logout, getDisplayname } from "../redux";
import { useRouter } from "next/router";

/**
 * # Component
 */
export const LoginStatus = (props: {}) => {
  const displayname = useSelector(getDisplayname);

  const dispatch = useDispatch();
  const router = useRouter();

  const handleLogout = React.useCallback(() => {
    dispatch(logout());
    router.push("/login");
  }, [router, dispatch]);

  return (
    <ListItem>
      <ListItemIcon>
        <IconButton aria-label="logout" onClick={handleLogout} id="logout">
          <PowerSettingsNewIcon />
        </IconButton>
      </ListItemIcon>
      <ListItemText primary={displayname.orSome("")} />
    </ListItem>
  );
};

export default LoginStatus;
