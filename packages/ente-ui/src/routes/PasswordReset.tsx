/**
 * EntE
 * (c) 2017-present, Simon Knott <info@simonknott.de>
 *
 * This source code is licensed under the GNU Affero General Public License
 * found in the LICENSE file in the root directory of this source tree.
 */

import * as React from "react";
import { Dispatch, Action } from "redux";
import { connect, MapStateToPropsParam } from "react-redux";
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
import {
  setPasswordRequest,
  AppState,
  isTypePending,
  SET_PASSWORD_REQUEST
} from "../redux";
import withErrorBoundary from "../hocs/withErrorBoundary";
import { isValidPassword } from "ente-types";
import { createTranslation } from "../helpers/createTranslation";
import { PasswordRequirementsHint } from "../elements/PasswordRequirementsHint";

const lang = createTranslation({
  en: {
    password: "New Password",
    verification: "Enter again",
    submit: "Reset Password",
    title: "Reset Password",
    passwordSpecs: PasswordRequirementsHint.en
  },
  de: {
    password: "Neues Passwort",
    verification: "Passwort erneut eingeben",
    submit: "Passwort zurücksetzen",
    title: "Passwort zurücksetzen",
    passwordSpecs: PasswordRequirementsHint.de
  }
});

interface PasswordResetStateProps {
  resetIsPending: boolean;
}

const mapStateToProps: MapStateToPropsParam<
  PasswordResetStateProps,
  {},
  AppState
> = state => ({
  resetIsPending: isTypePending(state)(SET_PASSWORD_REQUEST)
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
  PasswordResetStateProps &
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
    const { fullScreen, resetIsPending } = this.props;
    return (
      <div>
        <Dialog fullScreen={fullScreen} open>
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
              disabled={resetIsPending || !this.inputValid()}
              onClick={this.handleSetPassword}
            >
              {lang.submit}
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(
  withMobileDialog<PasswordResetProps>()(withErrorBoundary()(PasswordReset))
);
