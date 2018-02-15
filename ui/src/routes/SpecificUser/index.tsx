import * as React from 'react';
import withStyles, { WithStyles } from 'material-ui/styles/withStyles';
import { connect, Dispatch } from 'react-redux';
import styles from './styles';

import * as select from '../../redux/selectors';
import { AppState, MongoId, User } from '../../interfaces/index';
import { Action } from 'redux';
import ChildrenUpdate from './components/ChildrenUpdate';
import EmailUpdate from './components/EmailUpdate';

import { withRouter, RouteComponentProps } from 'react-router';
import { Button, Dialog, CircularProgress } from 'material-ui';
import { getUserRequest } from '../../redux/actions';
import withMobileDialog from 'material-ui/Dialog/withMobileDialog';
import DialogTitle from 'material-ui/Dialog/DialogTitle';
import DialogContent from 'material-ui/Dialog/DialogContent';
import DialogActions from 'material-ui/Dialog/DialogActions';
import DialogContentText from 'material-ui/Dialog/DialogContentText';
import Divider from 'material-ui/Divider/Divider';
import DisplaynameUpdate from './components/DisplaynameUpdate';
import IsAdultUpdate from './components/IsAdultUpdate';

interface RouteMatch {
  userId: MongoId;
}

interface InjectedProps {
  fullScreen: boolean;
}

interface StateProps {
  getUser(id: MongoId): User;
  loading: boolean;
}
const mapStateToProps = (state: AppState) => ({
  getUser: (id: MongoId) => select.getUser(id)(state),
  loading: select.isLoading(state),
});

interface DispatchProps {
  requestUser(id: MongoId): Action;
}
const mapDispatchToProps = (dispatch: Dispatch<Action>) => ({
  requestUser: (id: MongoId) => dispatch(getUserRequest(id)),
});

type Props =
  StateProps &
  DispatchProps &
  InjectedProps &
  WithStyles &
  RouteComponentProps<RouteMatch>;

const SpecificUser =
  withRouter(
  withMobileDialog<Props>()(
  connect<StateProps, DispatchProps, Props>(mapStateToProps, mapDispatchToProps)(
  withStyles(styles)(
class extends React.Component<Props> {
  componentDidMount() {
    const { userId } = this.props.match.params;
    const user = this.props.getUser(userId);
    
    if (!user) {
      this.props.requestUser(userId);
    }
  }
  render() {
    const { props } = this;
    const { loading } = props;
    const { userId } = props.match.params;
    const user = props.getUser(userId);
    
    return (
      <Dialog
        open
        onClose={() => props.history.push('/users')}
        fullScreen={props.fullScreen}
      >
        {!!user
        ? (
          <React.Fragment>
            <DialogTitle>
              {user.get('displayname')}
            </DialogTitle>
            <DialogContent>
              <DialogContentText>
                ID: {user.get('_id')} <br />
                Email: {user.get('email')} <br />
                Role: {user.get('role')} <br />
              </DialogContentText>
              <Divider />
              <EmailUpdate userId={userId} />
              <Divider />
              {user.isStudent() && <IsAdultUpdate userId={userId}/>}
              <Divider />
              <DisplaynameUpdate userId={userId} />
              {user.hasChildren() && (
                <React.Fragment>
                  <Divider />
                  <ChildrenUpdate userId={userId}/>
                </React.Fragment>
              )}
            </DialogContent>
          </React.Fragment>
        )
        : (
          loading && <CircularProgress />
        )}
        <DialogActions>
          <Button
            size="small"
            color="primary"
            onClick={() => props.history.push('/users')}
          >
            Schließen
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}))));

export default SpecificUser;
