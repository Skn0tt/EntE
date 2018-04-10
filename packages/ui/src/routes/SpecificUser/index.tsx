import * as React from "react";
import withStyles, { WithStyles } from "material-ui/styles/withStyles";
import { connect, Dispatch } from "react-redux";
import styles from "./styles";
import { Action } from "redux";
import ChildrenUpdate from "./components/ChildrenUpdate";
import SwitchUpdate from "./components/SwitchUpdate";
import { withRouter, RouteComponentProps } from "react-router";
import { Button, Dialog, Grid } from "material-ui";
import withMobileDialog from "material-ui/Dialog/withMobileDialog";
import DialogTitle from "material-ui/Dialog/DialogTitle";
import DialogContent from "material-ui/Dialog/DialogContent";
import DialogActions from "material-ui/Dialog/DialogActions";
import DialogContentText from "material-ui/Dialog/DialogContentText";
import Divider from "material-ui/Divider/Divider";
import LoadingIndicator from "../../elements/LoadingIndicator";
import { MongoId, IUser, Roles } from "ente-types";
import {
  User,
  AppState,
  getUser,
  isLoading,
  getUserRequest,
  getStudents,
  userHasChildren,
  updateUserRequest,
  userIsStudent
} from "ente-redux";
import lang from "ente-lang";
import { updateUser } from "redux/src/api";
import TextUpdate from "./components/TextUpdate";
import { isValidEmail, isValidDisplayname, isValidUser } from "ente-validator";

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
  requestUser(id: MongoId);
  updateUser(u: IUser);
}
const mapDispatchToProps = (dispatch: Dispatch<Action>): DispatchProps => ({
  requestUser: (id: MongoId) => dispatch(getUserRequest(id)),
  updateUser: (user: IUser) => dispatch(updateUserRequest(user))
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
  onSubmit = () => {
    this.props.updateUser(this.state.user.toJS());
    this.onClose();
  };

  /**
   * ## Render
   */
  render() {
    const { fullScreen, loading, match, getUser, students } = this.props;
    const { user } = this.state;

    return (
      <Dialog open onClose={this.onGoBack} fullScreen={fullScreen}>
        {!!user ? (
          <>
            <DialogTitle>{user.get("displayname")}</DialogTitle>
            <DialogContent>
              <Grid container spacing={24} alignItems="stretch">
                <Grid item xs={12}>
                  <DialogContentText>
                    {lang().ui.specificUser.id}: {user.get("_id")} <br />
                    {lang().ui.specificUser.role}: {user.get("role")} <br />
                  </DialogContentText>
                </Grid>

                {/* Displayname */}
                <Grid item xs={12}>
                  <TextUpdate
                    title={lang().ui.specificUser.displaynameTitle}
                    value={user.get("displayname")}
                    onChange={n =>
                      this.setState({ user: user.set("displayname", n) })
                    }
                    validator={isValidDisplayname}
                  />
                </Grid>

                {/* Email */}
                <Grid item xs={12}>
                  <TextUpdate
                    title={lang().ui.specificUser.emailTitle}
                    value={user.get("email")}
                    onChange={n =>
                      this.setState({ user: user.set("email", n) })
                    }
                    validator={isValidEmail}
                  />
                </Grid>

                {/* IsAdult */}
                {userIsStudent(user) && (
                  <Grid item xs={12}>
                    <SwitchUpdate
                      value={user.get("isAdult")}
                      title={lang().ui.specificUser.adultTitle}
                      onChange={b =>
                        this.setState({ user: user.set("isAdult", b) })
                      }
                    />
                  </Grid>
                )}

                {/* Children */}
                {userHasChildren(user) && (
                  <Grid item xs={12}>
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
                  </Grid>
                )}
              </Grid>
            </DialogContent>
          </>
        ) : (
          loading && <LoadingIndicator />
        )}
        <DialogActions>
          <Button size="small" color="secondary" onClick={this.onClose}>
            {lang().ui.common.close}
          </Button>
          <Button
            size="small"
            color="primary"
            onClick={this.onSubmit}
            disabled={!this.state.user || !isValidUser(this.state.user.toJS())}
          >
            {lang().ui.common.submit}
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
