import * as React from 'react';
import withStyles, { WithStyles } from 'material-ui/styles/withStyles';
import { connect, Dispatch } from 'react-redux';
import { Table, TableRow, TableHead, TableCell, TableBody, Paper } from 'material-ui';
import styles from './styles';

import * as select from '../../redux/selectors';
import { AppState, Slot, MongoId, User } from '../../interfaces/index';
import { Action } from 'redux';

import { Route } from 'react-router';

interface Props extends WithStyles {
  slots: Slot[];
  getUser(id: MongoId): User;
}

const SlotRow = (slot: Slot, props: Props) => (
  <Route
    render={({ history }) => (
      <TableRow
        key={slot.get('_id')}
      >
        <TableCell>{props.getUser(slot.get('student')).get('displayname')}</TableCell>
        <TableCell>{slot.get('date').toDateString()}</TableCell>
        <TableCell>{slot.get('hour_from')}</TableCell>
        <TableCell>{slot.get('hour_to')}</TableCell>
        <TableCell>{props.getUser(slot.get('teacher')).get('displayname')}</TableCell>
      </TableRow>
    )}
  />
  
);

const Slots: React.SFC<Props> = props => (
  <Paper>
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>Name</TableCell>
          <TableCell>Datum</TableCell>
          <TableCell>Von</TableCell>
          <TableCell>Bis</TableCell>
          <TableCell>Lehrer</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {props.slots.map(slot => SlotRow(slot, props))}
      </TableBody>
    </Table>
  </Paper>
);

const mapStateToProps = (state: AppState) => ({
  slots: select.getSlots(state),
  getUser: (id: MongoId) => select.getUser(id)(state),
});

const mapDispatchToProps = (dispatch: Dispatch<Action>) => ({});

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(Slots));
