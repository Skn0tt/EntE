import * as React from 'react';
import withStyles, { WithStyles } from 'material-ui/styles/withStyles';
import { connect, Dispatch } from 'react-redux';

import styles from './styles';

import * as select from '../../redux/selectors';
import { User, AppState } from '../../interfaces/index';
import { Action } from 'redux';
import { Paper, Table, TableRow, TableHead, TableBody, TableCell } from 'material-ui';

interface Props extends WithStyles {
  users: User[];
}

const UserRow = (user: User) => (
  <TableRow key={user.get('_id')}>
    <TableCell>{user.get('username')}</TableCell>
    <TableCell>{user.get('displayname')}</TableCell>
    <TableCell>{user.get('email')}</TableCell>
    <TableCell>{user.get('role')}</TableCell>
  </TableRow>
);

const Users: React.SFC<Props> = (props) => (
  <Paper>
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>Username</TableCell>
          <TableCell>Name</TableCell>
          <TableCell>Email</TableCell>
          <TableCell>Role</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {props.users.map(user => UserRow(user))}
      </TableBody>
    </Table>
  </Paper>
);

const mapStateToProps = (state: AppState) => ({
  users: select.getUsers(state),
});

const mapDispatchToProps = (dispatch: Dispatch<Action>) => ({

});

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(Users));
