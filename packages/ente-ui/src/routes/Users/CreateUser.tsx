/**
 * EntE
 * (c) 2017-present, Simon Knott <info@simonknott.de>
 *
 * This source code is licensed under the GNU Affero General Public License
 * found in the LICENSE file in the root directory of this source tree.
 */

import * as React from "react";
import {
  connect,
  MapStateToPropsParam,
  MapDispatchToPropsParam
} from "react-redux";

import { Dialog, Button, Grid, TextField, Typography } from "@material-ui/core";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import withMobileDialog, {
  InjectedProps
} from "@material-ui/core/withMobileDialog";
import { Action } from "redux";
import ImportUsers from "./ImportUsers";
import {
  Roles,
  CreateUserDto,
  isValidDisplayname,
  isValidUsername,
  isValidEmail,
  isValidPassword,
  createDefaultCreateUserDto,
  isValidCreateUserDto,
  roleHasBirthday
} from "ente-types";
import {
  getStudents,
  getUser,
  createUsersRequest,
  AppState,
  UserN,
  roleHasChildren,
  roleHasGradYear
} from "../../redux";
import TextInput from "../../elements/TextInput";
import ChildrenInput from "../../elements/ChildrenInput";
import withErrorBoundary from "../../hocs/withErrorBoundary";
import { YearPicker } from "../../elements/YearPicker";
import { PasswordRequirementsHint } from "../../elements/PasswordRequirementsHint";
import * as _ from "lodash";
import { Maybe } from "monet";
import {
  WithTranslation,
  withTranslation
} from "../../helpers/with-translation";
import { DateInput } from "../../elements/DateInput";

export const lang = {
  en: {
    titles: {
      newUser: "New User",
      username: "Username",
      displayname: "Displayname",
      email: "Email",
      password: "Password",
      role: "Role",
      gradYear: "Graduation Year",
      birthday: "Birthday"
    },
    helpers: {
      chooseRoleOfUser: "Choose the users's role"
    },
    submit: "Submit",
    close: "Close",
    import: "Import",
    passwordSpec: PasswordRequirementsHint.en
  },
  de: {
    titles: {
      newUser: "Neuer Nutzer",
      username: "Nutzername",
      displayname: "Displayname",
      email: "Email",
      password: "Passwort",
      role: "Rolle",
      gradYear: "Abschluss-Jahrgang",
      birthday: "Geburtstag"
    },
    helpers: {
      chooseRoleOfUser: "Wählen Sie die Rolle des Nutzers aus"
    },
    submit: "Erstellen",
    close: "Schließen",
    import: "Importieren",
    passwordSpec: PasswordRequirementsHint.de
  }
};

/**
 * # Component Types
 */
interface OwnProps {
  onClose(): void;
  show: boolean;
}

interface CreateUserState {
  create: CreateUserDto;
  showImportUsers: boolean;
}

interface CreateUserStateProps {
  students: UserN[];
  getUser(id: string): Maybe<UserN>;
}
const mapStateToProps: MapStateToPropsParam<
  CreateUserStateProps,
  OwnProps,
  AppState
> = state => ({
  getUser: id => getUser(id)(state),
  students: getStudents(state)
});

interface CreateUserDispatchProps {
  createUsers(...users: CreateUserDto[]): Action;
}
const mapDispatchToProps: MapDispatchToPropsParam<
  CreateUserDispatchProps,
  OwnProps
> = dispatch => ({
  createUsers: (...users: CreateUserDto[]) =>
    dispatch(createUsersRequest(users))
});

type CreateUserProps = OwnProps &
  CreateUserStateProps &
  CreateUserDispatchProps &
  WithTranslation<typeof lang.en> &
  InjectedProps;

/**
 * # Component
 */
export class CreateUser extends React.Component<
  CreateUserProps,
  CreateUserState
> {
  /**
   * # Intialization
   */
  state: Readonly<CreateUserState> = {
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
    return this.props.createUsers(this.state.create);
  };

  handleKeyPress: React.KeyboardEventHandler<{}> = event => {
    if (event.key === "Enter" && this.inputValid()) {
      this.handleSubmit();
    }
  };

  handleImport = (u: CreateUserDto[]) => {
    this.props.createUsers(...u);
    this.handleCloseImport();
    this.handleClose();
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
  handleChangeYear = this.update("graduationYear");
  handleChangeDisplayname = this.update("displayname");
  handleChangePassword = (value: string) => {
    const newValue = value === "" ? undefined : value;
    this.update("password")(newValue);
  };
  handleChangeBirthday = (birthday: string) =>
    this.update("birthday")(birthday);
  handleChangeEmail = this.update("email");
  handleChangeRole = (event: React.ChangeEvent<HTMLInputElement>) =>
    this.update("role")(event.target.value as Roles);
  handleChangeChildren = this.update("children");

  hasChildren = (): boolean => {
    const {
      create: { role }
    } = this.state;
    return roleHasChildren(role);
  };

  hasGradYear = (): boolean => {
    const {
      create: { role }
    } = this.state;
    return roleHasGradYear(role);
  };

  hasBirthday = (): boolean => {
    const {
      create: { role }
    } = this.state;
    return roleHasBirthday(role);
  };

  /**
   * ## Validation
   */
  usernameValid = (): boolean => isValidUsername(this.state.create.username);
  displaynameValid = (): boolean =>
    isValidDisplayname(this.state.create.displayname);
  emailValid = (): boolean => isValidEmail(this.state.create.email);
  passwordValid = (): boolean =>
    _.isUndefined(this.state.create.password) ||
    isValidPassword(this.state.create.password);
  childrenValid = (): boolean =>
    !this.hasChildren() || this.state.create.children.length > 0;
  inputValid = (): boolean => isValidCreateUserDto(this.state.create);

  render() {
    const { show, fullScreen, getUser, students, translation } = this.props;
    const { create, showImportUsers } = this.state;

    return (
      <>
        <Dialog fullScreen={fullScreen} onClose={this.handleGoBack} open={show}>
          <DialogTitle>{translation.titles.newUser}</DialogTitle>
          <DialogContent>
            <form onKeyPress={this.handleKeyPress}>
              <Grid container direction="row">
                <Grid item xs={12} lg={6}>
                  <TextInput
                    value={create.username || ""}
                    label={translation.titles.username}
                    onChange={this.handleChangeUsername}
                    validator={this.usernameValid}
                    required
                  />
                </Grid>
                <Grid item xs={12} lg={6}>
                  <TextInput
                    label={translation.titles.displayname}
                    value={create.displayname || ""}
                    onChange={this.handleChangeDisplayname}
                    validator={this.displaynameValid}
                    required
                  />
                </Grid>
                <Grid item xs={12} lg={6}>
                  <TextInput
                    label={translation.titles.email}
                    value={create.email || ""}
                    onChange={this.handleChangeEmail}
                    validator={this.emailValid}
                    type="email"
                    required
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextInput
                    label={translation.titles.password}
                    value={create.password || ""}
                    onChange={this.handleChangePassword}
                    validator={this.passwordValid}
                    type="password"
                  />
                </Grid>
                <Typography variant="body1">
                  <translation.passwordSpec />
                </Typography>
                <Grid item xs={12}>
                  <TextField
                    select
                    label={translation.titles.role}
                    value={create.role || Roles.STUDENT}
                    onChange={this.handleChangeRole}
                    fullWidth
                    SelectProps={{ native: true }}
                    helperText={translation.helpers.chooseRoleOfUser}
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
                      children={create.children.map(getUser).map(c => c.some())}
                      students={students}
                      onChange={(u: UserN[]) =>
                        this.handleChangeChildren(u.map(u => u.get("id")))
                      }
                    />
                  </Grid>
                )}
                {this.hasGradYear() && (
                  <Grid item xs={12}>
                    <YearPicker
                      label={translation.titles.gradYear}
                      amount={5}
                      onChange={this.handleChangeYear}
                      value={create.graduationYear!}
                    />
                  </Grid>
                )}
                {this.hasBirthday() && (
                  <Grid item xs={12}>
                    <DateInput
                      value={create.birthday!}
                      isValid={_ => true}
                      label={translation.titles.birthday}
                      onChange={this.handleChangeBirthday}
                      maxDate={Date.now()}
                    />
                  </Grid>
                )}
              </Grid>
            </form>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleShowImport}>
              {translation.import}
            </Button>
            <Button
              onClick={this.handleClose}
              color="secondary"
              className="close"
            >
              {translation.close}
            </Button>
            <Button
              onClick={() => {
                this.handleSubmit();
                this.handleClose();
              }}
              disabled={!this.inputValid()}
              color="primary"
            >
              {translation.submit}
            </Button>
          </DialogActions>
        </Dialog>
        <ImportUsers
          onClose={this.handleCloseImport}
          show={showImportUsers}
          onImport={this.handleImport}
        />
      </>
    );
  }
}

export default connect<
  CreateUserStateProps,
  CreateUserDispatchProps,
  OwnProps,
  AppState
>(
  mapStateToProps,
  mapDispatchToProps
)(
  withTranslation(lang)(
    withMobileDialog<CreateUserProps>()(withErrorBoundary()(CreateUser))
  )
);
