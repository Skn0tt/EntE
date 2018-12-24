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
import { Action } from "redux";
import { withRouter, RouteComponentProps } from "react-router";
import {
  Button,
  Table,
  List,
  Grid,
  Checkbox,
  IconButton,
  Dialog,
  Typography,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  ListItemText,
  ListItemSecondaryAction,
  DialogActions,
  withMobileDialog,
  DialogContent,
  ListItem
} from "@material-ui/core";
import SignedAvatar from "../elements/SignedAvatar";
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
import { green, red, common } from "@material-ui/core/colors";
import { Maybe } from "monet";
import { makeTranslationHook } from "../helpers/makeTranslationHook";
import { makeStyles } from "@material-ui/styles";
import AssignmentTurnedInIcon from "@material-ui/icons/AssignmentTurnedIn";
import AssignmentReturnedIcon from "@material-ui/icons/AssignmentReturned";
import DeleteIcon from "@material-ui/icons/Delete";
import MailIcon from "@material-ui/icons/MailRounded";

const useTranslation = makeTranslationHook({
  en: {
    sign: "Sign",
    close: "Close",
    delete: "Delete",
    mail: "Mail",
    areYouSureToDelete: "Are you sure that you want to delete this entry?",
    yes: "Yes",
    no: "No",
    student: "Student:",
    id: "ID:",
    createdAt: "Created:",
    forSchool: "For School:",
    date: "Date:",
    dateRange: (start: Date, end: Date) =>
      `From ${start.toLocaleDateString()} to ${end.toLocaleDateString()}`,
    slotsTable: {
      title: "Slots",
      date: "Date",
      from: "From",
      to: "To",
      teacher: "Teacher",
      deleted: "Deleted"
    },
    signed: {
      manager: "Manager",
      parents: "Parents"
    }
  },
  de: {
    sign: "Unterschreiben",
    close: "Schließen",
    delete: "Löschen",
    mail: "Mail",
    areYouSureToDelete:
      "Sind sie sicher, dass sie diesen Eintrag löschen möchten?",
    yes: "Ja",
    no: "Nein",
    student: "Schüler:",
    id: "ID:",
    createdAt: "Erstellt:",
    forSchool: "Schulisch:",
    date: "Datum:",
    dateRange: (start: Date, end: Date) =>
      `Von ${start.toLocaleDateString()} bis ${end.toLocaleDateString()}`,
    slotsTable: {
      title: "Stunden",
      date: "Datum",
      from: "Von",
      to: "Bis",
      teacher: "Lehrer",
      deleted: "Gelöscht"
    },
    signed: {
      manager: "Stufenleiter",
      parents: "Eltern"
    }
  }
});

const useStyles = makeStyles({
  list: {
    width: "100%"
  },
  listItem: {
    width: "100%"
  },
  signEntryButton: {
    backgroundColor: green[500],
    color: common.white
  },
  unsignEntryButton: {
    color: red[500]
  },
  deleteButton: {
    position: "absolute",
    top: 0,
    right: 0
  },
  mailButton: {
    position: "absolute",
    top: 0,
    right: 56
  }
});

/**
 * # Component Types
 */
interface SpecificEntryRouteMatch {
  entryId: string;
}

interface InjectedProps {
  fullScreen: boolean;
}

interface StateProps {
  getEntry(id: string): Maybe<EntryN>;
  getUser(id: string): Maybe<UserN>;
  getSlots(ids: string[]): SlotN[];
  loading: boolean;
  role: Maybe<Roles>;
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

type SpecificEntryProps = RouteComponentProps<SpecificEntryRouteMatch> &
  InjectedProps &
  StateProps &
  DispatchProps;

const SpecificEntry: React.FunctionComponent<SpecificEntryProps> = props => {
  const lang = useTranslation();
  const classes = useStyles(props);

  const {
    role,
    patchForSchool,
    fullScreen,
    getUser,
    getSlots,
    requestEntry,
    signEntry,
    unsignEntry,
    deleteEntry,
    loading,
    match,
    getEntry,
    history
  } = props;

  const { entryId } = match.params;
  const entry = getEntry(entryId);

  const [showDelete, setShowDelete] = React.useState(false);

  const onClose = React.useCallback(
    () => {
      history.push("/entries");
    },
    [history]
  );

  React.useEffect(
    () => {
      if (!entry) {
        requestEntry(entryId);
      }
    },
    [entryId]
  );

  return entry.cata(
    () => <LoadingIndicator />,
    entry => (
      <>
        <DeleteModal
          onClose={() => setShowDelete(false)}
          onDelete={() => {
            deleteEntry(entryId);
            onClose();
          }}
          show={showDelete}
          text={lang.areYouSureToDelete}
        />
        <Dialog open fullScreen={fullScreen} onClose={onClose} fullWidth>
          <DialogContent>
            {!!entry ? (
              <Grid container direction="column" spacing={24}>
                {role.some() === Roles.MANAGER && (
                  <>
                    <IconButton
                      aria-label={lang.delete}
                      onClick={() => setShowDelete(true)}
                      className={classes.deleteButton}
                    >
                      <DeleteIcon fontSize="large" />
                    </IconButton>
                    <IconButton
                      aria-label={lang.mail}
                      href={`mailto:${getUser(entry.get("studentId"))
                        .some()
                        .get("email")}`}
                      className={classes.mailButton}
                    >
                      <MailIcon fontSize="large" color="action" />
                    </IconButton>
                  </>
                )}

                <Grid item>
                  <Typography variant="h6">Info</Typography>
                  <Typography variant="body1">
                    <i>{lang.id}</i> {entry.get("id")} <br />
                    <i>{lang.createdAt}</i>{" "}
                    {entry.get("createdAt").toLocaleString()} <br />
                    <i>{lang.forSchool}</i>{" "}
                    {role.some() === Roles.MANAGER ? (
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
                      lang.yes
                    ) : (
                      lang.no
                    )}{" "}
                    <br />
                    <i>{lang.student}</i>{" "}
                    {getUser(entry.get("studentId"))
                      .some()
                      .get("displayname")}{" "}
                    <br />
                    <i>{lang.date}</i>{" "}
                    {!!entry.get("dateEnd")
                      ? lang.dateRange(entry.get("date"), entry.get("dateEnd")!)
                      : entry.get("date").toLocaleDateString()}{" "}
                    <br />
                  </Typography>
                </Grid>

                {/* Slots */}
                <Grid item>
                  <Typography variant="h6">{lang.slotsTable.title}</Typography>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>{lang.slotsTable.date}</TableCell>
                        <TableCell>{lang.slotsTable.from}</TableCell>
                        <TableCell>{lang.slotsTable.to}</TableCell>
                        <TableCell>{lang.slotsTable.teacher}</TableCell>
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
                            {Maybe.fromFalsy(slot.get("teacherId")).cata(
                              () => lang.slotsTable.deleted,
                              id =>
                                getUser(id)
                                  .some()
                                  .get("displayname")
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
                      <ListItemText primary={lang.signed.manager} />
                      {role.some() === Roles.MANAGER &&
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
                      <ListItemText primary={lang.signed.parents} />
                      {!entry.get("signedParent") &&
                        role.some() === Roles.PARENT && (
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
            <Button size="small" color="primary" onClick={onClose}>
              {lang.close}
            </Button>
          </DialogActions>
        </Dialog>
      </>
    )
  );
};

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(withMobileDialog<SpecificEntryProps>()(withErrorBoundary()(SpecificEntry)))
);
