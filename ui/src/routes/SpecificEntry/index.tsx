import * as React from 'react';
import withStyles, { WithStyles } from 'material-ui/styles/withStyles';
import { connect, Dispatch } from 'react-redux';
import styles from './styles';

import * as select from '../../redux/selectors';
import { AppState, MongoId, Entry, User, Slot, Roles } from '../../interfaces/index';
import { Action } from 'redux';

import { withRouter, RouteComponentProps } from 'react-router';
import { Button, Table, List, Grid, CircularProgress } from 'material-ui';
import { getEntryRequest, signEntryRequest } from '../../redux/actions';
import SignedAvatar from './elements/SignedAvatar';
import UnsignedAvatar from './elements/UnsignedAvatar';
import TableHead from 'material-ui/Table/TableHead';
import TableCell from 'material-ui/Table/TableCell';
import TableRow from 'material-ui/Table/TableRow';
import TableBody from 'material-ui/Table/TableBody';
import Dialog from 'material-ui/Dialog/Dialog';
import DialogContent from 'material-ui/Dialog/DialogContent';
import DialogActions from 'material-ui/Dialog/DialogActions';
import DialogContentText from 'material-ui/Dialog/DialogContentText';
import Typography from 'material-ui/Typography/Typography';
import ListItem from 'material-ui/List/ListItem';
import ListItemText from 'material-ui/List/ListItemText';
import ListItemSecondaryAction from 'material-ui/List/ListItemSecondaryAction';
import { AssignmentTurnedIn as AssignmentTurnedInIcon } from 'material-ui-icons';
import withMobileDialog from 'material-ui/Dialog/withMobileDialog';
import lang from '../../res/lang';

interface RouteMatch {
  entryId: MongoId;
}

interface InjectedProps {
  fullScreen: boolean;
}

interface StateProps {
  getEntry(id: MongoId): Entry;
  getUser(id: MongoId): User;
  getSlots(ids: MongoId[]): Slot[];
  loading: boolean;
  role: Roles;
}
const mapStateToProps = (state: AppState) => ({
  getEntry: (id: MongoId) => select.getEntry(id)(state),
  getUser: (id: MongoId) => select.getUser(id)(state),
  getSlots: (ids: MongoId[]) => select.getSlotsById(ids)(state),
  loading: select.isLoading(state),
  role: select.getRole(state),
});

interface DispatchProps {
  requestEntry(id: MongoId): Action;
  signEntry(id: MongoId): Action;
}
const mapDispatchToProps = (dispatch: Dispatch<Action>) => ({
  requestEntry: (id: MongoId) => dispatch(getEntryRequest(id)),
  signEntry: (id: MongoId) => dispatch(signEntryRequest(id)),
});

type Props = WithStyles &
  RouteComponentProps<RouteMatch> &
  InjectedProps &
  StateProps &
  DispatchProps;

const SpecificEntry = withRouter(
  connect(mapStateToProps, mapDispatchToProps)(
    withStyles(styles)(
      withMobileDialog<Props>()(
        class extends React.Component<Props> {
          componentDidMount() {
            const { entryId } = this.props.match.params;
            const user = this.props.getUser(entryId);

            if (!user) {
              this.props.requestEntry(entryId);
            }
          }

          onClose = () => this.props.history.push('/entries');

          render() {
            const { props } = this;
            const { classes, loading } = this.props;
            const { entryId } = this.props.match.params;
            const entry = this.props.getEntry(entryId);

            return (
              <Dialog open fullScreen={props.fullScreen} onClose={this.onClose}>
                <DialogContent>
                  {!!entry ? (
                    <Grid container direction="column">
                      {/* ID */}
                      <Grid item>
                        <DialogContentText>
                          ID: {entry.get('_id')} <br />
                        </DialogContentText>
                      </Grid>

                      <Grid item>
                        <Typography variant="title">Info</Typography>
                        <Typography variant="body1">
                          <i>Erstellt:</i> {entry.get('createdAt').toLocaleDateString()} <br />
                          <i>Begründung:</i> {entry.get('reason') || '-'} <br />
                          <i>Schulisch:</i> {entry.get('forSchool') ? 'Ja' : 'Nein'} <br />
                          <i>Schüler:</i> {props.getUser(entry.get('student')).get('displayname')}{' '}
                          <br />
                          <i>Datum:</i>{' '}
                          {entry.get('dateEnd')
                            ? `Von ${entry.get('date').toLocaleDateString()}
                      bis ${entry.get('dateEnd')!.toLocaleDateString()}`
                            : entry.get('date').toLocaleDateString()}{' '}
                          <br />
                        </Typography>
                      </Grid>

                      {/* Slots */}
                      <Grid item>
                        <Typography variant="title">Stunden</Typography>
                        <Table>
                          <TableHead>
                            <TableRow>
                              <TableCell>Von</TableCell>
                              <TableCell>Bis</TableCell>
                              <TableCell>Lehrer</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {props.getSlots(entry.get('slots')).map(slot => (
                              <TableRow key={slot.get('_id')}>
                                <TableCell>{slot.get('hour_from')}</TableCell>
                                <TableCell>{slot.get('hour_to')}</TableCell>
                                <TableCell>
                                  {props.getUser(slot.get('teacher')).get('displayname')}
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </Grid>

                      {/* Signed */}
                      <Grid item>
                        <Typography variant="title">Signiert</Typography>
                        <List>
                          {/* Admin */}
                          <ListItem>
                            {entry.get('signedManager') ? <SignedAvatar /> : <UnsignedAvatar />}
                            <ListItemText primary="Stufenleiter" />
                            {!entry.get('signedManager') &&
                              props.role === Roles.MANAGER && (
                                <ListItemSecondaryAction>
                                  <Button
                                    className={classes.signEntryButton}
                                    onClick={() => props.signEntry(entry.get('_id'))}
                                  >
                                    {lang().ui.specificEntry.sign}
                                    <AssignmentTurnedInIcon />
                                  </Button>
                                </ListItemSecondaryAction>
                              )}
                          </ListItem>
                          {/* Parents */}
                          <ListItem>
                            {entry.get('signedParent') ? <SignedAvatar /> : <UnsignedAvatar />}
                            <ListItemText primary="Eltern" />
                            {!entry.get('signedParent') &&
                              props.role === Roles.PARENT && (
                                <ListItemSecondaryAction>
                                  <Button
                                    className={classes.signEntryButton}
                                    onClick={() => props.signEntry(entry.get('_id'))}
                                  >
                                    {lang().ui.specificEntry.sign}
                                    <AssignmentTurnedInIcon />
                                  </Button>
                                </ListItemSecondaryAction>
                              )}
                          </ListItem>
                        </List>
                      </Grid>
                    </Grid>
                  ) : (
                    loading && <CircularProgress />
                  )}
                </DialogContent>

                <DialogActions>
                  <Button size="small" color="primary" onClick={this.onClose}>
                    Schließen
                  </Button>
                </DialogActions>
              </Dialog>
            );
          }
        },
      ),
    ),
  ),
);

export default SpecificEntry;
