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
  MapStateToPropsParam,
} from "react-redux";
import { Action } from "redux";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  TextField,
  Grid,
  Typography,
  Theme,
} from "@material-ui/core";
import withMobileDialog from "@material-ui/core/withMobileDialog";
import {
  AppState,
  isAuthValid,
  loginRequest,
  BasicCredentials,
  LOGIN_REQUEST,
  isTypePending,
  getCurrentLoginBanner,
  getLanguage,
} from "../../redux";
import { withErrorBoundary } from "../../hocs/withErrorBoundary";
import { PasswordResetModal } from "./PasswordResetModal";
import {
  WithTranslation,
  withTranslation,
} from "../../helpers/with-translation";
import * as querystring from "query-string";
import { Maybe, Some, None } from "monet";
import * as config from "../../config";
import { createStyles, withStyles, WithStyles } from "@material-ui/styles";
import { invokeReset } from "../../passwordReset";
import { addMessages } from "../../context/Messages";
import { Languages, DEFAULT_DEFAULT_LANGUAGE } from "@@types";
import { withRouter, Router } from "next/router";

const styles = (theme: Theme) =>
  createStyles({
    versionCode: {
      bottom: 0,
      left: 0,
      margin: theme.spacing.unit,
      position: "absolute",
    },
  });

const lang = {
  en: {
    title: "Login",
    submit: "Login",
    username: "Username",
    password: "Password",
    passwordForgot: "Forgot Password?",
    defaultBanner: "In order to use EntE, log in.",
  },
  de: {
    title: "Anmelden",
    submit: "Anmelden",
    username: "Benutzername",
    password: "Passwort",
    passwordForgot: "Passwort Vergessen?",
    defaultBanner: "Bitte melden Sie sich an, um EntE zu nutzen.",
  },
};

interface LoginOwnProps {}

interface InjectedProps {
  fullScreen: boolean;
}

interface LoginStateProps {
  authValid: boolean;
  loginPending: boolean;
  loginBanner: Maybe<string>;
  language: Languages;
}
const mapStateToProps: MapStateToPropsParam<
  LoginStateProps,
  LoginOwnProps,
  AppState
> = (state) => ({
  authValid: isAuthValid(state),
  loginPending: isTypePending(state)(LOGIN_REQUEST),
  loginBanner: getCurrentLoginBanner(state),
  language: getLanguage(state).orSome(DEFAULT_DEFAULT_LANGUAGE),
});

interface LoginDispatchProps {
  checkAuth(credentials: BasicCredentials): Action;
}
const mapDispatchToProps: MapDispatchToPropsParam<
  LoginDispatchProps,
  LoginOwnProps
> = (dispatch) => ({
  checkAuth: (auth: BasicCredentials) => dispatch(loginRequest(auth)),
});

type LoginProps = LoginStateProps &
  LoginOwnProps &
  LoginDispatchProps & { router: Router } & InjectedProps &
  WithTranslation<typeof lang.en> &
  WithStyles<"versionCode">;

interface State {
  username: string;
  password: string;
  showPasswordResetModal: boolean;
  passwordResetPending: boolean;
}

const extractLoginInfo = (
  hash: string
): Maybe<{ username: string; password: string }> => {
  const [username, password] = hash.substring(1).split(":");
  if (!username || !password) {
    return None();
  }

  return Some({ username, password });
};

class Login extends React.PureComponent<LoginProps, State> {
  state: Readonly<State> = {
    username: this.initialUsername,
    password: "",
    showPasswordResetModal: false,
    passwordResetPending: false,
  };

  componentDidMount() {
    extractLoginInfo(location.hash).forEach(({ username, password }) => {
      this.setState({ username, password });
      this.handleSignIn(username, password);
    });
  }

  get initialUsername() {
    const { username = "" } = querystring.parse(location.search);
    return typeof username === "string" ? username : username![0];
  }

  onResetPassword = async (username: string) => {
    this.hidePasswordResetModal();
    this.setState({ passwordResetPending: true });
    invokeReset(username, (msg) => addMessages(msg[this.props.language]));
    this.setState({ passwordResetPending: false });
  };

  handleKeyPress: React.KeyboardEventHandler<{}> = (event) => {
    if (event.key === "Enter") {
      this.handleSignIn();
    }
  };

  handleChangeUsername: React.ChangeEventHandler<HTMLInputElement> = (event) =>
    this.setState({
      username: event.target.value,
    });

  handleChangePassword: React.ChangeEventHandler<HTMLInputElement> = (event) =>
    this.setState({
      password: event.target.value,
    });

  handleSignIn = (username?: string, password?: string) => {
    this.props.checkAuth({
      username: username || this.state.username,
      password: password || this.state.password,
    });
  };

  showResetModal = () => this.setState({ showPasswordResetModal: true });
  hidePasswordResetModal = () =>
    this.setState({ showPasswordResetModal: false });

  render() {
    const {
      authValid,
      fullScreen,
      loginPending,
      translation: lang,
      loginBanner,
      classes,
      router,
    } = this.props;
    const {
      showPasswordResetModal,
      username,
      passwordResetPending,
    } = this.state;

    const from = (router.query.from as string) ?? "/";

    if (authValid) {
      router.push(from);
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
                  .replace(/(?:\r\n|\r|\n)/g, "<br />"),
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
              onClick={() => this.handleSignIn()}
              disabled={loginPending}
            >
              {lang.submit}
            </Button>
          </DialogActions>
        </Dialog>

        <Typography color="default" className={classes.versionCode}>
          v{config.get().VERSION}
        </Typography>
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
      withStyles(styles)(
        withMobileDialog<LoginProps>()(withErrorBoundary()(Login))
      )
    )
  )
);
