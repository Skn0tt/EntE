import * as React from 'react';
import withStyles, { WithStyles } from 'material-ui/styles/withStyles';
import { connect, Dispatch } from 'react-redux';
import { Table, TableRow, TableHead, TableCell, TableBody, Grid } from 'material-ui';
import styles from './styles';

import * as select from '../../redux/selectors';
import { Entry, AppState, MongoId, User } from '../../interfaces/index';
import { Action } from 'redux';
import SignedAvatar from '../SpecificEntry/elements/SignedAvatar';
import UnsignedAvatar from '../SpecificEntry/elements/UnsignedAvatar';

import { getEntriesRequest } from '../../redux/actions';
import { Route } from 'react-router';
import TextField from 'material-ui/TextField/TextField';

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

const Entries =
  connect(mapStateToProps, mapDispatchToProps)(
  withStyles(styles)(
class extends React.Component<Props, State> {
  state: State = {
    searchTerm: '',
  };

  filter = (entry: Entry): boolean =>
    this.props
      .getUser(entry.get('student'))
      .get('displayname').toLocaleLowerCase()
      .includes(this.state.searchTerm.toLocaleLowerCase())

  handleChangeSearch = (event: React.ChangeEvent<HTMLInputElement>) =>
    this.setState({ searchTerm: event.target.value })

  render() {
    const { classes } = this.props;

    return (
        <Grid container direction="column" spacing={8}>
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
                  <TableCell>Name</TableCell>
                  <TableCell>Datum</TableCell>
                  <TableCell>Schulisch</TableCell>
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
                        hover={true}
                      >
                        <TableCell>{
                          this.props
                            .getUser(entry.get('student'))
                            .get('displayname')
                          }</TableCell>
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
          </Grid>
        </Grid>
    );
  }
}));

export default Entries;
