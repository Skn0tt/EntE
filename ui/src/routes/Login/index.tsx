import * as React from 'react';
import withStyles, { WithStyles } from 'material-ui/styles/withStyles';
import * as select from '../../redux/selectors';

import styles from './styles';
import { AppState, ICredentials } from '../../interfaces/index';
import { connect, Dispatch } from 'react-redux';
import { Action } from 'redux';
import { Redirect, RouteComponentProps } from 'react-router';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  TextField,
} from 'material-ui';
import { withMobileDialog } from 'material-ui/Dialog';
import { checkAuthRequest, resetPasswordRequest } from '../../redux/actions';

interface IProps {
  authValid: boolean;
  checkAuth(credentials: ICredentials): Action;
  triggerPasswordReset(username: string): Action;
}
interface InjectedProps {
  fullScreen: boolean;
}
interface State {
  username: string;
  password: string;
}

const mapStateToProps = (state: AppState) => ({
  authValid: select.isAuthValid(state),
});

const mapDispatchToProps = (dispatch: Dispatch<Action>) => ({
  checkAuth: (auth: ICredentials) => dispatch(checkAuthRequest(auth)),
  triggerPasswordReset: (username: string) => dispatch(resetPasswordRequest(username)),
});

type Props = IProps & WithStyles<string> & InjectedProps & RouteComponentProps<{}>;

const Login = connect(mapStateToProps, mapDispatchToProps)(
  withMobileDialog<IProps>()(
    withStyles(styles)(
      class extends React.Component<Props, State> {
        state: State = {
          username: '',
          password: '',
        };

        handleResetPassword = () => this.props.triggerPasswordReset(this.state.username);

        handleKeyPress: React.KeyboardEventHandler<{}> = event => {
          if (event.key === 'Enter') {
            this.handleSignIn();
          }
        };

        handleChangeUsername: React.ChangeEventHandler<HTMLInputElement> = event =>
          this.setState({
            username: event.target.value,
          });

        handleChangePassword: React.ChangeEventHandler<HTMLInputElement> = event =>
          this.setState({
            password: event.target.value,
          });

        handleSignIn = () =>
          this.props.checkAuth({
            username: this.state.username,
            password: this.state.password,
          });

        render() {
          const { classes } = this.props;
          const { from } = this.props.location.state || { from: { pathname: '/' } };

          return (
            <div>
              {this.props.authValid && <Redirect to={from} />}
              <Dialog fullScreen={this.props.fullScreen} open onKeyPress={this.handleKeyPress}>
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
                  <Button onClick={() => this.handleResetPassword()}>Passwort Zurücksetzen</Button>
                  <Button color="primary" onClick={() => this.handleSignIn()}>
                    Login
                  </Button>
                </DialogActions>
              </Dialog>
            </div>
          );
        }
      },
    ),
  ),
);

export default Login;
