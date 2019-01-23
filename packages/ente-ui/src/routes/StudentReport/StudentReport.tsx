import * as React from "react";
import {
  UserN,
  EntryN,
  SlotN,
  AppState,
  getUser,
  getEntries,
  getSlots,
  getRole,
  getEntriesRequest,
  getUserRequest,
  isLoading
} from "../../redux";
import { Maybe } from "monet";
import { Reporting } from "../../reporting/reporting";
import {
  connect,
  MapStateToPropsParam,
  MapDispatchToPropsParam
} from "react-redux";
import {
  DialogContent,
  DialogActions,
  Button,
  DialogTitle,
  Typography,
  Divider,
  Grid,
  IconButton
} from "@material-ui/core";
import { makeTranslationHook } from "../../helpers/makeTranslationHook";
import SlotsByTeacherChart from "./SlotsByTeacherChart";
import * as _ from "lodash";
import { SummaryTable } from "./SummaryTable";
import { HoursByWeekdayAndTimeChart } from "./HoursByWeekdayAndTimeChart";
import { withPrintButton, usePrintButton } from "../../hocs/withPrint";
import MailIcon from "@material-ui/icons/Mail";
import { makeStyles } from "@material-ui/styles";
import { Roles } from "ente-types";
import { NotFound } from "../NotFound";
import LoadingIndicator from "../../elements/LoadingIndicator";

const useStyles = makeStyles({
  mailButton: {
    position: "absolute",
    top: 0,
    right: 32
  },
  printButton: {
    position: "absolute",
    top: 0,
    right: 0
  },
  heading: {
    paddingBottom: 24
  }
});

const useTranslation = makeTranslationHook({
  en: {
    close: "Close",
    absenceReport: "Absence Report",
    absentHoursByTime: "Absent hours by time",
    absentHoursByTeacher: "Absent hours by teacher",
    summary: "Summary"
  },
  de: {
    close: "Schließen",
    absenceReport: "Fehlstundenbericht",
    absentHoursByTime: "Fehlstunden nach Schulstunde",
    absentHoursByTeacher: "Fehlstunden nach Lehrer",
    summary: "Zusammenfassung"
  }
});

interface StudentReportOwnProps {
  studentId: string;
  onClose: () => void;
}

type StudentReportProps = StudentReportOwnProps;

interface StudentReportStateProps {
  student: Maybe<UserN>;
  entries: EntryN[];
  slots: SlotN[];
  role: Roles;
  isLoading: boolean;
}
const mapStateToProps: MapStateToPropsParam<
  StudentReportStateProps,
  StudentReportProps,
  AppState
> = (state, props) => {
  const { studentId } = props;

  const student = getUser(studentId)(state);
  const entries = getEntries(state).filter(
    f => f.get("studentId") === studentId
  );
  const slots = getSlots(state).filter(f => f.get("studentId") === studentId);

  const role = getRole(state).some();

  const loading = isLoading(state);

  return {
    role,
    student,
    entries,
    slots,
    isLoading: loading
  };
};

interface StudentReportDispatchProps {
  fetchEntries: () => void;
  fetchStudent: (id: string) => void;
}
const mapDispatchToProps: MapDispatchToPropsParam<
  StudentReportDispatchProps,
  StudentReportOwnProps
> = dispatch => ({
  fetchEntries: () => dispatch(getEntriesRequest()),
  fetchStudent: id => dispatch(getUserRequest(id))
});

type StudentReportPropsConnected = StudentReportProps &
  StudentReportStateProps &
  StudentReportDispatchProps;

const StudentReport: React.FC<StudentReportPropsConnected> = props => {
  const {
    entries,
    student,
    slots,
    onClose,
    role,
    fetchEntries,
    studentId,
    fetchStudent,
    isLoading
  } = props;

  const classes = useStyles(props);
  const translation = useTranslation();
  const printButton = usePrintButton();

  React.useEffect(() => {
    if (entries.length === 0) {
      fetchEntries();
    }
  }, []);

  React.useEffect(() => {
    if (student.isNone()) {
      fetchStudent(studentId);
    }
  }, []);

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

  return student.cata(
    () => (isLoading ? <LoadingIndicator /> : <NotFound />),
    student => (
      <div>
        <DialogTitle>
          <Typography variant="overline">
            {translation.absenceReport}
          </Typography>
          <Typography variant="h5">{student.get("displayname")}</Typography>
          {role === Roles.MANAGER && (
            <IconButton
              href={`mailto:${student.get("email")}`}
              className={classes.mailButton}
            >
              <MailIcon fontSize="default" color="action" />
            </IconButton>
          )}
          <div className={classes.printButton}>{printButton}</div>
        </DialogTitle>
        <DialogContent>
          <Grid container direction="column" spacing={24}>
            <Grid item>
              <Typography variant="h6" className={classes.heading}>
                {translation.summary}
              </Typography>
              <SummaryTable data={summary} />
            </Grid>

            <Divider />

            <Grid item>
              <Typography variant="h6" className={classes.heading}>
                {translation.absentHoursByTeacher}
              </Typography>
              <SlotsByTeacherChart data={slotsByTeacherWithAmount} />
            </Grid>

            <Divider />

            <Grid item>
              <Typography variant="h6" className={classes.heading}>
                {translation.absentHoursByTime}
              </Typography>
              <HoursByWeekdayAndTimeChart
                variant="scatterplot"
                data={hoursByWeekdayAndTime}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button size="small" color="primary" onClick={onClose}>
            {translation.close}
          </Button>
        </DialogActions>
      </div>
    )
  );
};

export default withPrintButton(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(StudentReport)
);
