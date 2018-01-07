import * as React from 'react';
import withStyles, { WithStyles } from 'material-ui/styles/withStyles';
import { connect } from 'react-redux';

import styles from './styles';

import * as select from '../../redux/selectors';
import { User, AppState } from '../../interfaces/index';
import { Table, TableRow, TableHead, TableBody, TableCell, Grid, TextField } from 'material-ui';
import { Route } from 'react-router';

interface StateProps {
  users: User[];
}

const mapStateToProps = (state: AppState) => ({
  users: select.getUsers(state),
});

interface State {
  searchTerm: string;
}

type Props = StateProps & WithStyles;

const Users =
  connect(mapStateToProps)(
  withStyles(styles)(
class extends React.Component<Props, State> {
  state: State = {
    searchTerm: '',
  };

  handleChangeSearch = (event: React.ChangeEvent<HTMLInputElement>) =>
    this.setState({ searchTerm: event.target.value })

  filter = (user: User): boolean => (
    user.get('displayname').toLocaleLowerCase()
      .includes(this.state.searchTerm.toLocaleLowerCase()) ||
    user.get('email').toLocaleLowerCase()
      .includes(this.state.searchTerm.toLocaleLowerCase()) ||
    user.get('username').toLocaleLowerCase()
      .includes(this.state.searchTerm.toLocaleLowerCase()) ||
    user.get('role').toLocaleLowerCase()
      .includes(this.state.searchTerm.toLocaleLowerCase())
  )

  render() {
    const { classes } = this.props;
    
    return (
      <Grid container direction="column">
        <Grid item container direction="row">
          <Grid item xs={12}>
            <TextField
              placeholder="Suchen"
              fullWidth
              className={classes.searchBar}
              onChange={this.handleChangeSearch}
            />
          </Grid>
        </Grid>
        <Grid item>
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
              {this.props.users.filter(this.filter).map(user => (
                <Route
                  key={user.get('_id')}
                  render={({ history }) => (
                    <TableRow
                      onClick={() => history.push(`users/${user.get('_id')}`)}
                      hover={true}
                    >
                      <TableCell>{user.get('username')}</TableCell>
                      <TableCell>{user.get('displayname')}</TableCell>
                      <TableCell>{user.get('email')}</TableCell>
                      <TableCell>{user.get('role')}</TableCell>
                    </TableRow>
                  )}
                />
              ))}
            </TableBody>
          </Table>
        </Grid>
      </Grid>
    );
  }
}));

export default Users;
