import * as React from 'react';
import withStyles, { WithStyles } from 'material-ui/styles/withStyles';
import { connect, Dispatch } from 'react-redux';
import styles from './styles';

import * as select from '../../redux/selectors';
import { AppState, MongoId, Entry, User, Slot } from '../../interfaces/index';
import { Action } from 'redux';

import { withRouter, RouteComponentProps } from 'react-router';
import Modal from '../../components/Modal';
import { Card, CardContent, Typography, CardActions, Button, List } from 'material-ui';
import ListItem from 'material-ui/List/ListItem';
import ListItemText from 'material-ui/List/ListItemText';
import { getEntryRequest } from '../../redux/actions';

interface RouteMatch {
  entryId: MongoId;
}

interface Props extends WithStyles, RouteComponentProps<RouteMatch> {
  getEntry(id: MongoId): Entry;
  getUser(id: MongoId): User;
  getSlots(ids: MongoId[]): Slot[];
  requestEntry(id: MongoId): Action;
}

const SpecificEntry: React.SFC<Props> = (props) => {
  const { entryId } = props.match.params;
  const entry = props.getEntry(entryId);
  
  if (!entry) props.requestEntry(entryId);

  return !!entry ? (
    <Modal
      onClose={() => props.history.goBack()}
    >
      <Card>
        <CardContent>
          <Typography type="headline" component="h2">
            {entry.get('_id')}
          </Typography>
          <Typography component="p">
            {props.getUser(entry.get('student')).get('displayname')}
          </Typography>
          <List>
            {props.getSlots(entry.get('slots')).map(slot => (
              <ListItem
                key={slot.get('_id')}
              >
                <ListItemText primary={slot.get('hour_from')}/>
                <ListItemText primary={slot.get('hour_to')}/>
                <ListItemText primary={props.getUser(slot.get('teacher')).get('displayname')}/>
              </ListItem>
            ))}
          </List>
        </CardContent>
        <CardActions>
          <Button
            dense={true}
            color="primary"
            onClick={() => props.history.goBack()}
          >
            Close
          </Button>
        </CardActions>
      </Card>
    </Modal>
  ) : null;
};

const mapStateToProps = (state: AppState) => ({
  getEntry: (id: MongoId) => select.getEntry(id)(state),
  getUser: (id: MongoId) => select.getUser(id)(state),
  getSlots: (ids: MongoId[]) => select.getSlotsById(ids)(state),
});

const mapDispatchToProps = (dispatch: Dispatch<Action>) => ({
  requestEntry: (id: MongoId) => dispatch(getEntryRequest(id)),
});

export default
  withRouter(
  connect(mapStateToProps, mapDispatchToProps)(
  withStyles(styles)(
    SpecificEntry,
  )));
