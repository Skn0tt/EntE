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
import {
  Button,
  Table,
  List,
  Grid,
  IconButton,
  Typography,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  ListItemText,
  ListItemSecondaryAction,
  DialogActions,
  DialogContent,
  ListItem
} from "@material-ui/core";
import SignedAvatar from "../../elements/SignedAvatar";
import LoadingIndicator from "../../elements/LoadingIndicator";
import {
  Roles,
  ExamenPayload,
  OtherPayload,
  FieldTripPayload,
  CompetitionPayload,
  EntryReasonCategory
} from "ente-types";
import {
  AppState,
  getEntry,
  getUser,
  getSlotsById,
  isLoading,
  getRole,
  getEntryRequest,
  unsignEntryRequest,
  signEntryRequest,
  UserN,
  EntryN,
  SlotN,
  deleteEntryRequest
} from "../../redux";
import withErrorBoundary from "../../hocs/withErrorBoundary";
import { DeleteModal } from "../../components/DeleteModal";
import { green, red, common } from "@material-ui/core/colors";
import { Maybe } from "monet";
import { makeTranslationHook } from "../../helpers/makeTranslationHook";
import { makeStyles } from "@material-ui/styles";
import AssignmentTurnedInIcon from "@material-ui/icons/AssignmentTurnedIn";
import AssignmentReturnedIcon from "@material-ui/icons/AssignmentReturned";
import DeleteIcon from "@material-ui/icons/Delete";
import MailIcon from "@material-ui/icons/MailRounded";
import { format } from "date-fns";
import * as enLocale from "date-fns/locale/en-GB";
import * as deLocale from "date-fns/locale/de";
import { withPrintButton, usePrintButton } from "ente-ui/src/hocs/withPrint";

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
    forSchool: "Educational:",
    reason: "Reason:",
    date: "Date:",
    reasonPayloads: {
      [EntryReasonCategory.EXAMEN]: (v: ExamenPayload) =>
        `Examen: ${v.from}-${v.to}, ${v.class}`,
      [EntryReasonCategory.OTHER]: (v: OtherPayload) =>
        `Other: ${v.description}`,
      [EntryReasonCategory.FIELD_TRIP]: (
        v: FieldTripPayload,
        teacher: UserN | null
      ) =>
        `Field Trip: ${v.from}-${v.to}, ${
          !!teacher ? teacher.get("displayname") : "Deleted"
        }`,
      [EntryReasonCategory.COMPETITION]: (v: CompetitionPayload) =>
        `Competition: ${v.from}-${v.to}, ${!!v.name}`
    },
    dateRange: (start: string, end: string) =>
      `From ${format(start, "PP", { locale: enLocale })} to ${format(
        end,
        "PP",
        { locale: enLocale }
      )}`,
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
    },
    locale: enLocale,
    titles: {
      info: "Information",
      signed: "Signed"
    }
  },
  de: {
    sign: "Unterschreiben",
    close: "Schließen",
    delete: "Löschen",
    mail: "Mail",
    areYouSureToDelete:
      "Sind Sie sicher, dass Sie diesen Eintrag löschen möchten?",
    yes: "Ja",
    no: "Nein",
    student: "Schüler:",
    id: "ID:",
    createdAt: "Erstellt:",
    forSchool: "Schulisch:",
    reason: "Grund:",
    reasonPayloads: {
      [EntryReasonCategory.EXAMEN]: (v: ExamenPayload) =>
        `Klausur: ${v.from}-${v.to}, ${v.class}`,
      [EntryReasonCategory.OTHER]: (v: OtherPayload) =>
        `Sonstiges: ${v.description}`,
      [EntryReasonCategory.FIELD_TRIP]: (
        v: FieldTripPayload,
        teacher: UserN | null
      ) =>
        `Exkursion: ${v.from}-${v.to}, ${
          !!teacher ? teacher.get("displayname") : "Gelöscht"
        }`,
      [EntryReasonCategory.COMPETITION]: (v: CompetitionPayload) =>
        `Wettbewerb: ${v.from}-${v.to}, ${!!v.name}`
    },
    date: "Datum:",
    dateRange: (start: string, end: string) =>
      `Von ${format(start, "PP", { locale: deLocale })} bis ${format(
        end,
        "PP",
        { locale: deLocale }
      )}`,
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
    },
    locale: deLocale,
    titles: {
      info: "Info",
      signed: "Signiert"
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
    right: 92
  },
  mailButton: {
    position: "absolute",
    top: 0,
    right: 46
  },
  printButton: {
    position: "absolute",
    top: 0,
    right: 0
  }
});

interface StateProps {
  getEntry(id: string): Maybe<EntryN>;
  getUser(id: string): Maybe<UserN>;
  getSlots(ids: string[]): SlotN[];
  loading: boolean;
  role: Maybe<Roles>;
}
const mapStateToProps: MapStateToPropsParam<
  StateProps,
  SpecificEntryOwnProps,
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
  deleteEntry: (id: string) => void;
}

const mapDispatchToProps: MapDispatchToPropsParam<
  DispatchProps,
  SpecificEntryOwnProps
> = dispatch => ({
  requestEntry: id => dispatch(getEntryRequest(id)),
  signEntry: id => dispatch(signEntryRequest(id)),
  unsignEntry: id => dispatch(unsignEntryRequest(id)),
  deleteEntry: id => dispatch(deleteEntryRequest(id))
});

interface SpecificEntryOwnProps {
  entryId: string;
  onClose: () => void;
}

type SpecificEntryProps = StateProps & DispatchProps & SpecificEntryOwnProps;

const SpecificEntry: React.FunctionComponent<SpecificEntryProps> = props => {
  const lang = useTranslation();
  const classes = useStyles(props);

  const {
    role,
    getUser,
    getSlots,
    requestEntry,
    signEntry,
    unsignEntry,
    deleteEntry,
    entryId,
    loading,
    onClose,
    getEntry
  } = props;

  const entry = getEntry(entryId);

  const printButton = usePrintButton();

  const [showDelete, setShowDelete] = React.useState(false);

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
                    <DeleteIcon fontSize="default" />
                  </IconButton>

                  <IconButton
                    aria-label={lang.mail}
                    href={`mailto:${getUser(entry.get("studentId"))
                      .some()
                      .get("email")}`}
                    className={classes.mailButton}
                  >
                    <MailIcon fontSize="default" />
                  </IconButton>
                </>
              )}
              <div className={classes.printButton}>{printButton}</div>

              <Grid item>
                <Typography variant="h6">{lang.titles.info}</Typography>
                <Typography variant="body1">
                  <i>{lang.id}</i> {entry.get("id")} <br />
                  <i>{lang.createdAt}</i>{" "}
                  {entry.get("createdAt").toLocaleString()} <br />
                  <i>{lang.forSchool}</i>{" "}
                  {entry.get("forSchool") ? lang.yes : lang.no} <br />
                  {entry.get("forSchool") && (
                    <>
                      <i>{lang.reason}</i>{" "}
                      {(() => {
                        const { payload, category } = entry.get("reason")!;
                        switch (category) {
                          case EntryReasonCategory.COMPETITION:
                            return lang.reasonPayloads[
                              EntryReasonCategory.COMPETITION
                            ](payload as CompetitionPayload);
                          case EntryReasonCategory.EXAMEN:
                            return lang.reasonPayloads[
                              EntryReasonCategory.EXAMEN
                            ](payload as ExamenPayload);
                          case EntryReasonCategory.OTHER:
                            return lang.reasonPayloads[
                              EntryReasonCategory.OTHER
                            ](payload as OtherPayload);
                          case EntryReasonCategory.FIELD_TRIP:
                            return lang.reasonPayloads[
                              EntryReasonCategory.FIELD_TRIP
                            ](
                              payload as FieldTripPayload,
                              getUser(
                                (payload as FieldTripPayload).teacherId || ""
                              ).orSome(null as any)
                            );
                        }
                      })()}
                      <br />
                    </>
                  )}
                  <i>{lang.student}</i>{" "}
                  {getUser(entry.get("studentId"))
                    .some()
                    .get("displayname")}{" "}
                  <br />
                  <i>{lang.date}</i>{" "}
                  {!!entry.get("dateEnd")
                    ? lang.dateRange(entry.get("date"), entry.get("dateEnd")!)
                    : format(entry.get("date"), "PP", {
                        locale: lang.locale
                      })}
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
                          {format(slot.get("date"), "PP", {
                            locale: lang.locale
                          })}
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
                <Typography variant="h6">{lang.titles.signed}</Typography>
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
      </>
    )
  );
};

export default withPrintButton(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(withErrorBoundary()(SpecificEntry))
);
