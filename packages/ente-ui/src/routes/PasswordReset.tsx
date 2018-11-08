/**
 * EntE
 * (c) 2017-present, Simon Knott <info@simonknott.de>
 *
 * This source code is licensed under the GNU Affero General Public License
 * found in the LICENSE file in the root directory of this source tree.
 */

import * as React from "react";
import { Dispatch, Action } from "redux";
import { connect } from "react-redux";
import { RouteComponentProps } from "react-router";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  Button
} from "@material-ui/core";
import withMobileDialog, {
  InjectedProps
} from "@material-ui/core/withMobileDialog";
import { setPasswordRequest } from "../redux";
import withErrorBoundary from "../hocs/withErrorBoundary";
import { isValidPassword } from "ente-types";
import { createTranslation } from "../helpers/createTranslation";

const lang = createTranslation({
  en: {
    password: "Password",
    verification: "Verification",
    submit: "Reset Password",
    title: "Reset Password"
  },
  de: {
    password: "Passwort",
    verification: "Verifizierung",
    submit: "Passwort zurücksetzen",
    title: "Passwort zurücksetzen"
  }
});

interface PasswordResetRouteProps {
  token: string;
}

interface PasswordResetDispatchProps {
  setPassword(token: string, newPassword: string): Action;
}
const mapDispatchToProps = (dispatch: Dispatch<Action>) => ({
  setPassword: (token: string, newPassword: string) =>
    dispatch(setPasswordRequest({ token, newPassword }))
});

type PasswordResetProps = PasswordResetDispatchProps &
  RouteComponentProps<PasswordResetRouteProps> &
  InjectedProps;

interface State {
  password: string;
  verficication: string;
}

class PasswordReset extends React.Component<PasswordResetProps, State> {
  state: State = {
    password: "",
    verficication: ""
  };

  inputValid = (): boolean => this.passwordValid() && this.verificationValid();
  passwordValid = (): boolean => isValidPassword(this.state.password);
  verificationValid = (): boolean =>
    this.state.password === this.state.verficication;
  handleChangePassword = (event: React.ChangeEvent<HTMLInputElement>) =>
    this.setState({ password: event.target.value });
  handleChangeVerification = (event: React.ChangeEvent<HTMLInputElement>) =>
    this.setState({ verficication: event.target.value });
  handleSetPassword = () => {
    this.props.setPassword(this.props.match.params.token, this.state.password);
  };

  render() {
    return (
      <div>
        <Dialog fullScreen={this.props.fullScreen} open>
          <DialogTitle>{lang.title}</DialogTitle>
          <DialogContent>
            <TextField
              fullWidth
              id="password"
              label={lang.password}
              type="password"
              error={!this.passwordValid()}
              onChange={this.handleChangePassword}
            />
            <TextField
              fullWidth
              id="verification"
              type="password"
              label={lang.verification}
              error={!this.verificationValid()}
              onChange={this.handleChangeVerification}
            />
          </DialogContent>
          <DialogActions>
            <Button
              variant="raised"
              disabled={!this.inputValid()}
              onClick={() => this.handleSetPassword()}
            >
              {lang.submit}
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}

export default connect(undefined, mapDispatchToProps)(
  withMobileDialog<PasswordResetProps>()(withErrorBoundary()(PasswordReset))
);
