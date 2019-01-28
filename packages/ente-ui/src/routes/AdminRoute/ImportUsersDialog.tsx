/**
 * EntE
 * (c) 2017-present, Simon Knott <info@simonknott.de>
 *
 * This source code is licensed under the GNU Affero General Public License
 * found in the LICENSE file in the root directory of this source tree.
 */

import {
  Button,
  Dialog,
  Grid,
  DialogTitle,
  DialogContent,
  DialogContentText
} from "@material-ui/core";
import DialogActions from "@material-ui/core/DialogActions";
import withMobileDialog, {
  InjectedProps
} from "@material-ui/core/withMobileDialog";
import { CreateUserDto } from "ente-types";
import { Maybe, None } from "monet";
import * as React from "react";
import {
  connect,
  MapStateToPropsParam,
  MapDispatchToPropsParam
} from "react-redux";
import { AppState, UserN, importUsersRequest } from "../../redux";
import * as _ from "lodash";
import { UserTable } from "../Users/UserTable";
import { makeTranslationHook } from "../../helpers/makeTranslationHook";
import { CheckboxWithDescription } from "../../components/CheckboxWithDescription";
import CsvImportMethod from "./CsvImportMethod";
import { DropdownInput } from "../../elements/DropdownInput";
import { SchiLDImportMethod } from "./SchiLDImportMethod";

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
    importMethods: {
      schild: "SchiLD",
      csv: "CSV"
    },
    importMethodLabel: "Format",
    deleteUsers: {
      title: "Delete all users",
      caption:
        "Delete all users that are not contained nor referenced by the import."
    },
    deleteStudentsAndParents: {
      title: "Delete students and parents",
      caption:
        "Delete students and parents that are neither contained nor referenced by the import, for example at the start of a term."
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
    importMethodLabel: "Datenformat",
    importMethods: {
      schild: "SchiLD",
      csv: "CSV"
    },
    deleteUsers: {
      title: "Alle Nutzer löschen",
      caption:
        "Alle Nutzer löschen, die nicht im Import enthalten sind oder referenziert werden. Nützlich, um den Server zurückzusetzen."
    },
    deleteStudentsAndParents: {
      title: "Schüler und Eltern löschen",
      caption:
        "Schüler und Eltern löschen, die nicht im Import enthalten sind oder referenziert werden, zum Beispiel am Schuljahresbeginn."
    },
    description: `
      Nutzer, deren Nutzernamen schon in der Datenbank enthalten sind, werden mit den Daten aus dem Import aktualisiert.
      Neue Nutzer werden erstellt.
      Enthalten die Import-Daten eines neuen Nutzers kein Passwort, so erhält er eine Einladungs-Email.

      Achtung: Damit die Aktualisierung fehlerfrei funktionieren kann, muss die Vergabe der Nutzernamen identisch zum letzten Import sein.
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

const importMethods: ImportMethod[] = ["csv", "schild"];
type ImportMethod = "csv" | "schild";

/**
 * # Component Types
 */
interface ImportUsersDialogOwnProps {
  onClose(): void;
  show: boolean;
}

interface ImportUsersDialogStateProps {}
const mapStateToProps: MapStateToPropsParam<
  ImportUsersDialogStateProps,
  ImportUsersDialogOwnProps,
  AppState
> = state => ({});

interface ImportUsersDialogDispatchProps {
  importUsers: (
    dtos: CreateUserDto[],
    deleteEntries: boolean,
    deleteUsers: boolean,
    deleteStudentsAndParents: boolean
  ) => void;
}
const mapDispatchToProps: MapDispatchToPropsParam<
  ImportUsersDialogDispatchProps,
  ImportUsersDialogOwnProps
> = dispatch => ({
  importUsers: (dtos, deleteEntries, deleteUsers, deleteStudentsAndParents) =>
    dispatch(
      importUsersRequest({
        dtos,
        deleteEntries,
        deleteUsers,
        deleteStudentsAndParents
      })
    )
});

type ImportUsersDialogProps = ImportUsersDialogOwnProps &
  ImportUsersDialogStateProps &
  ImportUsersDialogDispatchProps &
  InjectedProps;

const ImportUsersDialog: React.FunctionComponent<
  ImportUsersDialogProps
> = props => {
  const { fullScreen, show, onClose, importUsers } = props;
  const translation = useTranslation();

  const [deleteEntries, setDeleteEntries] = React.useState(false);
  const [deleteUsers, setDeleteUsers] = React.useState(false);
  const [
    deleteStudentsAndParents,
    setDeleteStudentsAndParents
  ] = React.useState(false);
  const [importMethod, setImportMethod] = React.useState<ImportMethod>("csv");
  const [users, setUsers] = React.useState<Maybe<CreateUserDto[]>>(None());

  const handleSubmit = React.useCallback(
    () => {
      users.forEach(dtos =>
        importUsers(dtos, deleteEntries, deleteUsers, deleteStudentsAndParents)
      );
    },
    [users, importUsers, deleteEntries, deleteUsers, deleteStudentsAndParents]
  );

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
                  title={translation.deleteStudentsAndParents.title}
                  caption={translation.deleteStudentsAndParents.caption}
                  onChange={setDeleteStudentsAndParents}
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
            <DropdownInput
              options={importMethods}
              fullWidth
              label={translation.importMethodLabel}
              getOptionLabel={k => translation.importMethods[k]}
              value={importMethod}
              onChange={setImportMethod}
            />
          </Grid>

          {importMethod === "csv" && <CsvImportMethod onImport={setUsers} />}
          {importMethod === "schild" && (
            <SchiLDImportMethod onImport={setUsers} />
          )}

          {users
            .map(users => (
              <Grid item xs={12}>
                <UserTable users={users.map(toUserN)} />
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

export default connect<
  ImportUsersDialogStateProps,
  ImportUsersDialogDispatchProps,
  ImportUsersDialogOwnProps,
  AppState
>(
  mapStateToProps,
  mapDispatchToProps
)(withMobileDialog<ImportUsersDialogProps>()(ImportUsersDialog));
