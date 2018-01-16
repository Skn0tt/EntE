import * as React from 'react';
import styles from './styles';
import { connect, Dispatch } from 'react-redux';
import { withStyles, Grid, Typography, Button, FormGroup, FormControlLabel, Switch } from 'material-ui';
import { User, MongoId, AppState, IUser } from '../../../../interfaces/index';
import { WithStyles } from 'material-ui/styles/withStyles';
import * as select from '../../../../redux/selectors';
import { updateUserRequest } from '../../../../redux/actions';
import { Action } from 'redux';
import { Update as UpdateIcon } from 'material-ui-icons';

interface OwnProps {
  userId: MongoId;
}

interface StateProps {
  user(id: MongoId): User;
}
const mapStateToProps = (state: AppState) => ({
  user: (id: MongoId) => select.getUser(id)(state),
});
interface DispatchProps {
  updateUser(user: Partial<IUser>): Action;
}
const mapDispatchToProps = (dispatch: Dispatch<Action>) => ({
  updateUser: (user: Partial<IUser>) => dispatch(updateUserRequest(user)),
});

type Props = OwnProps & StateProps & DispatchProps & WithStyles;
type State = {
  isAdult: boolean;
};

const IsAdultUpdate =
  connect(mapStateToProps, mapDispatchToProps)(
  withStyles(styles)(
class extends React.Component<Props, State> {
  state: State = {
    isAdult: this.props.user(this.props.userId).get('isAdult'),
  };

  handleSubmit = () => this.props.updateUser({
    isAdult: this.state.isAdult,
    _id: this.props.userId,
  })
  handleChange = (event: React.ChangeEvent<HTMLInputElement>, checked: boolean) =>
    this.setState({ isAdult: checked })

  render() {
    return (
      <Grid container direction="column">
        <Grid item>
          <Typography type="title">
            Erwachsen
          </Typography>
        </Grid>
        <Grid item>
          <FormGroup>
            <FormControlLabel
              control={
                <Switch
                  checked={this.state.isAdult}
                  onChange={this.handleChange}
                />
              }
              label={this.state.isAdult ? 'Erwachsen' : 'Nicht Erwachsen'}
            />
          </FormGroup>
        </Grid>
        <Grid item xs={12}>
          <Button raised color="primary" onClick={() => this.handleSubmit()}>
            Aktualisieren
            <UpdateIcon />
          </Button>
        </Grid>
      </Grid>
    );
  }
}));

export default IsAdultUpdate;
