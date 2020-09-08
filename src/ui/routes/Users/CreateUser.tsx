/**
 * EntE
 * (c) 2017-present, Simon Knott <info@simonknott.de>
 *
 * This source code is licensed under the GNU Affero General Public License
 * found in the LICENSE file in the root directory of this source tree.
 */

import * as React from "react";
import { useDispatch, useSelector } from "react-redux";
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
import {
  Roles,
  CreateUserDto,
  isValidName,
  isValidUsername,
  isValidEmail,
  isValidPassword,
  createDefaultCreateUserDto,
  roleHasBirthday,
  CreateUserDtoValidator,
  dateToIsoString,
} from "@@types";
import {
  getUsers,
  createUsersRequest,
  UserN,
  roleHasChildren,
  roleHasClass,
} from "../../redux";
import TextInput from "../../elements/TextInput";
import ChildrenInput from "../../elements/ChildrenInput";
import withErrorBoundary from "../../hocs/withErrorBoundary";
import { PasswordRequirementsHint } from "../../elements/PasswordRequirementsHint";
import * as _ from "lodash";
import { DateInput } from "../../elements/DateInput";
import { RoleTranslation } from "../../roles.translation";
import { ClassPicker } from "../../elements/ClassPicker";
import { ResponsiveFullscreenDialog } from "../../components/ResponsiveFullscreenDialog";
import { makeTranslationHook } from "ui/helpers/makeTranslationHook";
import { useDocsLink } from "ui/useDocsLink";
import { DialogInfoButton } from "ui/elements/DialogInfoButton";

export const lang = {
  en: {
    titles: {
      newUser: "New User",
      username: "Username",
      firstName: "First Name",
      lastName: "Last Name",
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
      firstName: "Vorname",
      lastName: "Nachname",
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

const useLang = makeTranslationHook(lang);

const cleanUpDtoByRole = (dto: CreateUserDto): CreateUserDto => {
  const {
    birthday,
    firstName,
    lastName,
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
    firstName,
    lastName,
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

interface CreateUserOwnProps {
  onClose(): void;
  show: boolean;
}

function CreateUser(props: CreateUserOwnProps) {
  const translation = useLang();

  const dispatch = useDispatch();

  const users = useSelector(getUsers);
  const usersById = _.keyBy(users, (u) => u.get("id"));
  const availableClasses = _.uniq(
    users.map((u) => u.get("class")).filter(_.isString)
  );

  const [create, setCreate] = React.useState(createDefaultCreateUserDto());
  const cleanCreate = cleanUpDtoByRole(create);
  const createIsValid = CreateUserDtoValidator.validate(cleanCreate);

  const handleSubmit = React.useCallback(() => {
    dispatch(createUsersRequest(cleanCreate));
  }, [cleanCreate, dispatch]);

  const update = <K extends keyof CreateUserDto>(key: K) => (
    value: CreateUserDto[K]
  ) => {
    setCreate((old) => {
      return {
        ...old,
        [key]: value,
      };
    });
  };

  const handleKeyPress = React.useCallback(
    (evt: React.KeyboardEvent<{}>) => {
      if (evt.key === "Enter" && createIsValid) {
        handleSubmit();
      }
    },
    [handleSubmit, createIsValid]
  );

  return (
    <ResponsiveFullscreenDialog onClose={props.onClose} open={props.show}>
      <DialogInfoButton href={useDocsLink("administration/user-management")} />
      <DialogTitle>{translation.titles.newUser}</DialogTitle>
      <DialogContent>
        <form onKeyPress={handleKeyPress}>
          <Grid container direction="row" spacing={8}>
            <Grid item xs={12} lg={6}>
              <TextInput
                label={translation.titles.firstName}
                value={create.firstName || ""}
                onChange={update("firstName")}
                validator={isValidName}
                required
              />
            </Grid>
            <Grid item xs={12} lg={6}>
              <TextInput
                label={translation.titles.lastName}
                value={create.lastName || ""}
                onChange={update("lastName")}
                validator={isValidName}
                required
              />
            </Grid>
            <Grid item xs={12} lg={6}>
              <TextInput
                value={create.username || ""}
                label={translation.titles.username}
                onChange={update("username")}
                validator={isValidUsername}
                required
              />
            </Grid>
            <Grid item xs={12} lg={6}>
              <TextInput
                label={translation.titles.email}
                value={create.email || ""}
                onChange={update("email")}
                validator={isValidEmail}
                type="email"
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextInput
                label={translation.titles.password}
                value={create.password || ""}
                onChange={(pw) => update("password")(pw || undefined)}
                validator={isValidPassword}
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
                onChange={(evt) => update("role")(evt.target.value as Roles)}
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
                    onChange={(evt) => update("isAdmin")(evt.target.checked)}
                    name="isAdmin"
                    color="primary"
                  />
                }
                label={translation.titles.isAdmin}
              />
            </Grid>
            {roleHasChildren(create.role) && (
              <Grid item xs={12}>
                <ChildrenInput
                  children={create.children.map((uid) => usersById[uid])}
                  students={users.filter(
                    (u) => u.get("role") === Roles.STUDENT
                  )}
                  onChange={(u: UserN[]) =>
                    update("children")(u.map((u) => u.get("id")))
                  }
                />
              </Grid>
            )}
            {roleHasClass(create.role) && (
              <Grid item xs={12}>
                <ClassPicker
                  label={translation.titles.class}
                  availableClasses={availableClasses}
                  onChange={update("class")}
                  value={create.class!}
                />
              </Grid>
            )}
            {roleHasBirthday(create.role) && (
              <Grid item xs={12}>
                <DateInput
                  value={create.birthday!}
                  label={translation.titles.birthday}
                  onChange={update("birthday")}
                  maxDate={dateToIsoString(new Date())}
                />
              </Grid>
            )}
          </Grid>
        </form>
      </DialogContent>
      <DialogActions>
        <Button onClick={props.onClose} color="secondary" className="close">
          {translation.close}
        </Button>
        <Button
          onClick={() => {
            handleSubmit();
            props.onClose();
          }}
          disabled={!createIsValid}
          color="primary"
        >
          {translation.submit}
        </Button>
      </DialogActions>
    </ResponsiveFullscreenDialog>
  );
}

export default withErrorBoundary()(CreateUser);
