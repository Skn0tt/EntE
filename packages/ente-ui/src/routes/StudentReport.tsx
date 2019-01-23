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
  Divider,
  Grid
} from "@material-ui/core";
import { InjectedProps } from "@material-ui/core/withMobileDialog";
import { makeTranslationHook } from "../helpers/makeTranslationHook";
import SlotsByTeacherChart from "./SlotsByTeacherChart";
import * as _ from "lodash";
import { SummaryTable } from "./SummaryTable";
import { HoursByWeekdayAndTimeChart } from "./HoursByWeekdayAndTimeChart";

const useTranslation = makeTranslationHook({
  en: {
    close: "Close",
    absenceReport: "Absence Report"
  },
  de: {
    close: "Schließen",
    absenceReport: "Fehlstundenbericht"
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

  const slotsByTeacherWithAmount = React.useMemo(
    () => _.mapValues(slotsByTeacher, v => v.length),
    [slotsByTeacher]
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
            <SummaryTable data={summary} />
          </Grid>

          <Divider />

          <Grid item>
            <SlotsByTeacherChart data={slotsByTeacherWithAmount} />
          </Grid>

          <Grid item>
            <HoursByWeekdayAndTimeChart
              variant="scatterplot"
              data={hoursByWeekdayAndTime}
            />
          </Grid>
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
