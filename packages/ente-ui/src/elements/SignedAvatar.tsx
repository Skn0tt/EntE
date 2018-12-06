/**
 * EntE
 * (c) 2017-present, Simon Knott <info@simonknott.de>
 *
 * This source code is licensed under the GNU Affero General Public License
 * found in the LICENSE file in the root directory of this source tree.
 */

import * as React from "react";
import { withStyles } from "@material-ui/core";
import { WithStyles, StyleRules } from "@material-ui/core/styles/withStyles";
import Avatar from "@material-ui/core/Avatar/Avatar";
import Close from "@material-ui/icons/Close";
import Done from "@material-ui/icons/Done";
import { green, pink } from "@material-ui/core/colors";

const styles = (): StyleRules => ({
  avatarSigned: {
    backgroundColor: green[500]
  },
  avatarUnsigned: {
    backgroundColor: pink[500]
  }
});

interface SignedAvatarOwnProps {
  onClick?(): void;
  signed: boolean;
}

type SignedAvatarProps = SignedAvatarOwnProps & WithStyles;

const SignedAvatar: React.SFC<SignedAvatarProps> = props => {
  const { onClick, signed, classes } = props;
  return (
    <Avatar
      className={signed ? classes.avatarSigned : classes.avatarUnsigned}
      onClick={onClick}
    >
      {signed ? <Done /> : <Close />}
    </Avatar>
  );
};

export default withStyles(styles)(SignedAvatar);
