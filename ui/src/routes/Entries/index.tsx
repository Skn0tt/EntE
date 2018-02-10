import * as React from 'react';
import withStyles, { WithStyles } from 'material-ui/styles/withStyles';
import { connect, Dispatch } from 'react-redux';
import {
  Table,
  TableRow,
  TableHead,
  TableCell,
  TableBody,
  Grid,
  Tooltip,
  TableSortLabel,
} from 'material-ui';
import styles from './styles';
import { Add as AddIcon } from 'material-ui-icons';

import * as select from '../../redux/selectors';
import { Entry, AppState, MongoId, User, IEntry, Roles } from '../../interfaces/index';
import { Action } from 'redux';
import SignedAvatar from '../SpecificEntry/elements/SignedAvatar';
import UnsignedAvatar from '../SpecificEntry/elements/UnsignedAvatar';

import { getEntriesRequest } from '../../redux/actions';
import { Route } from 'react-router';
import TextField from 'material-ui/TextField/TextField';
import Button from 'material-ui/Button/Button';

interface StateProps {
  entries: Entry[];
  role: Roles;
  getUser(id: MongoId): User;
}

interface DispatchProps {
  getEntries(): Action;
}

type Rows = keyof IEntry | 'name';

interface State {
  searchTerm: string;
  sortField: Rows;
  sortUp: boolean;
}

const mapStateToProps = (state: AppState) => ({
  entries: select.getEntries(state),
  role: select.getRole(state),
  getUser: (id: MongoId) => select.getUser(id)(state),
});

const mapDispatchToProps = (dispatch: Dispatch<Action>) => ({
  getEntries: () => dispatch(getEntriesRequest()),
});

type Props = StateProps & DispatchProps & WithStyles;

const truncate = (str: string, length: number, ending: string) => {
  if (str.length > length) {
    return str.substring(0, length - ending.length) + ending;
  }
  return str;
};

const Entries =
  connect(mapStateToProps, mapDispatchToProps)(
  withStyles(styles)(
class extends React.Component<Props, State> {
  state: State = {
    searchTerm: '',
    sortField: 'date',
    sortUp: true,
  };

  sort = (a: Entry, b: Entry): number => {
    if (this.state.sortField === 'name') {
      return this.props.getUser(a.get('student')).get('displayname').localeCompare(
        this.props.getUser(b.get('student')).get('displayname'),
      ) * (this.state.sortUp ? 1 : -1);
    }
    if (this.state.sortField === 'date') {
      return (a.get('date').getTime() - b.get('date').getTime()) * (this.state.sortUp ? 1 : -1);
    }
    if (this.state.sortField === 'createdAt') {
      return (
        (a.get('createdAt').getTime() - b.get('createdAt').getTime())
          * (this.state.sortUp ? 1 : -1)
      );
    }
    return a.get(this.state.sortField)!.toString().localeCompare(
      b.get(this.state.sortField)!.toString(),
    ) * (this.state.sortUp ? 1 : -1);
  }

  filter = (entry: Entry): boolean => (
    this.props.getUser(entry.get('student'))
      .get('displayname').toLocaleLowerCase().includes(this.state.searchTerm.toLocaleLowerCase()) ||
    this.props.getUser(entry.get('student'))
      .get('email').toLocaleLowerCase().includes(this.state.searchTerm.toLocaleLowerCase())
  )

  TableHeadCell: React.SFC<{ field: Rows }> = props => (
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
    
  handleChangeSearch = (event: React.ChangeEvent<HTMLInputElement>) =>
    this.setState({ searchTerm: event.target.value })

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
                <this.TableHeadCell field="name">Name</this.TableHeadCell>
                <this.TableHeadCell field="date">Datum</this.TableHeadCell>
                <this.TableHeadCell field="createdAt">Erstellt</this.TableHeadCell>
                <this.TableHeadCell field="forSchool">Schulisch</this.TableHeadCell>
                <this.TableHeadCell field="reason">Begründung</this.TableHeadCell>
                <this.TableHeadCell field="signedManager">Stufenleiter</this.TableHeadCell>
                <this.TableHeadCell field="signedParent">Eltern</this.TableHeadCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {this.props.entries.filter(this.filter).sort(this.sort).map(entry => (
                <Route
                  key={entry.get('_id')}
                  render={({ history }) => (
                    <TableRow
                      onClick={() => history.push(`/entries/${entry.get('_id')}`)}
                      hover
                    >
                      <TableCell>{
                        this.props
                          .getUser(entry.get('student'))
                          .get('displayname')
                        }</TableCell>
                      <TableCell>{entry.get('date').toDateString()}</TableCell>
                      <TableCell>{entry.get('createdAt').toDateString()}</TableCell>
                      <TableCell>{entry.get('forSchool') ? 'Ja' : 'Nein'}</TableCell>
                      <TableCell>{truncate(entry.get('reason'), 20, '...')}</TableCell>
                      <TableCell>{entry.get('signedManager')
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
        </Grid>
        {(this.props.role === Roles.PARENT || this.props.role === Roles.STUDENT) &&
          <Route render={({ history }) => (
            <Button
              color="primary"
              fab
              onClick={() => history.push('/createEntry')}
              className={classes.fab}
            >
              <AddIcon />
            </Button>
          )}/>
        }
      </Grid>
    );
  }
}));

export default Entries;
