/**
 * EntE
 * (c) 2017-present, Simon Knott <info@simonknott.de>
 *
 * This source code is licensed under the GNU Affero General Public License
 * found in the LICENSE file in the root directory of this source tree.
 */

import * as React from "react";
import { connect, MapDispatchToPropsParam } from "react-redux";
import { Action } from "redux";
import { Redirect, RouteComponentProps, withRouter } from "react-router";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  TextField,
  Grid
} from "@material-ui/core";
import withMobileDialog from "@material-ui/core/withMobileDialog";
import {
  AppState,
  isAuthValid,
  getTokenRequest,
  resetPasswordRequest,
  BasicCredentials,
  GET_TOKEN_REQUEST,
  isTypePending,
  RESET_PASSWORD_REQUEST
} from "../../redux";
import { withErrorBoundary } from "../../hocs/withErrorBoundary";
import { createTranslation } from "../../helpers/createTranslation";
import * as config from "../../config";
import { PasswordResetModal } from "./PasswordResetModal";

const { INSTANCE_INFO_DE, INSTANCE_INFO_EN } = config.get();

const lang = createTranslation({
  en: {
    title: "Login",
    submit: "Login",
    username: "Username",
    password: "Password",
    passwordForgot: "Forgot Password?",
    instanceInfo: INSTANCE_INFO_EN.orSome("In order to use EntE, log in.")
  },
  de: {
    title: "Anmelden",
    submit: "Anmelden",
    username: "Benutzername",
    password: "Passwort",
    passwordForgot: "Passwort Vergessen?",
    instanceInfo: INSTANCE_INFO_DE.orSome(
      "Bitte melden sie sich an, um EntE zu nutzen."
    )
  }
});

interface LoginOwnProps {}

interface InjectedProps {
  fullScreen: boolean;
}

interface LoginStateProps {
  authValid: boolean;
  loginPending: boolean;
  passwordResetPending: boolean;
}
const mapStateToProps = (state: AppState) => ({
  authValid: isAuthValid(state),
  loginPending: isTypePending(state)(GET_TOKEN_REQUEST),
  passwordResetPending: isTypePending(state)(RESET_PASSWORD_REQUEST)
});

interface LoginDispatchProps {
  checkAuth(credentials: BasicCredentials): Action;
  triggerPasswordReset(username: string): Action;
}
const mapDispatchToProps: MapDispatchToPropsParam<
  LoginDispatchProps,
  LoginOwnProps
> = dispatch => ({
  checkAuth: (auth: BasicCredentials) => dispatch(getTokenRequest(auth)),
  triggerPasswordReset: (username: string) =>
    dispatch(resetPasswordRequest(username))
});

type Props = LoginStateProps &
  LoginOwnProps &
  LoginDispatchProps &
  InjectedProps &
  RouteComponentProps<{}>;

interface State {
  username: string;
  password: string;
  showPasswordResetModal: boolean;
}

class Login extends React.Component<Props, State> {
  state: State = {
    username: "",
    password: "",
    showPasswordResetModal: false
  };

  onResetPassword = (username: string) => {
    this.props.triggerPasswordReset(username);
    this.hidePasswordResetModal();
  };

  handleKeyPress: React.KeyboardEventHandler<{}> = event => {
    if (event.key === "Enter") {
      this.handleSignIn();
    }
  };

  handleChangeUsername: React.ChangeEventHandler<HTMLInputElement> = event =>
    this.setState({
      username: event.target.value
    });

  handleChangePassword: React.ChangeEventHandler<HTMLInputElement> = event =>
    this.setState({
      password: event.target.value
    });

  handleSignIn = () =>
    this.props.checkAuth({
      username: this.state.username,
      password: this.state.password
    });

  showResetModal = () => this.setState({ showPasswordResetModal: true });
  hidePasswordResetModal = () =>
    this.setState({ showPasswordResetModal: false });

  render() {
    const {
      authValid,
      location,
      fullScreen,
      loginPending,
      passwordResetPending
    } = this.props;
    const { showPasswordResetModal } = this.state;
    const { from } = location.state || {
      from: { pathname: "/" }
    };

    if (authValid) {
      return <Redirect to={from.pathname} />;
    }

    return (
      <>
        <PasswordResetModal
          onReset={this.onResetPassword}
          show={showPasswordResetModal}
          onClose={this.hidePasswordResetModal}
        />
        <Dialog fullScreen={fullScreen} open onKeyPress={this.handleKeyPress}>
          <DialogTitle>{lang.title}</DialogTitle>
          <DialogContent>
            <DialogContentText
              dangerouslySetInnerHTML={{
                __html: lang.instanceInfo.replace("\n", "<br />")
              }}
            />
            <Grid container direction="column">
              <Grid item>
                <TextField
                  fullWidth
                  id="name"
                  label={lang.username}
                  autoComplete="username"
                  onChange={this.handleChangeUsername}
                />
              </Grid>

              <Grid item>
                <TextField
                  fullWidth
                  id="password"
                  label={lang.password}
                  type="password"
                  autoComplete="current-password"
                  onChange={this.handleChangePassword}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={this.showResetModal}
              disabled={passwordResetPending}
            >
              {lang.passwordForgot}
            </Button>
            <Button
              color="primary"
              onClick={this.handleSignIn}
              disabled={loginPending}
            >
              {lang.submit}
            </Button>
          </DialogActions>
        </Dialog>
      </>
    );
  }
}

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(
    withMobileDialog<Props>()(withErrorBoundary()(Login))
  )
);
