/**
 * EntE
 * (c) 2017-present, Simon Knott <info@simonknott.de>
 *
 * This source code is licensed under the GNU Affero General Public License
 * found in the LICENSE file in the root directory of this source tree.
 */

import * as React from "react";
import withStyles, { WithStyles } from "@material-ui/core/styles/withStyles";
import { connect, Dispatch, MapStateToPropsParam } from "react-redux";
import styles from "./styles";

import { Dialog, Button, Grid, TextField } from "@material-ui/core";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import withMobileDialog, {
  InjectedProps
} from "@material-ui/core/withMobileDialog";
import { Action } from "redux";
import ImportUsers from "../ImportUsers";
import {
  Roles,
  CreateUserDto,
  isValidDisplayname,
  isValidUsername,
  isValidEmail,
  isValidPassword,
  isValidUser,
  createDefaultCreateUserDto
} from "ente-types";
import {
  getStudents,
  getUser,
  createUsersRequest,
  AppState,
  UserN
} from "ente-redux";
import lang from "ente-lang";
import TextInput from "../../../../elements/TextInput";
import ChildrenInput from "../../../../elements/ChildrenInput";
import withErrorBoundary from "ente-ui/src/components/withErrorBoundary";

/**
 * # Component Types
 */
interface OwnProps {
  onClose(): void;
  show: boolean;
}

interface State {
  create: CreateUserDto;
  showImportUsers: boolean;
}

interface StateProps {
  students: UserN[];
  getUser(id: string): UserN;
}
const mapStateToProps: MapStateToPropsParam<
  StateProps,
  OwnProps,
  AppState
> = state => ({
  getUser: id => getUser(id)(state),
  students: getStudents(state)
});

interface DispatchProps {
  createUser(user: CreateUserDto): Action;
}
const mapDispatchToProps = (dispatch: Dispatch<Action>) => ({
  createUser: (user: CreateUserDto) => dispatch(createUsersRequest(user))
});

type Props = OwnProps & StateProps & DispatchProps & WithStyles & InjectedProps;

/**
 * # Component
 */
export class CreateUser extends React.Component<Props, State> {
  /**
   * # Intialization
   */
  state: State = {
    create: createDefaultCreateUserDto(),
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
    return this.props.createUser(this.state.create);
  };

  handleKeyPress: React.KeyboardEventHandler<{}> = event => {
    if (event.key === "Enter" && this.inputValid()) {
      this.handleSubmit();
    }
  };

  /**
   * ## Input Handlers
   */
  update = (key: keyof CreateUserDto) => (value: any) => {
    const clone = Object.assign({}, this.state.create);
    clone[key] = value;
    this.setState({ create: clone });
  };
  handleChangeUsername = this.update("username");
  handleChangeDisplayname = this.update("displayname");
  handleChangePassword = this.update("password");
  handleChangeIsAdult = (
    ignored: React.ChangeEvent<HTMLInputElement>,
    checked: boolean
  ) => this.update("isAdult")(checked);
  handleChangeEmail = this.update("email");
  handleChangeRole = (event: React.ChangeEvent<HTMLInputElement>) =>
    this.update("role")(event.target.value as Roles);
  handleChangeChildren = this.update("children");

  hasChildren = (): boolean => {
    const { create: { role } } = this.state;
    return role === Roles.PARENT || role === Roles.MANAGER;
  };

  /**
   * ## Validation
   */
  usernameValid = (): boolean => isValidUsername(this.state.create.username);
  displaynameValid = (): boolean =>
    isValidDisplayname(this.state.create.displayname);
  emailValid = (): boolean => isValidEmail(this.state.create.email);
  passwordValid = (): boolean =>
    !this.state.create.password || isValidPassword(this.state.create.password);
  childrenValid = (): boolean =>
    !this.hasChildren() || this.state.create.children.length > 0;
  inputValid = (): boolean => isValidUser(this.state.create);

  render() {
    const { classes, show, fullScreen, getUser, students } = this.props;
    const { create, showImportUsers } = this.state;

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
                    value={create.username || ""}
                    label={lang().ui.createUser.usernameTitle}
                    onChange={this.handleChangeUsername}
                    validator={this.usernameValid}
                    required
                  />
                </Grid>
                <Grid item xs={12} lg={6}>
                  <TextInput
                    label={lang().ui.createUser.displaynameTitle}
                    value={create.displayname || ""}
                    onChange={this.handleChangeDisplayname}
                    validator={this.displaynameValid}
                    required
                  />
                </Grid>
                <Grid item xs={12} lg={6}>
                  <TextInput
                    label={lang().ui.createUser.emailTitle}
                    value={create.email || ""}
                    onChange={this.handleChangeEmail}
                    validator={this.emailValid}
                    type="email"
                    required
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextInput
                    label={lang().ui.createUser.passwordTitle}
                    value={create.password || ""}
                    onChange={this.handleChangePassword}
                    validator={this.passwordValid}
                    type="password"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    select
                    label="Rolle"
                    value={create.role || Roles.STUDENT}
                    onChange={this.handleChangeRole}
                    fullWidth
                    SelectProps={{ native: true }}
                    helperText="Wählen sie die Rolle des Nutzers aus."
                  >
                    {Object.keys(Roles).map(role => (
                      <option
                        key={(Roles as any)[role]}
                        value={(Roles as any)[role]}
                      >
                        {(Roles as any)[role]}
                      </option>
                    ))}
                  </TextField>
                </Grid>
                {this.hasChildren() && (
                  <Grid item xs={12}>
                    <ChildrenInput
                      children={create.children.map(getUser)}
                      students={students}
                      onChange={(u: UserN[]) =>
                        this.handleChangeChildren(u.map(u => u.get("id")))
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

export default withStyles(styles)(
  connect<StateProps, DispatchProps, OwnProps, AppState>(
    mapStateToProps,
    mapDispatchToProps
  )(withMobileDialog<Props>()(withErrorBoundary()(CreateUser)))
);
