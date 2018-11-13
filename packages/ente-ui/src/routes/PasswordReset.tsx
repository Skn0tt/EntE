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
  Button,
  Grid,
  Typography
} from "@material-ui/core";
import withMobileDialog, {
  InjectedProps
} from "@material-ui/core/withMobileDialog";
import { setPasswordRequest } from "../redux";
import withErrorBoundary from "../hocs/withErrorBoundary";
import { isValidPassword } from "ente-types";
import { createTranslation } from "../helpers/createTranslation";
import { PasswordRequirements } from "../elements/PasswordRequirements";

const lang = createTranslation({
  en: {
    password: "New Password",
    verification: "Enter again",
    submit: "Reset Password",
    title: "Reset Password",
    passwordSpecs: PasswordRequirements.en
  },
  de: {
    password: "Neues Passwort",
    verification: "Passwort erneut eingeben",
    submit: "Passwort zurücksetzen",
    title: "Passwort zurücksetzen",
    passwordSpecs: PasswordRequirements.de
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
            <Grid container direction="column">
              <Grid item>
                <TextField
                  fullWidth
                  id="password"
                  label={lang.password}
                  type="password"
                  error={!this.passwordValid()}
                  onChange={this.handleChangePassword}
                />
              </Grid>
              <Typography variant="body2">
                <lang.passwordSpecs />
              </Typography>
              <Grid item>
                <TextField
                  fullWidth
                  id="verification"
                  type="password"
                  label={lang.verification}
                  error={!this.verificationValid()}
                  onChange={this.handleChangeVerification}
                />
              </Grid>
            </Grid>
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
