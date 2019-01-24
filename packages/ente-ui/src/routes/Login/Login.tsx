/**
 * EntE
 * (c) 2017-present, Simon Knott <info@simonknott.de>
 *
 * This source code is licensed under the GNU Affero General Public License
 * found in the LICENSE file in the root directory of this source tree.
 */

import * as React from "react";
import {
  connect,
  MapDispatchToPropsParam,
  MapStateToPropsParam
} from "react-redux";
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
  loginRequest,
  resetPasswordRequest,
  BasicCredentials,
  LOGIN_REQUEST,
  isTypePending,
  RESET_PASSWORD_REQUEST,
  getCurrentLoginBanner
} from "../../redux";
import { withErrorBoundary } from "../../hocs/withErrorBoundary";
import { PasswordResetModal } from "./PasswordResetModal";
import {
  WithTranslation,
  withTranslation
} from "../../helpers/with-translation";
import * as querystring from "query-string";
import { Maybe } from "monet";

const lang = {
  en: {
    title: "Login",
    submit: "Login",
    username: "Username",
    password: "Password",
    passwordForgot: "Forgot Password?",
    defaultBanner: "In order to use EntE, log in."
  },
  de: {
    title: "Anmelden",
    submit: "Anmelden",
    username: "Benutzername",
    password: "Passwort",
    passwordForgot: "Passwort Vergessen?",
    defaultBanner: "Bitte melden Sie sich an, um EntE zu nutzen."
  }
};

interface LoginOwnProps {}

interface InjectedProps {
  fullScreen: boolean;
}

interface LoginStateProps {
  authValid: boolean;
  loginPending: boolean;
  passwordResetPending: boolean;
  loginBanner: Maybe<string>;
}
const mapStateToProps: MapStateToPropsParam<
  LoginStateProps,
  LoginOwnProps,
  AppState
> = state => ({
  authValid: isAuthValid(state),
  loginPending: isTypePending(state)(LOGIN_REQUEST),
  passwordResetPending: isTypePending(state)(RESET_PASSWORD_REQUEST),
  loginBanner: getCurrentLoginBanner(state)
});

interface LoginDispatchProps {
  checkAuth(credentials: BasicCredentials): Action;
  triggerPasswordReset(username: string): Action;
}
const mapDispatchToProps: MapDispatchToPropsParam<
  LoginDispatchProps,
  LoginOwnProps
> = dispatch => ({
  checkAuth: (auth: BasicCredentials) => dispatch(loginRequest(auth)),
  triggerPasswordReset: (username: string) =>
    dispatch(resetPasswordRequest(username))
});

type LoginProps = LoginStateProps &
  LoginOwnProps &
  LoginDispatchProps &
  InjectedProps &
  RouteComponentProps<{}> &
  WithTranslation<typeof lang.en>;

interface State {
  username: string;
  password: string;
  showPasswordResetModal: boolean;
}

class Login extends React.PureComponent<LoginProps, State> {
  state: Readonly<State> = {
    username: this.initialUsername,
    password: "",
    showPasswordResetModal: false
  };

  get initialUsername() {
    const { search } = this.props.location;
    const { username = "" } = querystring.parse(search);
    return typeof username === "string" ? username : username![0];
  }

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
      passwordResetPending,
      translation: lang,
      loginBanner
    } = this.props;
    const { showPasswordResetModal, username } = this.state;
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
                __html: loginBanner
                  .orSome(lang.defaultBanner)
                  .replace(/(?:\r\n|\r|\n)/g, "<br />")
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
                  value={username}
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
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(
    withTranslation(lang)(
      withMobileDialog<LoginProps>()(withErrorBoundary()(Login))
    )
  )
);
