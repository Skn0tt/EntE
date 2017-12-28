import * as React from 'react';
import withStyles, { WithStyles } from 'material-ui/styles/withStyles';
import { connect, Dispatch } from 'react-redux';
import { Table, TableRow, TableHead, TableCell, TableBody, Paper } from 'material-ui';
import styles from './styles';

import * as select from '../../redux/selectors';
import { Entry, AppState } from '../../interfaces/index';
import { Action } from 'redux';

import { getEntriesRequest } from '../../redux/actions';
import { Route } from 'react-router';

interface Props extends WithStyles {
  entries: Entry[];
  getEntries(): Action;
}

const EntryRow = (entry: Entry) => (
  <Route
    render={({ history }) => (
      <TableRow
        key={entry.get('_id')}
        onClick={() => history.push(`/entries/${entry.get('_id')}`)}
      >
        <TableCell>{entry.getIn(['student', 'username'])}</TableCell>
        <TableCell>{entry.get('date').toDateString()}</TableCell>
        <TableCell>{entry.get('forSchool') ? 'Ja' : 'Nein'}</TableCell>
      </TableRow>
    )}
  />
  
);

const Entries: React.SFC<Props> = (props) => (
  <Paper>
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>Username</TableCell>
          <TableCell>Datum</TableCell>
          <TableCell>Schulisch</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {props.entries.map(entry => EntryRow(entry))}
      </TableBody>
    </Table>
  </Paper>
);

const mapStateToProps = (state: AppState) => ({
  entries: select.getEntries(state),
});

const mapDispatchToProps = (dispatch: Dispatch<Action>) => ({
  getEntries: () => dispatch(getEntriesRequest()),
});

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(Entries));
