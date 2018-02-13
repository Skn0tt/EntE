import * as React from 'react';
import withStyles, { WithStyles } from 'material-ui/styles/withStyles';
import { connect } from 'react-redux';

import styles from './styles';

import * as select from '../../redux/selectors';
import { User, AppState, IUser } from '../../interfaces/index';
import {
  Table,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
  Grid,
  TextField,
  Button,
  Tooltip,
  TableSortLabel,
} from 'material-ui';
import { Add as AddIcon } from 'material-ui-icons';
import { Route } from 'react-router';

interface StateProps {
  users: User[];
}

const mapStateToProps = (state: AppState) => ({
  users: select.getUsers(state),
});

interface State {
  searchTerm: string;
  sortField: keyof IUser;
  sortUp: boolean;
}

type Props = StateProps & WithStyles;

const Users =
  connect(mapStateToProps)(
  withStyles(styles)(
class extends React.Component<Props, State> {
  state: State = {
    searchTerm: '',
    sortField: 'username',
    sortUp: false,
  };

  sort = (a: User, b: User): number =>
    a.get(this.state.sortField).toString()
      .localeCompare(
        b.get(this.state.sortField).toString(),
      )
    * (this.state.sortUp ? 1 : -1)

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

  TableHeadCell: React.SFC<{ field: keyof IUser }> = props => (
    <TableCell>
      <Tooltip
        title="Sort"
        enterDelay={300}
      >
        <TableSortLabel
          active={this.state.sortField === props.field}
          direction={this.state.sortUp ? 'asc' : 'desc' }
          onClick={() => {
            if (this.state.sortField !== props.field) {
              return this.setState({ sortField: props.field, sortUp: true });
            }
            return this.setState({ sortUp: !this.state.sortUp });
          }}
        >
          {props.children}
        </TableSortLabel>
      </Tooltip>
    </TableCell>
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
        <Grid item className={classes.table}>
          <Table>
            <TableHead>
              <TableRow>
                <this.TableHeadCell field="username">Username</this.TableHeadCell>
                <this.TableHeadCell field="displayname">Name</this.TableHeadCell>
                <this.TableHeadCell field="email">Email</this.TableHeadCell>
                <this.TableHeadCell field="role">Role</this.TableHeadCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {this.props.users.filter(this.filter).sort(this.sort).map(user => (
                <Route
                  key={user.get('_id')}
                  render={({ history }) => (
                    <TableRow
                      onClick={() => history.push(`users/${user.get('_id')}`)}
                      hover
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
        <Route render={({ history }) => (
          <Button
            color="primary"
            variant="fab"
            onClick={() => history.push('/createUser')}
            className={classes.fab}
          >
            <AddIcon />
          </Button>
        )}/>
      </Grid>
    );
  }
}));

export default Users;
