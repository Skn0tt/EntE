/**
 * EntE
 * (c) 2017-present, Simon Knott <info@simonknott.de>
 *
 * This source code is licensed under the GNU Affero General Public License
 * found in the LICENSE file in the root directory of this source tree.
 */

import { AppState, createUsersRequest, getStudents } from "../../redux";
import { Button, Dialog, Grid } from "@material-ui/core";
import withMobileDialog from "@material-ui/core/withMobileDialog";
import DialogActions from "@material-ui/core/DialogActions";
import * as React from "react";
import Dropzone from "react-dropzone";
import { connect, MapStateToPropsParam } from "react-redux";
import { Action, Dispatch } from "redux";
import { CreateUserDto } from "ente-types";
import { parseCSVFromFile } from "../../helpers/parser";
import SignedAvatar from "../../elements/SignedAvatar";
import { createTranslation } from "../../helpers/createTranslation";
import { MessagesContext, MessagesContextValue } from "../../context/Messages";

const lang = createTranslation({
  en: {
    submit: "Import",
    close: "Close",
    dropzone: "Drop a .csv file here.",
    pleaseUploadCsvFile: "Please upload a .csv file."
  },
  de: {
    submit: "Importieren",
    close: "Schließen",
    dropzone: "Legen sie hier eine .csv-Datei ab.",
    pleaseUploadCsvFile: "Bitte laden sie eine .csv-Datei hoch."
  }
});

const isCsvFile = (f: File) => f.name.endsWith(".csv");

const readFile = async (f: File) =>
  new Promise<string>((resolve, reject) => {
    const r = new FileReader();
    r.onload = _ => resolve(r.result as string);
    r.onerror = reject;
    r.readAsText(f);
  });

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
  createUsers(users: CreateUserDto[]): void;
}
const mapDispatchToProps = (dispatch: Dispatch<Action>) => ({
  createUsers: (users: CreateUserDto[]) => dispatch(createUsersRequest(users))
});

interface InjectedProps {
  fullScreen: boolean;
}

interface ImportUsersState {
  users: CreateUserDto[];
  error: boolean;
}

type ImportUsersProps = ImportUsersOwnProps &
  ImportUsersDispatchProps &
  ImportUsersStateProps;

/**
 * # Component
 */
export class ImportUsers extends React.Component<
  ImportUsersProps & InjectedProps,
  ImportUsersState
> {
  /**
   * ## Intialization
   */
  state: ImportUsersState = {
    users: [],
    error: true
  };

  static contextType = MessagesContext;

  /**
   * # Handlers
   */
  handleClose = () => this.props.onClose();

  handleSubmit = () =>
    this.state.users.length !== 0 && this.props.createUsers(this.state.users);

  onDrop = async (accepted: File[]) => {
    const [file] = accepted;

    if (!file) {
      return;
    }

    if (!isCsvFile(file)) {
      this.props.addMessage(lang.pleaseUploadCsvFile);
      return;
    }

    try {
      const input = await readFile(file);
      const users = await parseCSVFromFile(input, this.props.usernames);
      this.setState({ users, error: false });
    } catch (error) {
      this.setState({ error: true });
      const { addMessages } = this.context as MessagesContextValue;
      addMessages(error.message);
    }
  };

  /**
   * # Validation
   */
  inputValid = (): boolean =>
    !this.state.error && this.state.users.length !== 0;

  /**
   * # Render
   */
  render() {
    const { show, fullScreen } = this.props;
    const { error } = this.state;

    return (
      <Dialog fullScreen={fullScreen} onClose={this.handleClose} open={show}>
        <Grid container direction="column">
          <Grid item xs={12}>
            <Dropzone onDrop={this.onDrop} className="dropzone">
              {lang.dropzone}
            </Dropzone>
          </Grid>
          <Grid item xs={12}>
            <SignedAvatar signed={!error} />
          </Grid>
        </Grid>
        <DialogActions>
          <Button
            onClick={this.handleClose}
            color="secondary"
            className="close"
          >
            {lang.close}
          </Button>
          <Button
            onClick={() => {
              this.handleSubmit();
              this.handleClose();
            }}
            disabled={!this.inputValid()}
            color="primary"
            className="submit"
          >
            {lang.submit}
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}

export default connect<
  ImportUsersStateProps,
  ImportUsersDispatchProps,
  ImportUsersOwnProps,
  AppState
>(mapStateToProps, mapDispatchToProps)(
  withMobileDialog<ImportUsersProps>()(ImportUsers)
);
