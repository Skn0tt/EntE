import * as React from "react";
import withStyles, { WithStyles } from "material-ui/styles/withStyles";
import { connect, Dispatch } from "react-redux";
import styles from "./styles";

import { withRouter, RouteComponentProps } from "react-router";
import {
  Dialog,
  Button,
  Grid,
  TextField,
  IconButton,
  Divider
} from "material-ui";
import DialogTitle from "material-ui/Dialog/DialogTitle";
import DialogContent from "material-ui/Dialog/DialogContent";
import DialogActions from "material-ui/Dialog/DialogActions";
import withMobileDialog from "material-ui/Dialog/withMobileDialog";
import { Action } from "redux";
import List from "material-ui/List/List";
import ListItem from "material-ui/List/ListItem";
import ListItemText from "material-ui/List/ListItemText";
import ListItemSecondaryAction from "material-ui/List/ListItemSecondaryAction";
import { Delete as DeleteIcon, Add as AddIcon } from "material-ui-icons";
import ImportUsers from "../ImportUsers";
import { IUserCreate, MongoId, Roles } from "ente-types";
import {
  isValidUsername,
  isValidDisplayname,
  isValidEmail,
  isValidUser,
  isValidPassword
} from "ente-validator";
import {
  getStudents,
  getUser,
  User,
  createUsersRequest,
  AppState
} from "ente-redux";
import lang from "ente-lang";
import TextInput from "../../../../elements/TextInput";
import ChildrenInput from "../../../../elements/ChildrenInput";

/**
 * # Component Types
 */
interface OwnProps {
  onClose(): void;
  show: boolean;
}

interface InjectedProps {
  fullScreen: boolean;
}

interface State extends IUserCreate {
  showImportUsers: boolean;
}

interface StateProps {
  students: User[];
  getUser(id: MongoId): User;
}
const mapStateToProps = (state: AppState) => ({
  getUser: (id: MongoId) => getUser(id)(state),
  students: getStudents(state)
});

interface DispatchProps {
  createUser(user: IUserCreate): Action;
}
const mapDispatchToProps = (dispatch: Dispatch<Action>) => ({
  createUser: (user: IUserCreate) => dispatch(createUsersRequest(user))
});

type Props = OwnProps &
  StateProps &
  DispatchProps &
  WithStyles<string> &
  InjectedProps;

/**
 * # Component
 */
export class CreateUser extends React.Component<Props, State> {
  /**
   * # Intialization
   */
  state: State = {
    children: [],
    displayname: "",
    isAdult: false,
    email: "",
    password: "",
    role: Roles.STUDENT,
    username: "",
    showImportUsers: false
  };

  /**
   * ## Action Handlers
   */
  handleGoBack = () => this.handleClose();

  handleClose = () => this.props.onClose();

  handleShowImport = () => this.setState({ showImportUsers: true });
  handleCloseImport = () => this.setState({ showImportUsers: false });

  handleSubmit = () => {
    return this.props.createUser({
      children: this.hasChildren() ? this.state.children : [],
      displayname: this.state.displayname,
      email: this.state.email,
      isAdult: this.state.isAdult,
      password: this.state.password,
      role: this.state.role,
      username: this.state.username
    });
  };

  handleKeyPress: React.KeyboardEventHandler<{}> = event => {
    if (event.key === "Enter" && this.inputValid()) {
      this.handleSubmit();
    }
  };

  /**
   * ## Input Handlers
   */
  handleChangeUsername = (username: string) => this.setState({ username });
  handleChangeDisplayname = (displayname: string) =>
    this.setState({ displayname });
  handleChangePassword = (password: string) => this.setState({ password });
  handleChangeIsAdult = (
    event: React.ChangeEvent<HTMLInputElement>,
    checked: boolean
  ) => this.setState({ isAdult: checked });
  handleChangeEmail = (email: string) => this.setState({ email });
  handleChangeRole = (event: React.ChangeEvent<HTMLInputElement>) =>
    this.setState({ role: event.target.value as Roles });
  handleChangeChildren = (children: string[]) => this.setState({ children });
  hasChildren = (): boolean =>
    this.state.role === Roles.PARENT || this.state.role === Roles.MANAGER;

  /**
   * ## Validation
   */
  usernameValid = (): boolean => isValidUsername(this.state.username);
  displaynameValid = (): boolean => isValidDisplayname(this.state.displayname);
  emailValid = (): boolean => isValidEmail(this.state.email);
  passwordValid = (): boolean =>
    !this.state.password || isValidPassword(this.state.password);
  childrenValid = (): boolean =>
    !this.hasChildren() || this.state.children.length > 0;
  inputValid = (): boolean => isValidUser(this.state);

  render() {
    const { classes, show, fullScreen, getUser, students } = this.props;
    const {
      username,
      displayname,
      email,
      children,
      password,
      role,
      showImportUsers
    } = this.state;

    return (
      <>
        <Dialog fullScreen={fullScreen} onClose={this.handleGoBack} open={show}>
          <DialogTitle>Neuer Nutzer</DialogTitle>
          <DialogContent>
            <form
              className={classes.container}
              onKeyPress={this.handleKeyPress}
            >
              <Grid container direction="row">
                <Grid item xs={12} lg={6}>
                  <TextInput
                    value={username}
                    label={lang().ui.createUser.usernameTitle}
                    onChange={this.handleChangeUsername}
                    validator={this.usernameValid}
                    required
                  />
                </Grid>
                <Grid item xs={12} lg={6}>
                  <TextInput
                    label={lang().ui.createUser.displaynameTitle}
                    value={displayname}
                    onChange={this.handleChangeDisplayname}
                    validator={this.displaynameValid}
                    required
                  />
                </Grid>
                <Grid item xs={12} lg={6}>
                  <TextInput
                    label={lang().ui.createUser.emailTitle}
                    value={email}
                    onChange={this.handleChangeEmail}
                    validator={this.emailValid}
                    type="email"
                    required
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextInput
                    label={lang().ui.createUser.passwordTitle}
                    value={password}
                    onChange={this.handleChangePassword}
                    validator={this.passwordValid}
                    type="password"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    select
                    label="Rolle"
                    value={role}
                    onChange={this.handleChangeRole}
                    fullWidth
                    SelectProps={{ native: true }}
                    helperText="Wählen sie die Rolle des Nutzers aus."
                  >
                    {Object.keys(Roles).map(role => (
                      <option key={Roles[role]} value={Roles[role]}>
                        {Roles[role]}
                      </option>
                    ))}
                  </TextField>
                </Grid>
                {this.hasChildren() && (
                  <Grid item xs={12}>
                    <ChildrenInput
                      children={children.map(getUser)}
                      students={students}
                      onChange={u =>
                        this.handleChangeChildren(u.map(u => u.get("_id")))
                      }
                    />
                  </Grid>
                )}
              </Grid>
            </form>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleShowImport}>
              {lang().ui.createUser.import}
            </Button>
            <Button
              onClick={this.handleClose}
              color="secondary"
              className="close"
            >
              {lang().ui.common.close}
            </Button>
            <Button
              onClick={() => {
                this.handleSubmit();
                this.handleClose();
              }}
              disabled={!this.inputValid()}
              color="primary"
            >
              {lang().ui.common.submit}
            </Button>
          </DialogActions>
        </Dialog>
        <ImportUsers onClose={this.handleCloseImport} show={showImportUsers} />
      </>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(
  withMobileDialog<OwnProps & StateProps & DispatchProps>()(
    withStyles(styles)(CreateUser)
  )
);
