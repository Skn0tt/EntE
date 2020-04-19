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
  IconButton,
} from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete";
import { connect, MapStateToPropsParam } from "react-redux";
import { AppState, getUser, UserN } from "../../redux";
import { CreateSlotDto } from "@@types";
import { Maybe } from "monet";
import { format, parseISO } from "date-fns";

const getText = (s: CreateSlotDto): string => {
  if (!!s.date) {
    const day = format(parseISO(s.date), "PP");
    return `${day}, ${s.from} - ${s.to}`;
  }

  return `${s.from} - ${s.to}`;
};

interface OwnProps {
  slot: CreateSlotDto;
  onRemove(): void;
}

interface StateProps {
  getUser(id: string): Maybe<UserN>;
}

const mapStateToProps: MapStateToPropsParam<StateProps, OwnProps, AppState> = (
  state
) => ({
  getUser: (id) => getUser(id)(state),
});

type SlotListItemProps = OwnProps & StateProps;

const SlotListItem: React.SFC<SlotListItemProps> = (props) => {
  const { slot, getUser, onRemove } = props;

  return (
    <ListItem>
      <ListItemText
        primary={getUser(slot.teacherId).some().get("displayname")}
        secondary={getText(slot)}
      />
      <ListItemSecondaryAction>
        <IconButton aria-label="Delete" onClick={onRemove}>
          <DeleteIcon />
        </IconButton>
      </ListItemSecondaryAction>
    </ListItem>
  );
};

export default connect(mapStateToProps)(SlotListItem);
