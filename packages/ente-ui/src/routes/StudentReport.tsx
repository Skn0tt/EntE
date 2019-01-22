import * as React from "react";
import {
  UserN,
  EntryN,
  SlotN,
  AppState,
  getUser,
  getEntries,
  getSlots
} from "../redux";
import { Maybe } from "monet";
import { RouteComponentProps, withRouter } from "react-router";
import { Reporting } from "../reporting/reporting";
import { connect, MapStateToPropsParam } from "react-redux";
import {
  Dialog,
  withMobileDialog,
  DialogContent,
  DialogActions,
  Button,
  DialogTitle,
  Typography,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Divider,
  Tooltip,
  Grid
} from "@material-ui/core";
import { InjectedProps } from "@material-ui/core/withMobileDialog";
import { makeTranslationHook } from "../helpers/makeTranslationHook";

const useTranslation = makeTranslationHook({
  en: {
    close: "Close",
    absenceReport: "Absence Report",
    total: "total",
    unexcused: "unexcused",
    entries: "Entries",
    absentDays: "Absent Days",
    absentHours: "Absent Hours",
    hourRate: "Hourrate",
    hourRateTooltip: "Absent Hours per Absent Day"
  },
  de: {
    close: "Schließen",
    absenceReport: "Fehlstundenbericht",
    total: "gesamt",
    unexcused: "unentschuldigt",
    entries: "Einträge",
    absentDays: "Abwesenheitstage",
    absentHours: "Fehlstunden",
    hourRate: "Stundenrate",
    hourRateTooltip: "Fehlstunden pro Abwesenheitstag"
  }
});

interface StudentReportOwnProps {}

interface StudentReportRouteParams {
  studentId: string;
}

type StudentReportProps = StudentReportOwnProps &
  RouteComponentProps<StudentReportRouteParams> &
  InjectedProps;

interface StudentReportStateProps {
  student: Maybe<UserN>;
  entries: EntryN[];
  slots: SlotN[];
}
const mapStateToProps: MapStateToPropsParam<
  StudentReportStateProps,
  StudentReportProps,
  AppState
> = (state, props) => {
  const { studentId } = props.match.params;

  const student = getUser(studentId)(state);
  const entries = getEntries(state).filter(
    f => f.get("studentId") === studentId
  );
  const slots = getSlots(state).filter(f => f.get("studentId") === studentId);

  return {
    student,
    entries,
    slots
  };
};

type StudentReportPropsConnected = StudentReportProps & StudentReportStateProps;

const StudentReport: React.FC<StudentReportPropsConnected> = props => {
  const { entries, student, slots, fullScreen, history } = props;

  const translation = useTranslation();

  const entriesNotForSchool = React.useMemo(
    () => entries.filter(e => !e.get("forSchool")),
    [entries]
  );

  const slotsNotForSchool = React.useMemo(
    () => slots.filter(e => !e.get("forSchool")),
    [slots]
  );

  const summary = React.useMemo(
    () => Reporting.summarize(entriesNotForSchool),
    [entriesNotForSchool]
  );

  const slotsByTeacher = React.useMemo(
    () => Reporting.slotsByTeacher(slotsNotForSchool),
    [slotsNotForSchool]
  );

  const hoursByWeekdayAndTime = React.useMemo(
    () => Reporting.hoursByWeekdayAndTime(slotsNotForSchool),
    [slotsNotForSchool]
  );

  const handleOnClose = React.useCallback(
    () => {
      history.push("/users");
    },
    [history]
  );

  return (
    <Dialog open fullScreen={fullScreen} onClose={handleOnClose} scroll="paper">
      <DialogTitle>
        <Typography variant="overline">{translation.absenceReport}</Typography>
        <Typography variant="h4">
          {student.some().get("displayname")}
        </Typography>
      </DialogTitle>
      <DialogContent>
        <Grid container direction="column" spacing={24}>
          <Grid item>
            <Paper elevation={2}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell />
                    <TableCell align="right">{translation.total}</TableCell>
                    <TableCell align="right">{translation.unexcused}</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell align="left">{translation.entries}</TableCell>
                    <TableCell align="right">{summary.entries.total}</TableCell>
                    <TableCell align="right">
                      {summary.entries.unexcused}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell align="left">{translation.absentDays}</TableCell>
                    <TableCell align="right">
                      {summary.absentDays.unexcused}
                    </TableCell>
                    <TableCell align="right">
                      {summary.absentDays.unexcused}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell align="left">
                      {translation.absentHours}
                    </TableCell>
                    <TableCell align="right">
                      {summary.absentSlots.unexcused}
                    </TableCell>
                    <TableCell align="right">
                      {summary.absentSlots.unexcused}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <Tooltip
                      title={translation.hourRateTooltip}
                      placement="right"
                    >
                      <TableCell align="left">{translation.hourRate}</TableCell>
                    </Tooltip>
                    <TableCell align="right">
                      {summary.slotsPerDay.toFixed(2)}
                    </TableCell>
                    <TableCell align="right" />
                  </TableRow>
                </TableBody>
              </Table>
            </Paper>
          </Grid>

          <Divider />

          <Grid item />
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button size="small" color="primary" onClick={handleOnClose}>
          {translation.close}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default withMobileDialog()(
  withRouter(connect(mapStateToProps)(StudentReport))
);
