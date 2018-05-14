/**
 * EntE
 * (c) 2017-present, Simon Knott <info@simonknott.de>
 *
 * This source code is licensed under the GNU Affero General Public License
 * found in the LICENSE file in the root directory of this source tree.
 */

import * as React from "react";
import withStyles, { WithStyles } from "material-ui/styles/withStyles";
import {
  connect,
  Dispatch,
  MapStateToPropsParam,
  MapDispatchToPropsParam
} from "react-redux";
import styles from "./styles";

import { Action } from "redux";

import { withRouter, RouteComponentProps } from "react-router";
import { Button, Table, List, Grid, Checkbox } from "material-ui";
import SignedAvatar from "./elements/SignedAvatar";
import UnsignedAvatar from "./elements/UnsignedAvatar";
import TableHead from "material-ui/Table/TableHead";
import TableCell from "material-ui/Table/TableCell";
import TableRow from "material-ui/Table/TableRow";
import TableBody from "material-ui/Table/TableBody";
import Dialog from "material-ui/Dialog/Dialog";
import DialogContent from "material-ui/Dialog/DialogContent";
import DialogActions from "material-ui/Dialog/DialogActions";
import DialogContentText from "material-ui/Dialog/DialogContentText";
import Typography from "material-ui/Typography/Typography";
import ListItem from "material-ui/List/ListItem";
import ListItemText from "material-ui/List/ListItemText";
import ListItemSecondaryAction from "material-ui/List/ListItemSecondaryAction";
import {
  AssignmentTurnedIn as AssignmentTurnedInIcon,
  AssignmentReturned as AssignmentReturnedIcon
} from "material-ui-icons";
import withMobileDialog from "material-ui/Dialog/withMobileDialog";
import LoadingIndicator from "../../elements/LoadingIndicator";
import { Roles, EntryId, UserId, SlotId } from "ente-types";
import {
  Entry,
  User,
  Slot,
  AppState,
  getEntry,
  getUser,
  getSlotsById,
  isLoading,
  getRole,
  getEntryRequest,
  unsignEntryRequest,
  patchForSchoolRequest,
  signEntryRequest
} from "ente-redux";
import lang from "ente-lang";

/**
 * # Component Types
 */
interface RouteMatch {
  entryId: EntryId;
}

interface InjectedProps {
  fullScreen: boolean;
}

interface StateProps {
  getEntry(id: EntryId): Entry;
  getUser(id: UserId): User;
  getSlots(ids: SlotId[]): Slot[];
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
  requestEntry(id: EntryId): Action;
  signEntry(id: EntryId): Action;
  unsignEntry(id: EntryId): Action;
  patchForSchool(id: EntryId, forSchool: boolean): Action;
}

const mapDispatchToProps: MapDispatchToPropsParam<
  DispatchProps,
  OwnProps
> = dispatch => ({
  requestEntry: id => dispatch(getEntryRequest(id)),
  signEntry: id => dispatch(signEntryRequest(id)),
  unsignEntry: id => dispatch(unsignEntryRequest(id)),
  patchForSchool: (id, forSchool) =>
    dispatch(patchForSchoolRequest({ id, forSchool }))
});

interface OwnProps {}

type Props = WithStyles &
  RouteComponentProps<RouteMatch> &
  InjectedProps &
  StateProps &
  DispatchProps;

/**
 * # Component
 */
const SpecificEntry = withRouter(
  connect(mapStateToProps, mapDispatchToProps)(
    withStyles(styles)(
      withMobileDialog<Props>()(
        class extends React.Component<Props> {
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
              unsignEntry
            } = this.props;

            return (
              <Dialog open fullScreen={fullScreen} onClose={this.onClose}>
                <DialogContent>
                  {!!entry ? (
                    <Grid container direction="column">
                      {/* ID */}
                      <Grid item>
                        <DialogContentText>
                          ID: {entry.get("_id")} <br />
                        </DialogContentText>
                      </Grid>

                      <Grid item>
                        <Typography variant="title">Info</Typography>
                        <Typography variant="body1">
                          <i>Erstellt:</i>{" "}
                          {entry.get("createdAt").toLocaleString()} <br />
                          <i>Begründung:</i> {entry.get("reason") || "-"} <br />
                          <i>Schulisch:</i>{" "}
                          {role === Roles.MANAGER ? (
                            <Checkbox
                              checked={entry.get("forSchool")}
                              onChange={() =>
                                patchForSchool(
                                  entry.get("_id"),
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
                          {getUser(entry.get("student")).get("displayname")}{" "}
                          <br />
                          <i>Datum:</i>{" "}
                          {entry.get("dateEnd")
                            ? `Von ${entry.get("date").toLocaleDateString()}
                      bis ${entry.get("dateEnd")!.toLocaleDateString()}`
                            : entry.get("date").toLocaleDateString()}{" "}
                          <br />
                        </Typography>
                      </Grid>

                      {/* Slots */}
                      <Grid item>
                        <Typography variant="title">Stunden</Typography>
                        <Table>
                          <TableHead>
                            <TableRow>
                              <TableCell>Von</TableCell>
                              <TableCell>Bis</TableCell>
                              <TableCell>Lehrer</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {getSlots(entry.get("slots")).map(slot => (
                              <TableRow key={slot.get("_id")}>
                                <TableCell>{slot.get("hour_from")}</TableCell>
                                <TableCell>{slot.get("hour_to")}</TableCell>
                                <TableCell>
                                  {getUser(slot.get("teacher")).get(
                                    "displayname"
                                  )}
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </Grid>

                      {/* Signed */}
                      <Grid item>
                        <Typography variant="title">Signiert</Typography>
                        <List>
                          {/* Admin */}
                          <ListItem>
                            {entry.get("signedManager") ? (
                              <SignedAvatar />
                            ) : (
                              <UnsignedAvatar />
                            )}
                            <ListItemText primary="Stufenleiter" />
                            {role === Roles.MANAGER &&
                              (entry.get("signedManager") ? (
                                <ListItemSecondaryAction>
                                  <Button
                                    className={classes.unsignEntryButton}
                                    onClick={() =>
                                      unsignEntry(entry.get("_id"))
                                    }
                                  >
                                    <AssignmentReturnedIcon />
                                  </Button>
                                </ListItemSecondaryAction>
                              ) : (
                                <ListItemSecondaryAction>
                                  <Button
                                    className={classes.signEntryButton}
                                    onClick={() => signEntry(entry.get("_id"))}
                                    variant="raised"
                                  >
                                    <AssignmentTurnedInIcon />
                                  </Button>
                                </ListItemSecondaryAction>
                              ))}
                          </ListItem>

                          {/* Parents */}
                          <ListItem>
                            {entry.get("signedParent") ? (
                              <SignedAvatar />
                            ) : (
                              <UnsignedAvatar />
                            )}
                            <ListItemText primary="Eltern" />
                            {!entry.get("signedParent") &&
                              role === Roles.PARENT && (
                                <ListItemSecondaryAction>
                                  <Button
                                    className={classes.signEntryButton}
                                    onClick={() => signEntry(entry.get("_id"))}
                                  >
                                    {lang().ui.specificEntry.sign}
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
                    {lang().ui.common.close}
                  </Button>
                </DialogActions>
              </Dialog>
            );
          }
        }
      )
    )
  )
);

export default SpecificEntry;
