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
  MapDispatchToPropsParam,
  MapStateToPropsParam
} from "react-redux";
import styles from "./styles";
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
import LoadingIndicator from "../../elements/LoadingIndicator";
import * as _ from "lodash";
import {
  AppState,
  getUser,
  isLoading,
  getUserRequest,
  getStudents,
  userHasChildren,
  updateUserRequest,
  userIsStudent,
  UserN
} from "ente-redux";
import lang from "ente-lang";
import withErrorBoundary from "../../components/withErrorBoundary";
import {
  PatchUserDto,
  isValidDisplayname,
  isValidEmail,
  isValidUserPatch
} from "ente-types";

/**
 * # Component Types
 */
interface RouteMatch {
  userId: string;
}
interface StateProps {
  getUser(id: string): UserN;
  loading: boolean;
  students: UserN[];
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
  requestUser(id: string): void;
  updateUser(id: string, u: PatchUserDto): void;
}
const mapDispatchToProps: MapDispatchToPropsParam<
  DispatchProps,
  OwnProps
> = dispatch => ({
  requestUser: id => dispatch(getUserRequest(id)),
  updateUser: (id, user) => dispatch(updateUserRequest([id, user]))
});

interface OwnProps {}

type Props = StateProps &
  OwnProps &
  DispatchProps &
  InjectedProps &
  WithStyles &
  RouteComponentProps<RouteMatch>;

interface State {
  patch: PatchUserDto;
}

/**
 * # Component
 */
export class SpecificUser extends React.PureComponent<Props, State> {
  /**
   * ## Intialization
   */
  state: State = {
    patch: new PatchUserDto()
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

  update = (key: keyof PatchUserDto) => (value: any) => {
    const clone = Object.assign({}, this.state.patch);
    clone[key] = value;
    this.setState({ patch: clone });
  };

  /**
   * ## Handlers
   */
  onClose = () => this.props.history.goBack();
  onGoBack = () => this.onClose();
  onSubmit = () => {
    const { updateUser } = this.props;
    const { patch } = this.state;

    updateUser(this.userId, patch);

    this.onClose();
  };

  get userId() {
    return this.props.match.params.userId;
  }

  /**
   * ## Render
   */
  render() {
    const { fullScreen, loading, getUser, students } = this.props;
    const { patch } = this.state;

    const user = getUser(this.userId);

    return (
      <Dialog open onClose={this.onGoBack} fullScreen={fullScreen}>
        {!!user ? (
          <>
            <DialogTitle>{user.get("displayname")}</DialogTitle>
            <DialogContent>
              <Grid container spacing={24} alignItems="stretch">
                <Grid item xs={12}>
                  <DialogContentText>
                    {lang().ui.specificUser.id}: {user.get("id")} <br />
                    {lang().ui.specificUser.role}: {user.get("role")} <br />
                  </DialogContentText>
                </Grid>

                {/* Displayname */}
                <Grid item xs={12}>
                  <TextInput
                    title={lang().ui.specificUser.displaynameTitle}
                    value={patch.displayname || user.get("displayname")}
                    onChange={this.update("displayname")}
                    validator={isValidDisplayname}
                  />
                </Grid>

                {/* Email */}
                <Grid item xs={12}>
                  <TextInput
                    title={lang().ui.specificUser.emailTitle}
                    value={patch.email || user.get("email")}
                    onChange={this.update("email")}
                    validator={isValidEmail}
                  />
                </Grid>

                {/* IsAdult */}
                {userIsStudent(user) && (
                  <Grid item xs={12}>
                    <SwitchInput
                      value={user.get("isAdult")}
                      title={lang().ui.specificUser.adultTitle}
                      onChange={this.update("isAdult")}
                    />
                  </Grid>
                )}

                {/* Children */}
                {userHasChildren(user) && (
                  <Grid item xs={12}>
                    <ChildrenInput
                      children={
                        !!patch.children
                          ? patch.children.map(getUser)
                          : user.get("childrenIds").map(getUser)
                      }
                      students={students}
                      onChange={c => this.update("children")(c.map(v => v.id))}
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
            disabled={!isValidUserPatch(this.state.patch)}
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
