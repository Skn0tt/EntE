/**
 * EntE
 * (c) 2017-present, Simon Knott <info@simonknott.de>
 *
 * This source code is licensed under the GNU Affero General Public License
 * found in the LICENSE file in the root directory of this source tree.
 */

import * as React from "react";
import withStyles, { WithStyles } from "@material-ui/core/styles/withStyles";
import styles from "./styles";
import {
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton
} from "@material-ui/core";
import { Delete as DeleteIcon } from "@material-ui/icons";
import { connect, MapStateToPropsParam } from "react-redux";
import { ISlotCreate, UserId } from "ente-types";
import { AppState, User, getUser } from "ente-redux";

interface OwnProps {
  slot: ISlotCreate;
  delete(): void;
}
interface StateProps {
  getUser(id: UserId): User;
}
const mapStateToProps: MapStateToPropsParam<
  StateProps,
  OwnProps,
  AppState
> = state => ({
  getUser: id => getUser(id)(state)
});

type Props = OwnProps & StateProps & WithStyles;

const SlotListItem: React.SFC<Props> = props => (
  <ListItem>
    <ListItemText
      primary={props.getUser(props.slot.teacher).get("displayname")}
      secondary={`${props.slot.hour_from} - ${props.slot.hour_to}`}
    />
    <ListItemSecondaryAction>
      <IconButton aria-label="Delete" onClick={props.delete}>
        <DeleteIcon />
      </IconButton>
    </ListItemSecondaryAction>
  </ListItem>
);

export default withStyles(styles)(connect(mapStateToProps)(SlotListItem));
