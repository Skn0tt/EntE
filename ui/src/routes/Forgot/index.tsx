import * as React from 'react';
import withStyles, { WithStyles } from 'material-ui/styles/withStyles';
import styles from './styles';
import { Dispatch, Action } from 'redux';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  Button,
} from 'material-ui';
import withMobileDialog from 'material-ui/Dialog/withMobileDialog';
import { setPasswordRequest } from '../../redux/actions';

interface RouteProps {
  token: string;
}
interface DispatchProps {
  setPassword(token: string, newPassword: string): Action;
}
interface InjectedProps {
  fullScreen: boolean;
}
const mapDispatchToProps = (dispatch: Dispatch<Action>) => ({
  setPassword: (token: string, password: string) => dispatch(
    setPasswordRequest({ token, password }),
  ),
});

interface State {
  password: string;
  verficication: string;
}

type Props = DispatchProps & RouteComponentProps<RouteProps> & WithStyles;

const Forgot =
  connect(undefined, mapDispatchToProps)(
  withStyles(styles)(
  withMobileDialog<Props>()(
class extends React.Component<Props & InjectedProps, State> {
  state: State = {
    password: '',
    verficication: '',
  };
  
  inputValid = (): boolean => (
    this.passwordValid() &&
    this.verificationValid()
  )
  passwordValid = (): boolean => true;
  verificationValid = (): boolean => this.state.password === this.state.verficication;
  handleChangePassword = (event: React.ChangeEvent<HTMLInputElement>) =>
    this.setState({ password: event.target.value })
  handleChangeVerification = (event: React.ChangeEvent<HTMLInputElement>) =>
    this.setState({ verficication: event.target.value })
  handleSetPassword = () => {
    this.props.setPassword(
      this.props.match.params.token,
      this.state.password,
    );
  }

  render() {
    return (
      <div>
        <Dialog
          fullScreen={this.props.fullScreen}
          open
        >
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
})));

export default Forgot;
