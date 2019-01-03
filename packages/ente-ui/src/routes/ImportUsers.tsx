/**
 * EntE
 * (c) 2017-present, Simon Knott <info@simonknott.de>
 *
 * This source code is licensed under the GNU Affero General Public License
 * found in the LICENSE file in the root directory of this source tree.
 */

import {
  Button,
  createStyles,
  Dialog,
  Grid,
  Theme,
  Typography,
  withStyles,
  WithStyles,
  DialogTitle,
  DialogContent,
  DialogContentText
} from "@material-ui/core";
import DialogActions from "@material-ui/core/DialogActions";
import withMobileDialog, {
  InjectedProps
} from "@material-ui/core/withMobileDialog";
import { ValidationError } from "class-validator";
import { CreateUserDto } from "ente-types";
import { Maybe, None, Some } from "monet";
import * as React from "react";
import Dropzone from "react-dropzone";
import {
  connect,
  MapStateToPropsParam,
  MapDispatchToPropsParam
} from "react-redux";
import { parseCSVFromFile } from "../helpers/parser";
import { AppState, getStudents, UserN, importUsersRequest } from "../redux";
import * as _ from "lodash";
import ErrorDisplay from "./Users/ErrorDisplay";
import { UserTable } from "./Users/UserTable";
import { makeTranslationHook } from "../helpers/makeTranslationHook";
import { CheckboxWithDescription } from "../components/CheckboxWithDescription";

const useTranslation = makeTranslationHook({
  en: {
    submit: "Import",
    title: "Import",
    close: "Close",
    dropzone: "Drop a .csv file or click here.",
    pleaseUploadCsvFile: "Please upload a .csv file.",
    deleteEntries: {
      title: "Delete all entries",
      caption:
        "Delete all entries and the corresponding slots, for example at the start of a term."
    },
    deleteUsers: {
      title: "Delete all users",
      caption:
        "Delete all users that are not contained nor referenced by the import, for example at the start of a term."
    },
    description: `
      Users whose usernames are already present in the database are updated using the data from the import.
      New users are created.
      If a new user's import data contains no password, he will receive an invitation email.

      Beware: In order for the update to work, usernames need to be consistent with the last import.
    `.trim()
  },
  de: {
    submit: "Importieren",
    title: "Importieren",
    close: "Schließen",
    dropzone: "Legen Sie eine .csv-Datei ab oder klicken Sie hier.",
    pleaseUploadCsvFile: "Bitte laden Sie eine .csv-Datei hoch.",
    deleteEntries: {
      title: "Alle Einträge löschen",
      caption:
        "Alle bestehenden Einträge sowie die zugehörigen Stunden löschen, zum Beispiel am Schuljahresbeginn."
    },
    deleteUsers: {
      title: "Alle Nutzer löschen",
      caption:
        "Alle Nutzer löschen, die nicht im Import enthalten sind oder referenziert werden, zum Beispiel am Schuljahresbeginn."
    },
    description: `
      Nutzer, deren Nutzernamen schon in der Datenbank enthalten sind, werden mit den Daten aus dem Import aktualisiert.
      Neue Nutzer werden erstellt.
      Enthalten die Import-Daten eines neuen Nutzers kein Passwort, so erhält er eine Einladungs-Email.

      Achtung: Damit die Aktualisierung fehlerlos funktionieren kann, muss die Vergabe der Nutzernamen identisch zum letzten Import sein.
    `.trim()
  }
});

const toUserN = (u: CreateUserDto): UserN => {
  return new UserN({
    username: u.username,
    childrenIds: [],
    email: u.email,
    displayname: u.displayname,
    graduationYear: u.graduationYear,
    birthday: u.birthday,
    id: u.username,
    role: u.role
  });
};

const readFile = async (f: File) => {
  const response = new Response(f);
  return await response.text();
};

/**
 * # Component Types
 */
interface ImportUsersOwnProps {
  onClose(): void;
  show: boolean;
}

interface ImportUsersStateProps {
  usernames: string[];
}
const mapStateToProps: MapStateToPropsParam<
  ImportUsersStateProps,
  ImportUsersOwnProps,
  AppState
> = state => ({
  usernames: getStudents(state).map(u => u.get("username"))
});

interface ImportUsersDispatchProps {
  importUsers: (
    dtos: CreateUserDto[],
    deleteEntries: boolean,
    deleteUsers: boolean
  ) => void;
}
const mapDispatchToProps: MapDispatchToPropsParam<
  ImportUsersDispatchProps,
  ImportUsersOwnProps
> = dispatch => ({
  importUsers: (dtos, deleteEntries, deleteUsers) =>
    dispatch(importUsersRequest({ dtos, deleteEntries, deleteUsers }))
});

type ImportUsersProps = ImportUsersOwnProps &
  ImportUsersStateProps &
  ImportUsersDispatchProps &
  WithStyles<"dropzone"> &
  InjectedProps;

const ImportUsers: React.FunctionComponent<ImportUsersProps> = props => {
  const { fullScreen, show, classes, onClose, usernames, importUsers } = props;
  const translation = useTranslation();

  const [deleteEntries, setDeleteEntries] = React.useState(false);
  const [deleteUsers, setDeleteUsers] = React.useState(false);
  const [users, setUsers] = React.useState<Maybe<CreateUserDto[]>>(None());
  const [errors, setErrors] = React.useState<
    Maybe<(ValidationError | string)[]>
  >(None());

  const handleSubmit = React.useCallback(
    () => {
      users.forEach(dtos => importUsers(dtos, deleteEntries, deleteUsers));
    },
    [users, importUsers, deleteEntries, deleteUsers]
  );

  const onDrop = async (accepted: File[]) => {
    const [file] = accepted;

    if (!file) {
      return;
    }

    const input = await readFile(file);
    const result = await parseCSVFromFile(input, usernames);
    result.forEach(success => {
      setUsers(Some(success));
      setErrors(None());
    });
    result.forEachFail(fail => {
      setUsers(None());
      setErrors(Some(fail));
    });
  };

  const inputIsValid = users.isSome();

  return (
    <Dialog fullScreen={fullScreen} onClose={onClose} open={show}>
      <DialogTitle>{translation.title}</DialogTitle>
      <DialogContent>
        <Grid container spacing={24} direction="column">
          <Grid item xs={12}>
            <DialogContentText>{translation.description}</DialogContentText>
          </Grid>
          <Grid item xs={12}>
            <Grid container spacing={16} direction="column">
              <Grid item xs={12}>
                <CheckboxWithDescription
                  title={translation.deleteUsers.title}
                  caption={translation.deleteUsers.caption}
                  onChange={setDeleteUsers}
                />
              </Grid>
              <Grid item xs={12}>
                <CheckboxWithDescription
                  title={translation.deleteEntries.title}
                  caption={translation.deleteEntries.caption}
                  onChange={setDeleteEntries}
                />
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12}>
            <Dropzone
              onDrop={onDrop}
              className={classes.dropzone}
              accept=".csv"
            >
              <Typography variant="body1">{translation.dropzone}</Typography>
            </Dropzone>
          </Grid>
          {users
            .map(users => (
              <Grid item xs={12}>
                <UserTable users={users.map(toUserN)} />
              </Grid>
            ))
            .orSome(<></>)}
          {errors
            .map(errors => (
              <Grid item xs={12}>
                <ErrorDisplay errors={errors} />
              </Grid>
            ))
            .orSome(<></>)}
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary" className="close">
          {translation.close}
        </Button>
        <Button
          onClick={handleSubmit}
          disabled={!inputIsValid}
          color="primary"
          className="submit"
        >
          {translation.submit}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const styles = (theme: Theme) =>
  createStyles({
    dropzone: {
      minHeight: 24,
      border: `1px solid ${theme.palette.grey[300]}`,
      borderRadius: theme.spacing.unit,
      padding: theme.spacing.unit * 2,
      boxSizing: "border-box"
    }
  });

export default connect<
  ImportUsersStateProps,
  ImportUsersDispatchProps,
  ImportUsersOwnProps,
  AppState
>(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(withMobileDialog<ImportUsersProps>()(ImportUsers)));
