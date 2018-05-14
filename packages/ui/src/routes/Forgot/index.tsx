/**
 * EntE
 * (c) 2017-present, Simon Knott <info@simonknott.de>
 *
 * This source code is licensed under the GNU Affero General Public License
 * found in the LICENSE file in the root directory of this source tree.
 */

import * as React from "react";
import withStyles, { WithStyles } from "material-ui/styles/withStyles";
import styles from "./styles";
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
} from "material-ui";
import withMobileDialog, {
  InjectedProps
} from "material-ui/Dialog/withMobileDialog";
import { setPasswordRequest } from "ente-redux";
import { isValidPassword } from "ente-validator";

interface RouteProps {
  token: string;
}

interface DispatchProps {
  setPassword(token: string, newPassword: string): Action;
}
const mapDispatchToProps = (dispatch: Dispatch<Action>) => ({
  setPassword: (token: string, password: string) =>
    dispatch(setPasswordRequest({ token, password }))
});

type Props = DispatchProps &
  RouteComponentProps<RouteProps> &
  WithStyles &
  InjectedProps;

interface State {
  password: string;
  verficication: string;
}

class Forgot extends React.Component<Props, State> {
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
          <DialogTitle>Passwort Ändern</DialogTitle>
          <DialogContent>
            <TextField
              fullWidth
              id="password"
              label="Password"
              type="password"
              error={!this.passwordValid()}
              onChange={this.handleChangePassword}
            />
            <TextField
              fullWidth
              id="verification"
              type="password"
              label="Verifizierung"
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
              Passwort Ändern
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}

export default connect(undefined, mapDispatchToProps)(
  withStyles(styles)(withMobileDialog<Props>()(Forgot))
);
