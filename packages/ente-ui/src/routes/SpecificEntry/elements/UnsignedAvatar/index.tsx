/**
 * EntE
 * (c) 2017-present, Simon Knott <info@simonknott.de>
 *
 * This source code is licensed under the GNU Affero General Public License
 * found in the LICENSE file in the root directory of this source tree.
 */

import * as React from "react";
import { withStyles } from "material-ui";
import { WithStyles } from "material-ui/styles/withStyles";
import Avatar from "material-ui/Avatar/Avatar";

import styles from "./styles";
import { Close } from "material-ui-icons";

interface Props {
  onClick?(): void;
}

const UnsignedAvatar = (props: Props & WithStyles) => (
  <Avatar
    className={props.classes.avatar}
    onClick={() => props.onClick && props.onClick()}
  >
    <Close />
  </Avatar>
);

export default withStyles(styles)(UnsignedAvatar);
