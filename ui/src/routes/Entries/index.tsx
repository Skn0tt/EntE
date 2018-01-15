import * as React from 'react';
import withStyles, { WithStyles } from 'material-ui/styles/withStyles';
import { connect, Dispatch } from 'react-redux';
import { Table, TableRow, TableHead, TableCell, TableBody, Grid } from 'material-ui';
import styles from './styles';
import { Add as AddIcon } from 'material-ui-icons';

import * as select from '../../redux/selectors';
import { Entry, AppState, MongoId, User } from '../../interfaces/index';
import { Action } from 'redux';
import SignedAvatar from '../SpecificEntry/elements/SignedAvatar';
import UnsignedAvatar from '../SpecificEntry/elements/UnsignedAvatar';

import { getEntriesRequest } from '../../redux/actions';
import { Route } from 'react-router';
import TextField from 'material-ui/TextField/TextField';
import Button from 'material-ui/Button/Button';

interface StateProps {
  entries: Entry[];
  getUser(id: MongoId): User;
}

interface DispatchProps {
  getEntries(): Action;
}

interface State {
  searchTerm: string;
}

const mapStateToProps = (state: AppState) => ({
  entries: select.getEntries(state),
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
  };

  filter = (entry: Entry): boolean => (
    this.props.getUser(entry.get('student'))
      .get('displayname').toLocaleLowerCase().includes(this.state.searchTerm.toLocaleLowerCase()) ||
    this.props.getUser(entry.get('student'))
      .get('email').toLocaleLowerCase().includes(this.state.searchTerm.toLocaleLowerCase())
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
                <TableCell>Name</TableCell>
                <TableCell>Datum</TableCell>
                <TableCell>Schulisch</TableCell>
                <TableCell>Begründung</TableCell>
                <TableCell>Admin</TableCell>
                <TableCell>Eltern</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {this.props.entries.filter(this.filter).map(entry => (
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
      </Grid>
    );
  }
}));

export default Entries;
