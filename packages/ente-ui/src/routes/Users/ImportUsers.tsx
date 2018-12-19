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
  DialogContent
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
import { connect, MapStateToPropsParam } from "react-redux";
import { Action, Dispatch } from "redux";
import { createTranslation } from "../../helpers/createTranslation";
import { parseCSVFromFile } from "../../helpers/parser";
import { AppState, createUsersRequest, getStudents, UserN } from "../../redux";
import * as _ from "lodash";
import ErrorDisplay from "./ErrorDisplay";
import { UserTable } from "./UserTable";

const lang = createTranslation({
  en: {
    submit: "Import",
    title: "Import",
    close: "Close",
    dropzone: "Drop a .csv file or click here.",
    pleaseUploadCsvFile: "Please upload a .csv file."
  },
  de: {
    submit: "Importieren",
    title: "Importieren",
    close: "Schließen",
    dropzone: "Legen sie eine .csv-Datei ab oder klicken sie hier.",
    pleaseUploadCsvFile: "Bitte laden sie eine .csv-Datei hoch."
  }
});

const toUserN = (u: CreateUserDto): UserN => {
  return new UserN({
    username: u.username,
    childrenIds: [],
    email: u.email,
    displayname: u.displayname,
    graduationYear: u.graduationYear,
    isAdult: u.isAdult,
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
  onImport: (u: CreateUserDto[]) => void;
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

type ImportUsersProps = ImportUsersOwnProps &
  ImportUsersStateProps &
  WithStyles<"dropzone"> &
  InjectedProps;

export const ImportUsers: React.FunctionComponent<ImportUsersProps> = props => {
  const { fullScreen, show, classes, onClose, usernames, onImport } = props;

  const [users, setUsers] = React.useState<Maybe<CreateUserDto[]>>(None());
  const [errors, setErrors] = React.useState<
    Maybe<(ValidationError | string)[]>
  >(None());

  const handleSubmit = () => {
    users.forEach(onImport);
  };

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
      <DialogTitle>{lang.title}</DialogTitle>
      <DialogContent>
        <Grid container spacing={24} direction="column">
          <Grid item xs={12}>
            <Dropzone
              onDrop={onDrop}
              className={classes.dropzone}
              accept=".csv"
            >
              <Typography variant="body1">{lang.dropzone}</Typography>
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
          {lang.close}
        </Button>
        <Button
          onClick={handleSubmit}
          disabled={!inputIsValid}
          color="primary"
          className="submit"
        >
          {lang.submit}
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
  {},
  ImportUsersOwnProps,
  AppState
>(mapStateToProps)(
  withStyles(styles)(withMobileDialog<ImportUsersProps>()(ImportUsers))
);
