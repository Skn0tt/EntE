/**
 * EntE
 * (c) 2017-present, Simon Knott <info@simonknott.de>
 *
 * This source code is licensed under the GNU Affero General Public License
 * found in the LICENSE file in the root directory of this source tree.
 */

import * as React from "react";
import withStyles, { WithStyles } from "@material-ui/core/styles/withStyles";

import styles from "./styles";
import { connect, Dispatch } from "react-redux";
import { Action } from "redux";
import { Redirect, RouteComponentProps } from "react-router";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  TextField
} from "@material-ui/core";
import withMobileDialog from "@material-ui/core/withMobileDialog";
import { ICredentials } from "ente-types";
import {
  AppState,
  isAuthValid,
  getTokenRequest,
  resetPasswordRequest
} from "ente-redux";
import { withErrorBoundary } from "../../components/withErrorBoundary";

interface InjectedProps {
  fullScreen: boolean;
}

interface StateProps {
  authValid: boolean;
}
const mapStateToProps = (state: AppState) => ({
  authValid: isAuthValid(state)
});

interface DispatchProps {
  checkAuth(credentials: ICredentials): Action;
  triggerPasswordReset(username: string): Action;
}
const mapDispatchToProps = (dispatch: Dispatch<Action>) => ({
  checkAuth: (auth: ICredentials) => dispatch(getTokenRequest(auth)),
  triggerPasswordReset: (username: string) =>
    dispatch(resetPasswordRequest(username))
});

type Props = StateProps &
  DispatchProps &
  InjectedProps &
  WithStyles &
  RouteComponentProps<{}>;

interface State {
  username: string;
  password: string;
}

class Login extends React.Component<Props, State> {
  state: State = {
    username: "",
    password: ""
  };

  handleResetPassword = () =>
    this.props.triggerPasswordReset(this.state.username);

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

  render() {
    const { classes } = this.props;
    const { from } = this.props.location.state || {
      from: { pathname: "/" }
    };

    return (
      <div>
        {this.props.authValid && <Redirect to={from} />}
        <Dialog
          fullScreen={this.props.fullScreen}
          open
          onKeyPress={this.handleKeyPress}
        >
          <DialogTitle>Login</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Bitte melden sie sich an, um EntE zu nutzen.
            </DialogContentText>
            <div className={classes.contentContainer}>
              <TextField
                fullWidth
                id="name"
                label="Name"
                autoComplete="username"
                onChange={this.handleChangeUsername}
              />
              <TextField
                fullWidth
                id="password"
                label="Password"
                type="password"
                autoComplete="current-password"
                onChange={this.handleChangePassword}
              />
            </div>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => this.handleResetPassword()}>
              Passwort Zurücksetzen
            </Button>
            <Button color="primary" onClick={() => this.handleSignIn()}>
              Login
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}

export default withStyles(styles)(
  connect(mapStateToProps, mapDispatchToProps)(
    withMobileDialog<Props>()(withErrorBoundary()(Login))
  )
);
