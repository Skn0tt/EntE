/**
 * EntE
 * (c) 2017-present, Simon Knott <info@simonknott.de>
 *
 * This source code is licensed under the GNU Affero General Public License
 * found in the LICENSE file in the root directory of this source tree.
 */

import * as React from "react";
import {
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton
} from "@material-ui/core";
import { Delete as DeleteIcon } from "@material-ui/icons";
import { connect, MapStateToPropsParam } from "react-redux";
import { AppState, getUser, UserN } from "../../redux";
import { CreateSlotDto } from "ente-types";
import { Maybe } from "monet";

const getText = (s: CreateSlotDto): string => {
  if (!!s.date) {
    const day = s.date.toLocaleDateString("de");
    return `${day}, ${s.from} - ${s.to}`;
  }

  return `${s.from} - ${s.to}`;
};

interface OwnProps {
  slot: CreateSlotDto;
  delete(): void;
}

interface StateProps {
  getUser(id: string): Maybe<UserN>;
}

const mapStateToProps: MapStateToPropsParam<
  StateProps,
  OwnProps,
  AppState
> = state => ({
  getUser: id => getUser(id)(state)
});

type SlotListItemProps = OwnProps & StateProps;

const SlotListItem: React.SFC<SlotListItemProps> = props => {
  const { slot, getUser } = props;

  return (
    <ListItem>
      <ListItemText
        primary={getUser(slot.teacherId)
          .some()
          .get("displayname")}
        secondary={getText(slot)}
      />
      <ListItemSecondaryAction>
        <IconButton aria-label="Delete" onClick={props.delete}>
          <DeleteIcon />
        </IconButton>
      </ListItemSecondaryAction>
    </ListItem>
  );
};

export default connect(mapStateToProps)(SlotListItem);
