import * as React from "react";
import styles from "./styles";
import { connect, Dispatch } from "react-redux";
import {
  withStyles,
  Grid,
  Typography,
  Button,
  FormGroup,
  FormControlLabel,
  Switch
} from "material-ui";
import { WithStyles } from "material-ui/styles/withStyles";
import { Action } from "redux";
import { Update as UpdateIcon } from "material-ui-icons";
import { MongoId, IUser } from "ente-types";
import { getUser, AppState, User, updateUserRequest } from "ente-redux";
import lang from "ente-lang";

interface OwnProps {
  userId: MongoId;
}

interface StateProps {
  user(id: MongoId): User;
}
const mapStateToProps = (state: AppState) => ({
  user: (id: MongoId) => getUser(id)(state)
});
interface DispatchProps {
  updateUser(user: Partial<IUser>): Action;
}
const mapDispatchToProps = (dispatch: Dispatch<Action>) => ({
  updateUser: (user: Partial<IUser>) => dispatch(updateUserRequest(user))
});

type Props = OwnProps & StateProps & DispatchProps & WithStyles;
type State = {
  isAdult: boolean;
};

const IsAdultUpdate = connect(mapStateToProps, mapDispatchToProps)(
  withStyles(styles)(
    class extends React.Component<Props, State> {
      state: State = {
        isAdult: this.props.user(this.props.userId).get("isAdult")
      };

      handleSubmit = () =>
        this.props.updateUser({
          isAdult: this.state.isAdult,
          _id: this.props.userId
        });
      handleChange = (
        event: React.ChangeEvent<HTMLInputElement>,
        checked: boolean
      ) => this.setState({ isAdult: checked });

      render() {
        return (
          <Grid container direction="column">
            <Grid item>
              <Typography variant="title">
                {lang().ui.specificUser.adultTitle}
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
                  label={
                    this.state.isAdult
                      ? lang().ui.specificUser.adult
                      : lang().ui.specificUser.notAdult
                  }
                />
              </FormGroup>
            </Grid>
            <Grid item xs={12}>
              <Button
                variant="raised"
                color="primary"
                onClick={() => this.handleSubmit()}
              >
                {lang().ui.specificUser.refresh}
                <UpdateIcon />
              </Button>
            </Grid>
          </Grid>
        );
      }
    }
  )
);

export default IsAdultUpdate;
