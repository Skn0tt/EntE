/**
 * EntE
 * (c) 2017-present, Simon Knott <info@simonknott.de>
 *
 * This source code is licensed under the GNU Affero General Public License
 * found in the LICENSE file in the root directory of this source tree.
 */

import * as React from "react";
import withStyles, { WithStyles } from "@material-ui/core/styles/withStyles";
import {
  connect,
  Dispatch,
  MapDispatchToPropsParam,
  MapStateToPropsParam
} from "react-redux";
import styles from "./styles";
import { Action } from "redux";
import ChildrenInput from "../../elements/ChildrenInput";
import SwitchInput from "../../elements/SwitchInput";
import TextInput from "../../elements/TextInput";
import { withRouter, RouteComponentProps } from "react-router";
import { Button, Dialog, Grid } from "@material-ui/core";
import withMobileDialog, {
  InjectedProps
} from "@material-ui/core/withMobileDialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContentText from "@material-ui/core/DialogContentText";
import Divider from "@material-ui/core/Divider/Divider";
import LoadingIndicator from "../../elements/LoadingIndicator";
import { IUser, Roles, UserId } from "ente-types";
import * as _ from "lodash";
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
import { isValidEmail, isValidDisplayname, isValidUser } from "ente-validator";
import withErrorBoundary from "../../components/withErrorBoundary";

/**
 * # Helpers
 */
const diffUsers = (oldUser: IUser, newUser: IUser): Partial<IUser> => {
  const diff: Partial<IUser> = { _id: newUser._id };

  _.entries(newUser).forEach(([key, value]) => {
    const oldV = (oldUser as any)[key];
    const newV = (newUser as any)[key];
    if (oldV !== newV) {
      (diff as any)[key] = newV;
    }
  });

  return diff;
};

/**
 * # Component Types
 */
interface RouteMatch {
  userId: UserId;
}
interface StateProps {
  getUser(id: UserId): User;
  loading: boolean;
  students: User[];
}
const mapStateToProps: MapStateToPropsParam<
  StateProps,
  OwnProps,
  AppState
> = state => ({
  getUser: id => getUser(id)(state),
  loading: isLoading(state),
  students: getStudents(state)
});

interface DispatchProps {
  requestUser(id: UserId): void;
  updateUser(u: Partial<IUser>): void;
}
const mapDispatchToProps: MapDispatchToPropsParam<
  DispatchProps,
  OwnProps
> = dispatch => ({
  requestUser: id => dispatch(getUserRequest(id)),
  updateUser: user => dispatch(updateUserRequest(user))
});

interface OwnProps {}

type Props = StateProps &
  OwnProps &
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
    const oldUser: IUser = this.props
      .getUser(this.props.match.params.userId)
      .toJS();
    const newUser: IUser = this.state.user.toJS();

    const diff = diffUsers(oldUser, newUser);
    this.props.updateUser(diff);

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
                  <TextInput
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
                  <TextInput
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
                    <SwitchInput
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
                    <ChildrenInput
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

export default withStyles(styles)(
  connect<StateProps, DispatchProps, OwnProps, AppState>(
    mapStateToProps,
    mapDispatchToProps
  )(withRouter(withMobileDialog<Props>()(withErrorBoundary()(SpecificUser))))
);
