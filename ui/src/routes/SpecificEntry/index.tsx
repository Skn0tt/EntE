import * as React from 'react';
import withStyles, { WithStyles } from 'material-ui/styles/withStyles';
import { connect, Dispatch } from 'react-redux';
import styles from './styles';

import * as select from '../../redux/selectors';
import { AppState, MongoId, Entry, User, Slot, Roles } from '../../interfaces/index';
import { Action } from 'redux';

import { withRouter, RouteComponentProps } from 'react-router';
import { Button, Table, List } from 'material-ui';
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

interface RouteMatch {
  entryId: MongoId;
}

interface InjectedProps {
  fullScreen: boolean;
}

interface Props extends WithStyles, RouteComponentProps<RouteMatch>, InjectedProps {
  getEntry(id: MongoId): Entry;
  getUser(id: MongoId): User;
  getSlots(ids: MongoId[]): Slot[];
  requestEntry(id: MongoId): Action;
  signEntry(id: MongoId): Action;
  role: Roles;
}

const SpecificEntry: React.SFC<Props> = (props) => {
  const { classes } = props;
  const { entryId } = props.match.params;
  const entry = props.getEntry(entryId);
  
  if (!entry) return null;

  return (
    <Dialog
      open={true}
      fullScreen={props.fullScreen}
      onClose={() => props.history.goBack()}
    >
      <DialogContent>
        <DialogContentText>
          ID: {entry.get('_id')}
        </DialogContentText>
        {/* Slots */}
        <Typography type="title">
          Stunden
        </Typography>
        <Table>
          <TableHead>
            <TableCell>Von</TableCell>
            <TableCell>Bis</TableCell>
            <TableCell>Lehrer</TableCell>
          </TableHead>
          <TableBody>
            {props.getSlots(entry.get('slots')).map(slot => (
              <TableRow
                key={slot.get('_id')}
              >
                <TableCell>{slot.get('hour_from')}</TableCell>
                <TableCell>{slot.get('hour_to')}</TableCell>
                <TableCell>{props.getUser(slot.get('teacher')).get('displayname')}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {/* Signed */}
        <Typography type="title">
          Signiert
        </Typography>
        <List>
          {/* Admin */}
          <ListItem>
            {entry.get('signedAdmin') ?
              <SignedAvatar />
              : <UnsignedAvatar />
            }
            <ListItemText primary="Admin" />
            {!entry.get('signedAdmin') &&
              props.role === Roles.ADMIN && (
              <ListItemSecondaryAction>
                <Button
                  className={classes.signEntryButton}
                  onClick={() => props.signEntry(entry.get('_id'))}
                >
                  Sign
                  <AssignmentTurnedInIcon />
                </Button>
              </ListItemSecondaryAction>
            )}
          </ListItem>
          {/* Parents */}
          <ListItem>
            {entry.get('signedParent') ?
              <SignedAvatar />
              : <UnsignedAvatar />
            }
            <ListItemText primary="Eltern" />
            {!entry.get('signedParent') &&
              props.role === Roles.PARENT && (
              <ListItemSecondaryAction>
                <Button
                  className={classes.signEntryButton}
                  onClick={() => props.signEntry(entry.get('_id'))}
                >
                  Sign
                  <AssignmentTurnedInIcon />
                </Button>
              </ListItemSecondaryAction>
            )}
          </ListItem>
        </List>
      </DialogContent>
      <DialogActions>
        <Button
          dense={true}
          color="primary"
          onClick={() => props.history.goBack()}
        >
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const mapStateToProps = (state: AppState) => ({
  getEntry: (id: MongoId) => select.getEntry(id)(state),
  getUser: (id: MongoId) => select.getUser(id)(state),
  getSlots: (ids: MongoId[]) => select.getSlotsById(ids)(state),
  role: select.getRole(state),
});

const mapDispatchToProps = (dispatch: Dispatch<Action>) => ({
  requestEntry: (id: MongoId) => dispatch(getEntryRequest(id)),
  signEntry: (id: MongoId) => dispatch(signEntryRequest(id)),
});

export default
  withRouter(
  connect(mapStateToProps, mapDispatchToProps)(
  withStyles(styles)(
  withMobileDialog<Props>()(
    SpecificEntry,
  ))));
