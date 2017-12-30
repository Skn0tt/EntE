import * as React from 'react';
import withStyles, { WithStyles } from 'material-ui/styles/withStyles';
import { connect, Dispatch } from 'react-redux';
import styles from './styles';

import * as select from '../../redux/selectors';
import { AppState, MongoId, Entry } from '../../interfaces/index';
import { Action } from 'redux';

import { withRouter, RouteComponentProps } from 'react-router';
import Modal from '../../components/Modal';
import { Card, CardContent, Typography, CardActions, Button, List } from 'material-ui';
import ListItem from 'material-ui/List/ListItem';
import ListItemText from 'material-ui/List/ListItemText';

interface RouteMatch {
  entryId: MongoId;
}

interface Props extends WithStyles, RouteComponentProps<RouteMatch> {
  getEntry(id: MongoId): Entry;
}

const SpecificEntry: React.SFC<Props> = (props) => {
  const entry = props.getEntry(props.match.params.entryId);
  return (
    <Modal
      onClose={() => props.history.goBack()}
    >
      <Card>
        <CardContent>
          <Typography type="headline" component="h2">
            {entry.get('_id')}
          </Typography>
          <Typography component="p">
            {entry.get('student').get('username')}
          </Typography>
          <List>
            {entry.get('slots').map(slot => (
              <ListItem
                key={slot.get('_id')}
              >
                <ListItemText primary={slot.get('hour_from')}/>
                <ListItemText primary={slot.get('hour_to')}/>
                <ListItemText primary={slot.get('teacher').get('username')}/>
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
  );
};

const mapStateToProps = (state: AppState) => ({
  getEntry: (id: MongoId) => select.getEntry(id)(state),
});

const mapDispatchToProps = (dispatch: Dispatch<Action>) => ({});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(SpecificEntry)));
