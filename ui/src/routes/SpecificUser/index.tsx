import * as React from 'react';
import withStyles, { WithStyles } from 'material-ui/styles/withStyles';
import { connect, Dispatch } from 'react-redux';
import styles from './styles';

import * as select from '../../redux/selectors';
import { AppState, MongoId, User, Roles } from '../../interfaces/index';
import { Action } from 'redux';
import ChildrenUpdate from './components/ChildrenUpdate';

import { withRouter, RouteComponentProps } from 'react-router';
import { Button, Dialog } from 'material-ui';
import { getUserRequest } from '../../redux/actions';
import withMobileDialog from 'material-ui/Dialog/withMobileDialog';
import DialogTitle from 'material-ui/Dialog/DialogTitle';
import DialogContent from 'material-ui/Dialog/DialogContent';
import DialogActions from 'material-ui/Dialog/DialogActions';
import DialogContentText from 'material-ui/Dialog/DialogContentText';
import Divider from 'material-ui/Divider/Divider';

interface RouteMatch {
  userId: MongoId;
}

interface Props {
  getUser(id: MongoId): User;
  requestUser(id: MongoId): Action;
}

interface InjectedProps extends WithStyles, RouteComponentProps<RouteMatch> {
  fullScreen: boolean;
}

const SpecificUser: React.SFC<Props & InjectedProps> = (props) => {
  const { userId } = props.match.params;
  const user = props.getUser(userId);
  if (!user) {
    props.requestUser(userId);
    return null;
  }
  const isParent = user.get('role') === Roles.PARENT;
  return !!user ? (
    <Dialog
      open={true}
      onClose={() => props.history.goBack()}
      fullScreen={props.fullScreen}
    >
      <DialogTitle>
        {user.get('displayname')}
      </DialogTitle>
      <DialogContent>
        <DialogContentText>
          ID: {user.get('_id')}
          Email: {user.get('email')}
          Role: {user.get('role')}
        </DialogContentText>
        <Divider />
        {isParent && <ChildrenUpdate userId={userId}/>}
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
  ) : null;
};

const mapStateToProps = (state: AppState) => ({
  getUser: (id: MongoId) => select.getUser(id)(state),
});

const mapDispatchToProps = (dispatch: Dispatch<Action>) => ({
  requestUser: (id: MongoId) => dispatch(getUserRequest(id)),
});

export default
  withRouter(
  withMobileDialog<InjectedProps>()(
  connect(mapStateToProps, mapDispatchToProps)(
  withStyles(styles)(
    SpecificUser,
  ))));
