/**
 * EntE
 * (c) 2017-present, Simon Knott <info@simonknott.de>
 *
 * This source code is licensed under the GNU Affero General Public License
 * found in the LICENSE file in the root directory of this source tree.
 */

import * as React from "react";
import { connect, MapStateToPropsParam } from "react-redux";
import { Dispatch } from "redux";
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
  OtherEducationalPayload,
  OtherNonEducationalPayload,
  FieldTripPayload,
  CompetitionPayload,
  EntryReasonCategory,
  getEntryExpirationTime,
  isParentSignatureExpiryEnabled,
  canEntryStillBeSigned
} from "ente-types";
import {
  AppState,
  getEntry,
  getUser,
  getSlotsById,
  getRole,
  getEntryRequest,
  unsignEntryRequest,
  signEntryRequest,
  UserN,
  EntryN,
  SlotN,
  deleteEntryRequest,
  getParentSignatureExpiryTime
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
import CloseIcon from "@material-ui/icons/Close";
import DoneIcon from "@material-ui/icons/Done";
import { format, parseISO } from "date-fns";
import * as enLocale from "date-fns/locale/en-GB";
import * as deLocale from "date-fns/locale/de";
import { withPrintButton, usePrintButton } from "../../hocs/withPrint";
import ManagerNotesEditor from "./ManagerNotesEditor";
import { slotTimeComparator } from "../../helpers/slot-time-comparator";

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
    createdAt: "Created:",
    forSchool: "Educational:",
    reason: "Reason:",
    date: "Date:",
    reasonPayloads: {
      [EntryReasonCategory.EXAMEN]: (v: ExamenPayload, teacher: Maybe<UserN>) =>
        `Examen: ${v.from}-${v.to}, ${teacher
          .map(t => t.get("displayname"))
          .orSome("Teacher Deleted")}`,
      [EntryReasonCategory.OTHER_EDUCATIONAL]: (v: OtherEducationalPayload) =>
        `Other (educational): ${v.description}`,
      [EntryReasonCategory.OTHER_NON_EDUCATIONAL]: (
        v: OtherNonEducationalPayload
      ) => `Other (non-educational): ${v.description}`,
      [EntryReasonCategory.ILLNESS]: "Illness",
      [EntryReasonCategory.FIELD_TRIP]: (
        v: FieldTripPayload,
        teacher: Maybe<UserN>
      ) =>
        `Field Trip: ${v.from}-${v.to}, ${teacher
          .map(t => t.get("displayname"))
          .orSome("Teacher Deleted")}`,
      [EntryReasonCategory.COMPETITION]: (v: CompetitionPayload) =>
        `Competition: ${v.from}-${v.to}, ${v.name}`
    },
    dateRange: (start: string, end: string) =>
      `From ${format(parseISO(start), "PP", { locale: enLocale })} to ${format(
        parseISO(end),
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
    },
    possibleUntil: "possible until",
    signatureExpired: "This entry can not be signed anymore."
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
    createdAt: "Erstellt:",
    forSchool: "Schulisch:",
    reason: "Grund:",
    reasonPayloads: {
      [EntryReasonCategory.EXAMEN]: (v: ExamenPayload, teacher: Maybe<UserN>) =>
        `Klausur: ${v.from}-${v.to}, ${teacher
          .map(t => t.get("displayname"))
          .orSome("Lehrer gelöscht")}`,
      [EntryReasonCategory.OTHER_EDUCATIONAL]: (v: OtherEducationalPayload) =>
        `Sonstiges (schulisch): ${v.description}`,
      [EntryReasonCategory.OTHER_NON_EDUCATIONAL]: (
        v: OtherNonEducationalPayload
      ) => `Sonstiges (außerschulisch): ${v.description}`,
      [EntryReasonCategory.ILLNESS]: "Krankheit",
      [EntryReasonCategory.FIELD_TRIP]: (
        v: FieldTripPayload,
        teacher: Maybe<UserN>
      ) =>
        `Exkursion: ${v.from}-${v.to}, ${teacher
          .map(t => t.get("displayname"))
          .orSome("Lehrer gelöscht")}`,
      [EntryReasonCategory.COMPETITION]: (v: CompetitionPayload) =>
        `Wettbewerb: ${v.from}-${v.to}, ${v.name}`
    },
    date: "Datum:",
    dateRange: (start: string, end: string) =>
      `Von ${format(parseISO(start), "PP", { locale: deLocale })} bis ${format(
        parseISO(end),
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
    },
    possibleUntil: "möglich bis",
    signatureExpired: "Dieser Eintrag kann nicht mehr unterschrieben werden."
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
  mailButton: {
    position: "absolute",
    top: 0,
    right: 46
  },
  deleteButton: {
    position: "absolute",
    top: 0,
    right: 92
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
  role: Roles;
  entryExpirationTime: number;
}
const mapStateToProps: MapStateToPropsParam<
  StateProps,
  SpecificEntryOwnProps,
  AppState
> = (state, props) => {
  const { entryId } = props;
  return {
    getEntry: id => getEntry(id)(state),
    getUser: id => getUser(id)(state),
    getSlots: ids => getSlotsById(ids)(state),
    role: getRole(state).some(),
    entryExpirationTime: getParentSignatureExpiryTime(state).some()
  };
};

const mapDispatchToProps = (
  dispatch: Dispatch,
  ownProps: SpecificEntryOwnProps
) => {
  const { entryId } = ownProps;
  return {
    requestEntry: () => dispatch(getEntryRequest(entryId)),
    signEntry: () => dispatch(signEntryRequest(entryId)),
    unsignEntry: () => dispatch(unsignEntryRequest(entryId)),
    deleteEntry: () => dispatch(deleteEntryRequest(entryId))
  };
};

type DispatchProps = ReturnType<typeof mapDispatchToProps>;

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
    onClose,
    getEntry,
    entryExpirationTime
  } = props;

  const entry = getEntry(entryId);

  const printButton = usePrintButton();

  const [showDelete, setShowDelete] = React.useState(false);

  React.useEffect(() => {
    if (!entry) {
      requestEntry();
    }
  }, []);

  return entry.cata(
    () => <LoadingIndicator />,
    entry => {
      const isReviewed = entry.get("isInReviewedRecords");

      return (
        <>
          <DeleteModal
            onClose={() => setShowDelete(false)}
            onDelete={() => {
              deleteEntry();
              onClose();
            }}
            show={showDelete}
            text={lang.areYouSureToDelete}
          />
          <DialogContent>
            <Grid container direction="column" spacing={24}>
              {role === Roles.MANAGER && (
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
                  <i>{lang.createdAt}</i>{" "}
                  {entry.get("createdAt").toLocaleString()} <br />
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
                          ](
                            payload as ExamenPayload,
                            Maybe.fromNull(
                              (payload as ExamenPayload).teacherId
                            ).flatMap(getUser)
                          );
                        case EntryReasonCategory.OTHER_EDUCATIONAL:
                          return lang.reasonPayloads[
                            EntryReasonCategory.OTHER_EDUCATIONAL
                          ](payload as OtherEducationalPayload);
                        case EntryReasonCategory.OTHER_NON_EDUCATIONAL:
                          return lang.reasonPayloads[
                            EntryReasonCategory.OTHER_NON_EDUCATIONAL
                          ](payload as OtherNonEducationalPayload);
                        case EntryReasonCategory.ILLNESS:
                          return lang.reasonPayloads[
                            EntryReasonCategory.ILLNESS
                          ];
                        case EntryReasonCategory.FIELD_TRIP:
                          return lang.reasonPayloads[
                            EntryReasonCategory.FIELD_TRIP
                          ](
                            payload as FieldTripPayload,
                            Maybe.fromNull(
                              (payload as FieldTripPayload).teacherId
                            ).flatMap(getUser)
                          );
                      }
                    })()}
                    <br />
                  </>
                  <i>{lang.student}</i>{" "}
                  {getUser(entry.get("studentId"))
                    .some()
                    .get("displayname")}{" "}
                  <br />
                  <i>{lang.date}</i>{" "}
                  {!!entry.get("dateEnd")
                    ? lang.dateRange(entry.get("date"), entry.get("dateEnd")!)
                    : format(parseISO(entry.get("date")), "PP", {
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
                    {getSlots(entry.get("slotIds"))
                      .sort(slotTimeComparator)
                      .map(slot => (
                        <TableRow key={slot.get("id")}>
                          <TableCell>
                            {format(parseISO(slot.get("date")), "PP", {
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
                    {role === Roles.MANAGER &&
                      (entry.get("signedManager") ? (
                        <ListItemSecondaryAction>
                          <Button
                            className={classes.unsignEntryButton}
                            onClick={unsignEntry}
                          >
                            <AssignmentReturnedIcon />
                          </Button>
                        </ListItemSecondaryAction>
                      ) : (
                        <ListItemSecondaryAction>
                          <Button
                            className={classes.signEntryButton}
                            onClick={signEntry}
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
                      role === Roles.PARENT &&
                      (() => {
                        const entryExpirationIsEnabled = isParentSignatureExpiryEnabled(
                          entryExpirationTime
                        );

                        const createdAt = +parseISO(entry.get("createdAt"));

                        return canEntryStillBeSigned(
                          createdAt,
                          entryExpirationTime
                        ) ? (
                          <ListItemSecondaryAction>
                            <Button
                              className={classes.signEntryButton}
                              onClick={signEntry}
                            >
                              {lang.sign}
                              {entryExpirationIsEnabled && (
                                <>
                                  <br />({lang.possibleUntil + " "}
                                  {(() => {
                                    const expirationDate = getEntryExpirationTime(
                                      createdAt,
                                      entryExpirationTime
                                    );
                                    return new Date(
                                      expirationDate
                                    ).toLocaleString();
                                  })()}
                                  )
                                </>
                              )}
                              <AssignmentTurnedInIcon />
                            </Button>
                          </ListItemSecondaryAction>
                        ) : (
                          <ListItemSecondaryAction>
                            <Typography color="secondary">
                              {lang.signatureExpired}
                            </Typography>
                          </ListItemSecondaryAction>
                        );
                      })()}
                  </ListItem>
                </List>
              </Grid>
            </Grid>

            {role === Roles.MANAGER && (
              <Grid item>
                <ManagerNotesEditor
                  student={getUser(entry.get("studentId")).some()}
                />
              </Grid>
            )}
          </DialogContent>

          <DialogActions>
            <Button size="small" color="primary" onClick={onClose}>
              {lang.close}
            </Button>
          </DialogActions>
        </>
      );
    }
  );
};

export default withPrintButton(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(withErrorBoundary()(SpecificEntry))
) as React.FC<SpecificEntryOwnProps>;
