/**
 * EntE
 * (c) 2017-present, Simon Knott <info@simonknott.de>
 *
 * This source code is licensed under the GNU Affero General Public License
 * found in the LICENSE file in the root directory of this source tree.
 */

import * as React from "react";
import withStyles, { WithStyles } from "@material-ui/core/styles/withStyles";
import {
  connect,
  MapStateToPropsParam,
  MapDispatchToPropsParam
} from "react-redux";

import { Action } from "redux";

import { withRouter, RouteComponentProps } from "react-router";
import {
  Button,
  Table,
  List,
  Grid,
  Checkbox,
  IconButton
} from "@material-ui/core";
import SignedAvatar from "../elements/SignedAvatar";
import TableHead from "@material-ui/core/TableHead";
import TableCell from "@material-ui/core/TableCell";
import TableRow from "@material-ui/core/TableRow";
import TableBody from "@material-ui/core/TableBody";
import Dialog from "@material-ui/core/Dialog/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContentText from "@material-ui/core/DialogContentText";
import Typography from "@material-ui/core/Typography/Typography";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import {
  AssignmentTurnedIn as AssignmentTurnedInIcon,
  AssignmentReturned as AssignmentReturnedIcon,
  Delete as DeleteIcon
} from "@material-ui/icons";
import withMobileDialog from "@material-ui/core/withMobileDialog";
import LoadingIndicator from "../elements/LoadingIndicator";
import { Roles } from "ente-types";
import {
  AppState,
  getEntry,
  getUser,
  getSlotsById,
  isLoading,
  getRole,
  getEntryRequest,
  unsignEntryRequest,
  patchForSchoolRequest,
  signEntryRequest,
  UserN,
  EntryN,
  SlotN,
  deleteEntryRequest
} from "../redux";
import withErrorBoundary from "../hocs/withErrorBoundary";
import { DeleteModal } from "../components/DeleteModal";
import { createTranslation } from "../helpers/createTranslation";

const lang = createTranslation({
  en: {
    sign: "Sign",
    close: "Close"
  },
  de: {
    sign: "Unterschreiben",
    close: "Schließen"
  }
});

/**
 * # Component Types
 */
interface RouteMatch {
  entryId: string;
}

interface InjectedProps {
  fullScreen: boolean;
}

interface StateProps {
  getEntry(id: string): EntryN;
  getUser(id: string): UserN;
  getSlots(ids: string[]): SlotN[];
  loading: boolean;
  role: Roles;
}
const mapStateToProps: MapStateToPropsParam<
  StateProps,
  OwnProps,
  AppState
> = state => ({
  getEntry: id => getEntry(id)(state),
  getUser: id => getUser(id)(state),
  getSlots: ids => getSlotsById(ids)(state),
  loading: isLoading(state),
  role: getRole(state)
});

interface DispatchProps {
  requestEntry(id: string): Action;
  signEntry(id: string): Action;
  unsignEntry(id: string): Action;
  patchForSchool(id: string, forSchool: boolean): Action;
  deleteEntry: (id: string) => void;
}

const mapDispatchToProps: MapDispatchToPropsParam<
  DispatchProps,
  OwnProps
> = dispatch => ({
  requestEntry: id => dispatch(getEntryRequest(id)),
  signEntry: id => dispatch(signEntryRequest(id)),
  unsignEntry: id => dispatch(unsignEntryRequest(id)),
  patchForSchool: (id, forSchool) =>
    dispatch(patchForSchoolRequest({ id, forSchool })),
  deleteEntry: id => dispatch(deleteEntryRequest(id))
});

interface OwnProps {}

type SpecificEntryProps = WithStyles &
  RouteComponentProps<RouteMatch> &
  InjectedProps &
  StateProps &
  DispatchProps;

interface SpecificEntryState {
  showDelete: boolean;
}

/**
 * # Component
 */
class SpecificEntry extends React.Component<
  SpecificEntryProps,
  SpecificEntryState
> {
  state: Readonly<SpecificEntryState> = {
    showDelete: false
  };

  componentDidMount() {
    const { entryId } = this.props.match.params;
    const user = this.props.getUser(entryId);

    if (!user) {
      this.props.requestEntry(entryId);
    }
  }

  onClose = () => this.props.history.push("/entries");

  render() {
    const { classes, loading } = this.props;
    const { entryId } = this.props.match.params;
    const entry = this.props.getEntry(entryId);
    const {
      role,
      patchForSchool,
      fullScreen,
      getUser,
      getSlots,
      signEntry,
      unsignEntry,
      deleteEntry
    } = this.props;
    const { showDelete } = this.state;

    return (
      <>
        <DeleteModal
          onClose={() => this.setState({ showDelete: false })}
          onDelete={() => {
            deleteEntry(entryId);
            this.onClose();
          }}
          show={showDelete}
          text="Sind sie sicher, dass sie diesen Eintrag löschen möchten?"
        />
        <Dialog open fullScreen={fullScreen} onClose={this.onClose} fullWidth>
          <DialogContent>
            {!!entry ? (
              <Grid container direction="column" spacing={24}>
                {role === Roles.MANAGER && (
                  <IconButton
                    aria-label="Löschen"
                    onClick={() => this.setState({ showDelete: true })}
                    className={classes.deleteButton}
                  >
                    <DeleteIcon fontSize="large" />
                  </IconButton>
                )}

                <Grid item>
                  <Typography variant="h6">Info</Typography>
                  <Typography variant="body1">
                    <i>ID:</i> {entry.get("id")} <br />
                    <i>Erstellt:</i> {entry.get("createdAt").toLocaleString()}{" "}
                    <br />
                    <i>Schulisch:</i>{" "}
                    {role === Roles.MANAGER ? (
                      <Checkbox
                        checked={entry.get("forSchool")}
                        onChange={() =>
                          patchForSchool(
                            entry.get("id"),
                            !entry.get("forSchool")
                          )
                        }
                      />
                    ) : entry.get("forSchool") ? (
                      "Ja"
                    ) : (
                      "Nein"
                    )}{" "}
                    <br />
                    <i>Schüler:</i>{" "}
                    {getUser(entry.get("studentId")).get("displayname")} <br />
                    <i>Datum:</i>{" "}
                    {!!entry.get("dateEnd")
                      ? `Von ${entry.get("date").toLocaleDateString()}
                bis ${entry.get("dateEnd")!.toLocaleDateString()}`
                      : entry.get("date").toLocaleDateString()}{" "}
                    <br />
                  </Typography>
                </Grid>

                {/* Slots */}
                <Grid item>
                  <Typography variant="h6">Stunden</Typography>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Datum</TableCell>
                        <TableCell>Von</TableCell>
                        <TableCell>Bis</TableCell>
                        <TableCell>Lehrer</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {getSlots(entry.get("slotIds")).map(slot => (
                        <TableRow key={slot.get("id")}>
                          <TableCell>
                            {slot.get("date").toLocaleDateString("de")}
                          </TableCell>
                          <TableCell>{slot.get("from")}</TableCell>
                          <TableCell>{slot.get("to")}</TableCell>
                          <TableCell>
                            {slot
                              .get("teacherId")
                              .cata(
                                () => "Gelöscht",
                                id => getUser(id).get("displayname")
                              )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </Grid>

                {/* Signed */}
                <Grid item>
                  <Typography variant="h6">Signiert</Typography>
                  <List>
                    {/* Admin */}
                    <ListItem>
                      <SignedAvatar signed={entry.get("signedManager")} />
                      <ListItemText primary="Stufenleiter" />
                      {role === Roles.MANAGER &&
                        (entry.get("signedManager") ? (
                          <ListItemSecondaryAction>
                            <Button
                              className={classes.unsignEntryButton}
                              onClick={() => unsignEntry(entry.get("id"))}
                            >
                              <AssignmentReturnedIcon />
                            </Button>
                          </ListItemSecondaryAction>
                        ) : (
                          <ListItemSecondaryAction>
                            <Button
                              className={classes.signEntryButton}
                              onClick={() => signEntry(entry.get("id"))}
                              variant="raised"
                            >
                              <AssignmentTurnedInIcon />
                            </Button>
                          </ListItemSecondaryAction>
                        ))}
                    </ListItem>

                    {/* Parents */}
                    <ListItem>
                      <SignedAvatar signed={entry.get("signedParent")} />
                      <ListItemText primary="Eltern" />
                      {!entry.get("signedParent") &&
                        role === Roles.PARENT && (
                          <ListItemSecondaryAction>
                            <Button
                              className={classes.signEntryButton}
                              onClick={() => signEntry(entry.get("id"))}
                            >
                              {lang.sign}
                              <AssignmentTurnedInIcon />
                            </Button>
                          </ListItemSecondaryAction>
                        )}
                    </ListItem>
                  </List>
                </Grid>
              </Grid>
            ) : (
              loading && <LoadingIndicator />
            )}
          </DialogContent>

          <DialogActions>
            <Button size="small" color="primary" onClick={this.onClose}>
              {lang.close}
            </Button>
          </DialogActions>
        </Dialog>
      </>
    );
  }
}

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(
    withMobileDialog<SpecificEntryProps>()(withErrorBoundary()(SpecificEntry))
  )
);
