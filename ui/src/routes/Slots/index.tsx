import * as React from 'react';
import withStyles, { WithStyles } from 'material-ui/styles/withStyles';
import { connect, Dispatch } from 'react-redux';
import { Table, TableRow, TableHead, TableCell, TableBody, Paper } from 'material-ui';
import styles from './styles';

import * as select from '../../redux/selectors';
import { AppState, Slot } from '../../interfaces/index';
import { Action } from 'redux';

import { Route } from 'react-router';

interface Props extends WithStyles {
  slots: Slot[];
}

const SlotRow = (slot: Slot) => (
  <Route
    render={({ history }) => (
      <TableRow
        key={slot.get('_id')}
        onClick={() => history.push(`/slots/${slot.get('_id')}`)}
      >
        <TableCell>{slot.getIn(['student', 'username'])}</TableCell>
        <TableCell>{slot.get('date').toDateString()}</TableCell>
      </TableRow>
    )}
  />
  
);

const Slots: React.SFC<Props> = (props) => (
  <Paper>
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>Username</TableCell>
          <TableCell>Datum</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {props.slots.map(slot => SlotRow(slot))}
      </TableBody>
    </Table>
  </Paper>
);

const mapStateToProps = (state: AppState) => ({
  slots: select.getSlots(state),
});

const mapDispatchToProps = (dispatch: Dispatch<Action>) => ({});

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(Slots));
