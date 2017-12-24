import * as React from 'react';
import styles from './styles';
import withStyles, { WithStyles } from 'material-ui/styles/withStyles';
import {
  ListItem as MUIListItem,
  ListItemText as MUIListItemText,

} from 'material-ui';

interface Props extends Partial<WithStyles> {
  id: string;
}

const ListItem: React.SFC<Props> = (props) => (
  <MUIListItem>
    <MUIListItemText primary={props.id}/>
  </MUIListItem>
);

export default withStyles(styles)(ListItem);
