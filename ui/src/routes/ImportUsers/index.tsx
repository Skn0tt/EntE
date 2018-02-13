import * as React from 'react';
import styles from './styles';
import withStyles, { WithStyles } from 'material-ui/styles/withStyles';
import { Dialog, Grid, Button } from 'material-ui';
import { withMobileDialog } from 'material-ui/Dialog';
import { connect } from 'react-redux';
import { AppState, IUserCreate } from '../../interfaces/index';
import { Dispatch, Action } from 'redux';
import { RouteComponentProps } from 'react-router';
// tslint:disable-next-line:import-name
import Dropzone from 'react-dropzone';
import DialogActions from 'material-ui/Dialog/DialogActions';
import parseCSV from './services/parseCSV';
import { createUserRequest, addMessage } from '../../redux/actions';
import UnsignedAvatar from '../SpecificEntry/elements/UnsignedAvatar';
import SignedAvatar from '../SpecificEntry/elements/SignedAvatar';

interface StateProps {}
const mapStateToProps = (state: AppState) => ({});

interface DispatchProps {
  createUsers(users: IUserCreate[]): void;
  addMessage(msg: string): void;
}
const mapDispatchToProps = (dispatch: Dispatch<Action>) => ({
  createUsers: (users: IUserCreate[]) => dispatch(createUserRequest(users)),
  addMessage: (msg: string) => dispatch(addMessage(msg)),
});

interface InjectedProps {
  fullScreen: boolean;
}

interface State {
  users: IUserCreate[];
  error: boolean;
}

type Props = DispatchProps & StateProps & WithStyles & InjectedProps & RouteComponentProps<{}>;

const ImportUsers =
  connect<StateProps, DispatchProps>(mapStateToProps, mapDispatchToProps)(
  withStyles(styles)(
  withMobileDialog<Props>()(
class extends React.Component<Props, State> {
  state: State = {
    users: [],
    error: true,
  };

  onDrop = async (accepted: File[], rejected: File[]) => {
    try {
      const users = await parseCSV(accepted[0]);
      this.setState({ users, error: false });
    } catch (error) {
      this.setState({ error: true });
      this.props.addMessage(error.message);
    }
  }

  handleClose = () => this.props.history.goBack();
  handleSubmit = async () => {
    this.props.createUsers(this.state.users);
  }

  /**
   * # Validation
   */
  inputValid = (): boolean => !this.state.error;
  
  render() {
    const { props, state } = this;
    return (
      <Dialog
        fullScreen={props.fullScreen}
        onClose={() => props.history.goBack()}
        open
      >
        <Grid container direction="column">
          <Grid item xs={12}>
            <Dropzone
              accept="text/csv"
              onDrop={this.onDrop}
            >
              Drop items here!
            </Dropzone>
          </Grid>
          <Grid item xs={12}>
            {state.error ? <UnsignedAvatar /> : <SignedAvatar />}
          </Grid>
        </Grid>
        <DialogActions>
          <Button onClick={this.handleClose} color="secondary">
            Cancel
          </Button>
          <Button
            onClick={() => {
              this.handleSubmit();
              this.handleClose();
            }}
            disabled={!this.inputValid()}
            color="primary"
          >
            OK
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
})));

export default ImportUsers;
