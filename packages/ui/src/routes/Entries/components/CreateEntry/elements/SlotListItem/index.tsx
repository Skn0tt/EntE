import * as React from "react";
import withStyles, { WithStyles } from "material-ui/styles/withStyles";
import styles from "./styles";
import {
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton
} from "material-ui";
import { Delete as DeleteIcon } from "material-ui-icons";
import { connect } from "react-redux";
import { MongoId, ISlotCreate } from "ente-types";
import { AppState, User, getUser } from "ente-redux";

interface OwnProps {
  slot: ISlotCreate;
  delete(): void;
}
interface StateProps {
  getUser(id: MongoId): User;
}
const mapStateToProps = (state: AppState) => ({
  getUser: (id: MongoId) => getUser(id)(state)
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

export default connect(mapStateToProps)(withStyles(styles)(SlotListItem));
