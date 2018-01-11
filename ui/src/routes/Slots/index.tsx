import * as React from 'react';
import withStyles, { WithStyles } from 'material-ui/styles/withStyles';
import { connect } from 'react-redux';
import {
  Table,
  TableRow,
  TableHead,
  TableCell,
  TableBody,
  Grid,
  TextField,
} from 'material-ui';
import styles from './styles';

import * as select from '../../redux/selectors';
import { AppState, Slot, MongoId, User } from '../../interfaces/index';
import SignedAvatar from '../SpecificEntry/elements/SignedAvatar';
import UnsignedAvatar from '../SpecificEntry/elements/UnsignedAvatar';

import { Route } from 'react-router';

interface StateProps {
  slots: Slot[];
  getUser(id: MongoId): User;
}

const mapStateToProps = (state: AppState) => ({
  slots: select.getSlots(state),
  getUser: (id: MongoId) => select.getUser(id)(state),
});

interface State {
  searchTerm: string;
}

type Props = StateProps & WithStyles;

const Slots =
  connect(mapStateToProps)(
  withStyles(styles)(
class extends React.Component<Props, State> {
  state: State = {
    searchTerm: '',
  };

  handleChangeSearch = (event: React.ChangeEvent<HTMLInputElement>) =>
    this.setState({ searchTerm: event.target.value })
  
  filter = (slot: Slot): boolean => (
    this.props.getUser(slot.get('student'))
      .get('displayname').toLocaleLowerCase().includes(this.state.searchTerm.toLocaleLowerCase()) ||
    this.props.getUser(slot.get('teacher'))
      .get('displayname').toLocaleLowerCase().includes(this.state.searchTerm.toLocaleLowerCase()) ||
    this.props.getUser(slot.get('teacher'))
      .get('email').toLocaleLowerCase().includes(this.state.searchTerm.toLocaleLowerCase()) ||
    this.props.getUser(slot.get('student'))
      .get('email').toLocaleLowerCase().includes(this.state.searchTerm.toLocaleLowerCase())
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
                <TableCell>Name</TableCell>
                <TableCell>Datum</TableCell>
                <TableCell>Von</TableCell>
                <TableCell>Bis</TableCell>
                <TableCell>Signiert</TableCell>
                <TableCell>Lehrer</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {this.props.slots.filter(this.filter).map(slot => (
                <Route
                  render={({ history }) => (
                    <TableRow
                      key={slot.get('_id')}
                    >
                      <TableCell>{
                        this.props.getUser(slot.get('student')).get('displayname')
                      }</TableCell>
                      <TableCell>{slot.get('date').toDateString()}</TableCell>
                      <TableCell>{slot.get('hour_from')}</TableCell>
                      <TableCell>{slot.get('hour_to')}</TableCell>
                      <TableCell>{
                        slot.get('signed')
                          ? <SignedAvatar />
                          : <UnsignedAvatar />
                      }</TableCell>
                      <TableCell>{
                        this.props.getUser(slot.get('teacher')).get('displayname')
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

export default Slots;
