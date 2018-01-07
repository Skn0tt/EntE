import * as React from 'react';
import withStyles, { WithStyles } from 'material-ui/styles/withStyles';
import { connect, Dispatch } from 'react-redux';
import { Table, TableRow, TableHead, TableCell, TableBody, Paper } from 'material-ui';
import styles from './styles';

import * as select from '../../redux/selectors';
import { Entry, AppState, MongoId, User } from '../../interfaces/index';
import { Action } from 'redux';
import SignedAvatar from '../SpecificEntry/elements/SignedAvatar';
import UnsignedAvatar from '../SpecificEntry/elements/UnsignedAvatar';

import { getEntriesRequest } from '../../redux/actions';
import { Route } from 'react-router';

interface Props extends WithStyles {
  entries: Entry[];
  getEntries(): Action;
  getUser(id: MongoId): User;
}

const Entries: React.SFC<Props> = props => (
  <Paper>
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>Name</TableCell>
          <TableCell>Datum</TableCell>
          <TableCell>Schulisch</TableCell>
          <TableCell>Admin</TableCell>
          <TableCell>Eltern</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {props.entries.map(entry => (
          <Route
            key={entry.get('_id')}
            render={({ history }) => (
              <TableRow
                onClick={() => history.push(`/entries/${entry.get('_id')}`)}
                hover={true}
              >
                <TableCell>{props.getUser(entry.get('student')).get('displayname')}</TableCell>
                <TableCell>{entry.get('date').toDateString()}</TableCell>
                <TableCell>{entry.get('forSchool') ? 'Ja' : 'Nein'}</TableCell>
                <TableCell>{entry.get('signedAdmin')
                  ? <SignedAvatar />
                  : <UnsignedAvatar />
                }</TableCell>
                <TableCell>{entry.get('signedParent')
                  ? <SignedAvatar />
                  : <UnsignedAvatar />
                }</TableCell>
              </TableRow>
            )}
          />
        ))}
      </TableBody>
    </Table>
  </Paper>
);

const mapStateToProps = (state: AppState) => ({
  entries: select.getEntries(state),
  getUser: (id: MongoId) => select.getUser(id)(state),
});

const mapDispatchToProps = (dispatch: Dispatch<Action>) => ({
  getEntries: () => dispatch(getEntriesRequest()),
});

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(Entries));
