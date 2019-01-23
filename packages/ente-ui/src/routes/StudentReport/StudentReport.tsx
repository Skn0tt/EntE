import * as React from "react";
import {
  UserN,
  EntryN,
  SlotN,
  AppState,
  getUser,
  getEntries,
  getSlots
} from "../../redux";
import { Maybe } from "monet";
import { Reporting } from "../../reporting/reporting";
import { connect, MapStateToPropsParam } from "react-redux";
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
import { withPrintButton, usePrintButton } from "ente-ui/src/hocs/withPrint";
import MailIcon from "@material-ui/icons/Mail";
import { makeStyles } from "@material-ui/styles";

const useStyles = makeStyles({
  mailButton: {
    position: "absolute",
    top: 0,
    right: 0
  },
  printButton: {
    position: "absolute",
    top: 0,
    right: 32
  }
});

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

interface StudentReportOwnProps {
  studentId: string;
  onClose: () => void;
}

type StudentReportProps = StudentReportOwnProps;

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
  const { studentId } = props;

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
  const { entries, student, slots, onClose } = props;

  const classes = useStyles(props);
  const translation = useTranslation();
  const printButton = usePrintButton();

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

  return (
    <div>
      <DialogTitle>
        <Typography variant="overline">{translation.absenceReport}</Typography>
        <Typography variant="h4">
          {student.some().get("displayname")}
        </Typography>
        <div className={classes.printButton}>{printButton}</div>
        <IconButton
          href={`mailto:${student.map(s => s.get("email")).orSome("")}`}
          className={classes.mailButton}
        >
          <MailIcon fontSize="default" color="action" />
        </IconButton>
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
        <Button size="small" color="primary" onClick={onClose}>
          {translation.close}
        </Button>
      </DialogActions>
    </div>
  );
};

export default withPrintButton(connect(mapStateToProps)(StudentReport));
