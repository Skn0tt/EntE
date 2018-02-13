import * as React from 'react';
import { WithStyles } from 'material-ui/styles/withStyles';
import { Grid, withStyles, Button, TextField } from 'material-ui';
import { AppState, IUser, MongoId, User } from '../../../../interfaces/index';
import { Dispatch, Action } from 'redux';
import { connect } from 'react-redux';
import { Update as UpdateIcon } from 'material-ui-icons';

import * as select from '../../../../redux/selectors';
import styles from './styles';
import { updateUserRequest } from '../../../../redux/actions';
import Typography from 'material-ui/Typography/Typography';
import validateEmail from '../../../../services/validateEmail';

interface IProps {
  userId: MongoId;
  updateUser(user: Partial<IUser>): Action;
  getUser(id: MongoId): User;
}
interface State {
  email: string;
}

type Props = IProps & WithStyles;

const mapStateToProps = (state: AppState) => ({
  getUser: (id: MongoId) => select.getUser(id)(state),
});
const mapDispatchToProps = (dispatch: Dispatch<Action>) => ({
  updateUser: (user: Partial<IUser>) => dispatch(updateUserRequest(user)),
});

const DisplayNameUpdate = connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(
class extends React.Component<Props, State> {
  user = (): User => this.props.getUser(this.props.userId);

  state: State = {
    email: this.user().get('email'),
  };

  handleSubmit = () => this.props.updateUser({
    _id: this.props.userId,
    email: this.state.email,
  })

  handleChange: React.ChangeEventHandler<HTMLInputElement> = event => this.setState({
    email: event.target.value,
  })

  /**
   * Validation
   */
  emailValid = (): boolean => validateEmail(this.state.email);

  render() {
    return (
      <Grid container direction="column">
        <Grid item>
          <Typography variant="title">
            Email
          </Typography>
        </Grid>
        <Grid item>
          <TextField
            fullWidth
            type="email"
            error={!this.emailValid()}
            value={this.state.email}
            onChange={this.handleChange}
          />
        </Grid>
        <Grid item xs={12}>
          <Button variant="raised" color="primary" onClick={() => this.handleSubmit()}>
            Email aktualisieren
            <UpdateIcon />
          </Button>
        </Grid>
      </Grid>
    );
  }
}));

export default DisplayNameUpdate;
