import * as React from 'react';
import withStyles, { WithStyles } from 'material-ui/styles/withStyles';
import styles from './styles';
import { AppState, MongoId, User, ISlotCreate } from '../../../../interfaces/index';
import { ListItem, ListItemText, ListItemSecondaryAction, IconButton } from 'material-ui';
import { Delete as DeleteIcon } from 'material-ui-icons';
import { connect } from 'react-redux';
import * as select from '../../../../redux/selectors';

interface Props {
  slot: ISlotCreate;
  getUser(id: MongoId): User;
  delete(): void;
}

const SlotListItem: React.SFC<Props & WithStyles> = props => (
  <ListItem>
    <ListItemText
      primary={props.getUser(props.slot.teacher).get('displayname')}
      secondary={`${props.slot.hour_from} - ${props.slot.hour_to}`}
    />
    <ListItemSecondaryAction>
      <IconButton aria-label="Delete" onClick={props.delete}>
        <DeleteIcon />
      </IconButton>
    </ListItemSecondaryAction>
  </ListItem>
);

const mapStateToProps = (state: AppState) => ({
  getUser: (id: MongoId) => select.getUser(id)(state),
});

export default connect(mapStateToProps)(withStyles(styles)(SlotListItem));
