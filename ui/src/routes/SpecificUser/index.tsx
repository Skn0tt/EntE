import * as React from 'react';
import withStyles, { WithStyles } from 'material-ui/styles/withStyles';
import { connect, Dispatch } from 'react-redux';
import styles from './styles';

import * as select from '../../redux/selectors';
import { AppState, MongoId, User, Roles } from '../../interfaces/index';
import { Action } from 'redux';
import ChildrenUpdate from './components/ChildrenUpdate';

import { withRouter, RouteComponentProps } from 'react-router';
import Modal from '../../components/Modal';
import { CardContent, Card, Typography, CardActions, Button } from 'material-ui';

interface RouteMatch {
  userId: MongoId;
}

interface Props extends WithStyles, RouteComponentProps<RouteMatch> {
  getUser(id: MongoId): User;
}

const SpecificUser: React.SFC<Props> = (props) => {
  const user = props.getUser(props.match.params.userId);
  const isParent = user.get('role') === Roles.PARENT;
  return (
    <Modal
      onClose={() => props.history.goBack()}
    >
      <Card>
        <CardContent>
          <Typography type="headline" component="h2">
            {user.get('displayname')}
          </Typography>
          <Typography component="p">
            {props.getUser(user.get('displayname'))}
          </Typography>
          {isParent && <ChildrenUpdate user={user}/>}
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
  getUser: (id: MongoId) => select.getUser(id)(state),
});

const mapDispatchToProps = (dispatch: Dispatch<Action>) => ({});

export default
  withRouter(
  connect(mapStateToProps, mapDispatchToProps)(
  withStyles(styles)(
    SpecificUser,
  )));
