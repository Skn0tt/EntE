import * as React from 'react';
import withStyles, { WithStyles } from 'material-ui/styles/withStyles';
import { connect, Dispatch } from 'react-redux';
import styles from './styles';

import * as select from '../../redux/selectors';
import { AppState, MongoId, User } from '../../interfaces/index';
import { Action } from 'redux';

import { withRouter, RouteComponentProps } from 'react-router';
import Modal from '../../components/Modal';

interface RouteMatch {
  userId: MongoId;
}

interface Props extends WithStyles, RouteComponentProps<RouteMatch> {
  getUser(id: MongoId): User;
}

const SpecificUser: React.SFC<Props> = props => (
  <Modal
    onClose={() => props.history.goBack()}
  >
    <div>
      TEst!!
    </div>
  </Modal>
);

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
