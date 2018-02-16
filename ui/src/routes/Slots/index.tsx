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
  TextField,
  Tooltip,
  TableSortLabel,
} from 'material-ui';
import styles from './styles';

import * as select from '../../redux/selectors';
import { AppState, Slot, MongoId, User, ISlot } from '../../interfaces/index';
import SignedAvatar from '../SpecificEntry/elements/SignedAvatar';
import UnsignedAvatar from '../SpecificEntry/elements/UnsignedAvatar';

import { Route } from 'react-router';
import { getSlotsRequest } from '../../redux/actions';
import { Action } from 'redux';

interface StateProps {
  slots: Slot[];
  getUser(id: MongoId): User;
}
const mapStateToProps = (state: AppState) => ({
  slots: select.getSlots(state),
  getUser: (id: MongoId) => select.getUser(id)(state),
});

interface DispatchProps {
  getSlots(): Action;
}
const mapDispatchToProps = (dispatch: Dispatch<Action>) => ({
  getSlots: () => dispatch(getSlotsRequest()),
});

type Props = StateProps & DispatchProps & WithStyles;

type Rows = keyof ISlot | 'name';
interface State {
  searchTerm: string;
  sortField: Rows;
  sortUp: boolean;
}

const Slots = connect(mapStateToProps, mapDispatchToProps)(
  withStyles(styles)(
    class extends React.Component<Props, State> {
      state: State = {
        searchTerm: '',
        sortField: 'date',
        sortUp: true,
      };

      componentDidMount() {
        this.props.getSlots();
      }

      sort = (a: Slot, b: Slot): number => {
        if (this.state.sortField === 'date') {
          return (a.get('date').getTime() - b.get('date').getTime()) * (this.state.sortUp ? 1 : -1);
        }
        if (this.state.sortField === 'name') {
          return (
            this.props
              .getUser(a.get('student'))
              .get('displayname')
              .localeCompare(this.props.getUser(b.get('student')).get('displayname')) *
            (this.state.sortUp ? 1 : -1)
          );
        }
        if (this.state.sortField === 'teacher') {
          return (
            this.props
              .getUser(a.get('teacher'))
              .get('displayname')
              .localeCompare(this.props.getUser(b.get('teacher')).get('displayname')) *
            (this.state.sortUp ? 1 : -1)
          );
        }
        return (
          a
            .get(this.state.sortField)
            .toString()
            .localeCompare(b.get(this.state.sortField).toString()) * (this.state.sortUp ? 1 : -1)
        );
      };

      handleChangeSearch = (event: React.ChangeEvent<HTMLInputElement>) =>
        this.setState({ searchTerm: event.target.value });

      filter = (slot: Slot): boolean =>
        this.props
          .getUser(slot.get('student'))
          .get('displayname')
          .toLocaleLowerCase()
          .includes(this.state.searchTerm.toLocaleLowerCase()) ||
        this.props
          .getUser(slot.get('teacher'))
          .get('displayname')
          .toLocaleLowerCase()
          .includes(this.state.searchTerm.toLocaleLowerCase()) ||
        this.props
          .getUser(slot.get('teacher'))
          .get('email')
          .toLocaleLowerCase()
          .includes(this.state.searchTerm.toLocaleLowerCase()) ||
        this.props
          .getUser(slot.get('student'))
          .get('email')
          .toLocaleLowerCase()
          .includes(this.state.searchTerm.toLocaleLowerCase());

      TableHeadCell: React.SFC<{ field: Rows }> = props => (
        <TableCell>
          <Tooltip title="Sort" enterDelay={300}>
            <TableSortLabel
              active={this.state.sortField === props.field}
              direction={this.state.sortUp ? 'asc' : 'desc'}
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
      );

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
                    <this.TableHeadCell field="hour_from">Von</this.TableHeadCell>
                    <this.TableHeadCell field="hour_to">Bis</this.TableHeadCell>
                    <this.TableHeadCell field="signed">Signiert</this.TableHeadCell>
                    <this.TableHeadCell field="teacher">Lehrer</this.TableHeadCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {this.props.slots
                    .filter(this.filter)
                    .sort(this.sort)
                    .map(slot => (
                      <Route
                        render={({ history }) => (
                          <TableRow key={slot.get('_id')}>
                            <TableCell>
                              {this.props.getUser(slot.get('student')).get('displayname')}
                            </TableCell>
                            <TableCell>{slot.get('date').toDateString()}</TableCell>
                            <TableCell>{slot.get('hour_from')}</TableCell>
                            <TableCell>{slot.get('hour_to')}</TableCell>
                            <TableCell>
                              {slot.get('signed') ? <SignedAvatar /> : <UnsignedAvatar />}
                            </TableCell>
                            <TableCell>
                              {this.props.getUser(slot.get('teacher')).get('displayname')}
                            </TableCell>
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
    },
  ),
);

export default Slots;
