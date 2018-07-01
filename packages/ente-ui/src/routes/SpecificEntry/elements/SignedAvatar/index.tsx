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
import { Done } from "material-ui-icons";

interface Props {
  onClick?(): void;
}

const SignedAvatar = (props: Props & WithStyles) => (
  <Avatar
    className={props.classes.avatar}
    onClick={() => props.onClick && props.onClick()}
  >
    <Done />
  </Avatar>
);

export default withStyles(styles)(SignedAvatar);
