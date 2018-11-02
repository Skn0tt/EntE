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
import { AppState, getUser, UserN } from "ente-redux";
import { CreateSlotDto } from "ente-types";

interface OwnProps {
  slot: CreateSlotDto;
  delete(): void;
}
interface StateProps {
  getUser(id: string): UserN;
}
const mapStateToProps: MapStateToPropsParam<
  StateProps,
  OwnProps,
  AppState
> = state => ({
  getUser: id => getUser(id)(state)
});

type Props = OwnProps & StateProps & WithStyles;

const SlotListItem: React.SFC<Props> = props => {
  const { slot, getUser } = props;

  return (
    <ListItem>
      <ListItemText
        primary={getUser(slot.teacherId).get("displayname")}
        secondary={`${slot.from} - ${slot.to}`}
      />
      <ListItemSecondaryAction>
        <IconButton aria-label="Delete" onClick={props.delete}>
          <DeleteIcon />
        </IconButton>
      </ListItemSecondaryAction>
    </ListItem>
  );
};

export default withStyles(styles)(connect(mapStateToProps)(SlotListItem));
