import * as React from 'react';
import withStyles, { WithStyles } from 'material-ui/styles/withStyles';
import styles from './styles';
import { Slot } from '../../../../interfaces/index';
import { ListItem, ListItemText, ListItemSecondaryAction, IconButton } from 'material-ui';
import { Delete as DeleteIcon } from 'material-ui-icons';

interface Props {
  slot: Slot;
  delete(): void;
}

const SlotListItem: React.SFC<Props & WithStyles> = (props) => (
  <ListItem>
    <ListItemText
      primary={props.slot.get('teacher').get('username')}
      secondary={`${props.slot.get('hour_from')} - ${props.slot.get('hour_to')}`}
    />
    <ListItemSecondaryAction>
      <IconButton aria-label="Delete" onClick={props.delete}>
        <DeleteIcon />
      </IconButton>
    </ListItemSecondaryAction>
  </ListItem>
);

export default withStyles(styles)(SlotListItem);
