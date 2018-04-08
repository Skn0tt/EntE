import * as React from "react";
import withStyles, { WithStyles } from "material-ui/styles/withStyles";
import { connect, Dispatch } from "react-redux";
import styles from "./styles";
import { Action } from "redux";
import ChildrenUpdate from "./components/ChildrenUpdate";
import EmailUpdate from "./components/EmailUpdate";
import { withRouter, RouteComponentProps } from "react-router";
import { Button, Dialog } from "material-ui";
import withMobileDialog from "material-ui/Dialog/withMobileDialog";
import DialogTitle from "material-ui/Dialog/DialogTitle";
import DialogContent from "material-ui/Dialog/DialogContent";
import DialogActions from "material-ui/Dialog/DialogActions";
import DialogContentText from "material-ui/Dialog/DialogContentText";
import Divider from "material-ui/Divider/Divider";
import DisplaynameUpdate from "./components/DisplaynameUpdate";
import IsAdultUpdate from "./components/IsAdultUpdate";
import LoadingIndicator from "../../elements/LoadingIndicator";
import { MongoId, IUser, Roles } from "ente-types";
import {
  User,
  AppState,
  getUser,
  isLoading,
  getUserRequest,
  getStudents,
  userHasChildren
} from "ente-redux";
import lang from "ente-lang";

/**
 * # Component Types
 */
interface RouteMatch {
  userId: MongoId;
}

interface InjectedProps {
  fullScreen: boolean;
}

interface StateProps {
  getUser(id: MongoId): User;
  loading: boolean;
  students: User[];
}
const mapStateToProps = (state: AppState): StateProps => ({
  getUser: (id: MongoId) => getUser(id)(state),
  loading: isLoading(state),
  students: getStudents(state)
});

interface DispatchProps {
  requestUser(id: MongoId): Action;
}
const mapDispatchToProps = (dispatch: Dispatch<Action>): DispatchProps => ({
  requestUser: (id: MongoId) => dispatch(getUserRequest(id))
});

type Props = StateProps &
  DispatchProps &
  InjectedProps &
  WithStyles &
  RouteComponentProps<RouteMatch>;

interface State {
  user: User;
}

/**
 * # Component
 */
export class SpecificUser extends React.PureComponent<Props, State> {
  /**
   * ## Intialization
   */
  state: State = {
    user: this.props.getUser(this.props.match.params.userId)
  };

  /**
   * ## Lifecycle Hooks
   */
  componentDidMount() {
    const { userId } = this.props.match.params;
    const user = this.props.getUser(userId);

    if (!user) {
      this.props.requestUser(userId);
    }
  }
  componentWillUpdate() {
    if (!this.state.user) {
      this.setState({
        user: this.props.getUser(this.props.match.params.userId)
      });
    }
  }

  /**
   * ## Handlers
   */
  onClose = () => this.props.history.goBack();
  onGoBack = () => this.onClose();

  /**
   * ## Render
   */
  render() {
    const { fullScreen, loading, match, getUser, students } = this.props;
    const { user } = this.state;

    return (
      <Dialog open onClose={this.onGoBack} fullScreen={fullScreen}>
        {!!user ? (
          <React.Fragment>
            <DialogTitle>{user.get("displayname")}</DialogTitle>
            <DialogContent>
              <DialogContentText>
                {lang().ui.specificUser.id}: {user.get("_id")} <br />
                {lang().ui.specificUser.email}: {user.get("email")} <br />
                {lang().ui.specificUser.role}: {user.get("role")} <br />
              </DialogContentText>
              <Divider />
              <EmailUpdate userId={user.get("_id")} />
              <Divider />
              {user.get("role") === Roles.STUDENT && (
                <IsAdultUpdate userId={user.get("_id")} />
              )}
              <Divider />
              <DisplaynameUpdate userId={user.get("_id")} />
              {userHasChildren(user) && (
                <React.Fragment>
                  <Divider />
                  <ChildrenUpdate
                    children={user.get("children").map(getUser)}
                    students={students}
                    onChange={c =>
                      this.setState({
                        user: this.state.user.set(
                          "children",
                          c.map(c => c.get("_id"))
                        )
                      })
                    }
                  />
                </React.Fragment>
              )}
            </DialogContent>
          </React.Fragment>
        ) : (
          loading && <LoadingIndicator />
        )}
        <DialogActions>
          <Button size="small" color="primary" onClick={this.onClose}>
            {lang().ui.common.close}
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}

export default withRouter(
  withMobileDialog<Props>()(
    connect<StateProps, DispatchProps, Props>(
      mapStateToProps,
      mapDispatchToProps
    )(withStyles(styles)(SpecificUser))
  )
);
