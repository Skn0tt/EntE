import * as React from "react";
import { WithStyles } from "material-ui/styles/withStyles";
import { Grid, withStyles, Button, TextField } from "material-ui";
import { Dispatch, Action } from "redux";
import { connect } from "react-redux";
import { Update as UpdateIcon } from "material-ui-icons";

import styles from "./styles";
import Typography from "material-ui/Typography/Typography";
import validateEmail from "../../../../services/validateEmail";
import { IUser, MongoId } from "ente-types";
import { getUser, AppState, User, updateUserRequest } from "ente-redux";
import lang from "ente-lang";

interface OwnProps {
  userId: MongoId;
}

interface StateProps {
  getUser(id: MongoId): User;
}
const mapStateToProps = (state: AppState) => ({
  getUser: (id: MongoId) => getUser(id)(state)
});

interface DispatchProps {
  updateUser(user: Partial<IUser>): Action;
}
const mapDispatchToProps = (dispatch: Dispatch<Action>) => ({
  updateUser: (user: Partial<IUser>) => dispatch(updateUserRequest(user))
});

type Props = OwnProps & StateProps & DispatchProps & WithStyles;

interface State {
  email: string;
}

const DisplayNameUpdate = connect(mapStateToProps, mapDispatchToProps)(
  withStyles(styles)(
    class extends React.Component<Props, State> {
      user = (): User => this.props.getUser(this.props.userId);

      state: State = {
        email: this.user().get("email")
      };

      handleSubmit = () =>
        this.props.updateUser({
          _id: this.props.userId,
          email: this.state.email
        });

      handleChange: React.ChangeEventHandler<HTMLInputElement> = event =>
        this.setState({
          email: event.target.value
        });

      /**
       * Validation
       */
      emailValid = (): boolean => validateEmail(this.state.email);

      render() {
        return (
          <Grid container direction="column">
            <Grid item>
              <Typography variant="title">
                {lang().ui.specificUser.emailTitle}
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
              <Button
                variant="raised"
                color="primary"
                onClick={() => this.handleSubmit()}
              >
                {lang().ui.specificUser.refreshEmail}
                <UpdateIcon />
              </Button>
            </Grid>
          </Grid>
        );
      }
    }
  )
);

export default DisplayNameUpdate;
