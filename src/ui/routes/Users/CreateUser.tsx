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
  MapDispatchToPropsParam,
} from "react-redux";
import {
  Button,
  Grid,
  TextField,
  Typography,
  FormControlLabel,
  Checkbox,
} from "@material-ui/core";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import { Action } from "redux";
import {
  Roles,
  CreateUserDto,
  isValidDisplayname,
  isValidUsername,
  isValidEmail,
  isValidPassword,
  createDefaultCreateUserDto,
  roleHasBirthday,
  CreateUserDtoValidator,
  dateToIsoString,
} from "@@types";
import {
  getStudents,
  getUser,
  getUsers,
  createUsersRequest,
  AppState,
  UserN,
  roleHasChildren,
  roleHasClass,
} from "../../redux";
import TextInput from "../../elements/TextInput";
import ChildrenInput from "../../elements/ChildrenInput";
import withErrorBoundary from "../../hocs/withErrorBoundary";
import { PasswordRequirementsHint } from "../../elements/PasswordRequirementsHint";
import * as _ from "lodash";
import { Maybe } from "monet";
import {
  WithTranslation,
  withTranslation,
} from "../../helpers/with-translation";
import { DateInput } from "../../elements/DateInput";
import { RoleTranslation } from "../../roles.translation";
import { ClassPicker } from "../../elements/ClassPicker";
import { ResponsiveFullscreenDialog } from "../../components/ResponsiveFullscreenDialog";

export const lang = {
  en: {
    titles: {
      newUser: "New User",
      username: "Username",
      displayname: "Displayname",
      email: "Email",
      password: "Password",
      role: "Role",
      class: "Class / Graduation Year",
      birthday: "Birthday",
      isAdmin: "Administrator",
    },
    helpers: {
      chooseRoleOfUser: "Choose the users's role",
    },
    submit: "Submit",
    close: "Close",
    import: "Import",
    passwordSpec: PasswordRequirementsHint.en,
    roles: RoleTranslation.en,
  },
  de: {
    titles: {
      newUser: "Neuer Nutzer",
      username: "Nutzername",
      displayname: "Displayname",
      email: "Email",
      password: "Passwort",
      role: "Rolle",
      class: "Klasse / Abschluss-Jahrgang",
      birthday: "Geburtstag",
      isAdmin: "Administrator",
    },
    helpers: {
      chooseRoleOfUser: "Wählen Sie die Rolle des Nutzers aus",
    },
    submit: "Erstellen",
    close: "Schließen",
    import: "Importieren",
    passwordSpec: PasswordRequirementsHint.de,
    roles: RoleTranslation.de,
  },
};

const cleanUpDtoByRole = (dto: CreateUserDto): CreateUserDto => {
  const {
    birthday,
    displayname,
    email,
    children,
    password,
    role,
    username,
    class: _class,
    language,
    isAdmin,
  } = dto;

  const result: CreateUserDto = {
    displayname,
    email,
    password,
    role,
    username,
    language,
    isAdmin,
    children: [],
  };

  switch (role) {
    case Roles.MANAGER:
      result.class = _class;
      break;

    case Roles.PARENT:
      result.children = children;
      break;

    case Roles.STUDENT:
      result.birthday = birthday;
      result.class = _class;
      break;
  }

  return result;
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
}

interface CreateUserStateProps {
  students: UserN[];
  getUser(id: string): Maybe<UserN>;
  availableClasses: string[];
}
const mapStateToProps: MapStateToPropsParam<
  CreateUserStateProps,
  OwnProps,
  AppState
> = (state) => ({
  getUser: (id) => getUser(id)(state),
  students: getStudents(state),
  availableClasses: _.uniq(
    getUsers(state)
      .map((c) => c.get("class"))
      .filter((f) => !!f) as string[]
  ),
});

interface CreateUserDispatchProps {
  createUsers(...users: CreateUserDto[]): Action;
}
const mapDispatchToProps: MapDispatchToPropsParam<
  CreateUserDispatchProps,
  OwnProps
> = (dispatch) => ({
  createUsers: (...users: CreateUserDto[]) =>
    dispatch(createUsersRequest(users)),
});

type CreateUserProps = OwnProps &
  CreateUserStateProps &
  CreateUserDispatchProps &
  WithTranslation<typeof lang.en>;

/**
 * # Component
 */
export class CreateUser extends React.PureComponent<
  CreateUserProps,
  CreateUserState
> {
  /**
   * # Intialization
   */
  state: Readonly<CreateUserState> = {
    create: createDefaultCreateUserDto(),
  };

  /**
   * ## Action Handlers
   */
  handleGoBack = () => this.handleClose();

  handleClose = () => this.props.onClose();

  handleSubmit = () => {
    return this.props.createUsers(this.getCleanDto());
  };

  handleKeyPress: React.KeyboardEventHandler<{}> = (event) => {
    if (event.key === "Enter" && this.inputValid()) {
      this.handleSubmit();
    }
  };

  /**
   * ## Input Handlers
   */
  update = <K extends keyof CreateUserDto>(key: K) => (
    value: CreateUserDto[K]
  ) => {
    const clone = Object.assign({}, this.state.create);
    clone[key] = value;
    this.setState({ create: clone });
  };
  handleChangeUsername = this.update("username");
  handleChangeIsAdmin = this.update("isAdmin");
  handleChangeClass = this.update("class");
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
      create: { role },
    } = this.state;
    return roleHasChildren(role);
  };

  hasClass = (): boolean => {
    const {
      create: { role },
    } = this.state;
    return roleHasClass(role);
  };

  hasBirthday = (): boolean => {
    const {
      create: { role },
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
  inputValid = (): boolean =>
    CreateUserDtoValidator.validate(this.getCleanDto());

  getCleanDto = () => cleanUpDtoByRole(this.state.create);

  render() {
    const {
      show,
      getUser,
      students,
      translation,
      availableClasses,
    } = this.props;
    const { create } = this.state;

    return (
      <>
        <ResponsiveFullscreenDialog onClose={this.handleGoBack} open={show}>
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
                    {Object.keys(Roles).map((k) => (
                      <option key={(Roles as any)[k]} value={(Roles as any)[k]}>
                        {(translation.roles as any)[(Roles as any)[k]]}
                      </option>
                    ))}
                  </TextField>
                </Grid>
                <Grid item xs={12}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={create.isAdmin}
                        onChange={(evt) =>
                          this.handleChangeIsAdmin(evt.target.checked)
                        }
                        name="isAdmin"
                        color="primary"
                      />
                    }
                    label={translation.titles.isAdmin}
                  />
                </Grid>
                {this.hasChildren() && (
                  <Grid item xs={12}>
                    <ChildrenInput
                      children={create.children
                        .map(getUser)
                        .map((c) => c.some())}
                      students={students}
                      onChange={(u: UserN[]) =>
                        this.handleChangeChildren(u.map((u) => u.get("id")))
                      }
                    />
                  </Grid>
                )}
                {this.hasClass() && (
                  <Grid item xs={12}>
                    <ClassPicker
                      label={translation.titles.class}
                      availableClasses={availableClasses}
                      onChange={this.handleChangeClass}
                      value={create.class!}
                    />
                  </Grid>
                )}
                {this.hasBirthday() && (
                  <Grid item xs={12}>
                    <DateInput
                      value={create.birthday!}
                      label={translation.titles.birthday}
                      onChange={this.handleChangeBirthday}
                      maxDate={dateToIsoString(new Date())}
                    />
                  </Grid>
                )}
              </Grid>
            </form>
          </DialogContent>
          <DialogActions>
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
        </ResponsiveFullscreenDialog>
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
)(withTranslation(lang)(withErrorBoundary()(CreateUser)));
