import * as React from "react";
import { getSlotsMap, getStudents, SlotN, getEntries } from "../../redux";
import { Reporting } from "../../reporting/reporting";
import { useSelector } from "react-redux";
import {
  DialogContent,
  DialogActions,
  Button,
  DialogTitle,
  Typography,
  Divider,
  Grid,
  IconButton,
  FormControl,
  RadioGroup,
  FormControlLabel,
  Radio
} from "@material-ui/core";
import { makeTranslationHook } from "../../helpers/makeTranslationHook";
import SlotsByTeacherChart from "./SlotsByTeacherChart";
import * as _ from "lodash";
import { SummaryTable } from "./SummaryTable";
import { HoursByWeekdayAndTimeChart } from "./HoursByWeekdayAndTimeChart";
import { withPrintButton, usePrintButton } from "../../hocs/withPrint";
import MailIcon from "@material-ui/icons/Mail";
import { makeStyles } from "@material-ui/styles";
import EntriesTable from "./EntriesTable";
import { MissedClassesOverTimeChart } from "./MissedClassesOverTimeChart";

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
    missedClassesOverTime: "Absent hours over time",
    summary: "Summary",
    entries: "Entries",
    modes: {
      educational: "Educational",
      not_educational: "Not educational",
      all: "All"
    }
  },
  de: {
    close: "Schließen",
    absenceReport: "Fehlstundenbericht",
    absentHoursByTime: "Fehlstunden nach Schulstunde",
    absentHoursByTeacher: "Fehlstunden nach Lehrer",
    missedClassesOverTime: "Fehlstunden über Zeit",
    summary: "Zusammenfassung",
    entries: "Einträge",
    modes: {
      educational: "Schulisch",
      not_educational: "Nicht Schulisch",
      all: "Alles"
    }
  }
});

interface StudentReportProps {
  studentIds: string[];
  onClose: () => void;
}

type Mode = "all" | "educational" | "not_educational";

function filterSlotsByMode(mode: Mode, slots: SlotN[]) {
  switch (mode) {
    case "all":
      return slots;
    case "educational":
      return slots.filter(s => !s.get("isPrefiled") && s.get("forSchool"));
    case "not_educational":
      return slots.filter(s => !s.get("isPrefiled") && !s.get("forSchool"));
  }
}

function useSlotsByStudents(studentIds: string[]) {
  const allSlots = useSelector(getSlotsMap)
    .valueSeq()
    .toArray();
  const slots = allSlots.filter(s => studentIds.includes(s.get("studentId")));
  return slots;
}

function useEntriesByStudents(studentIds: string[]) {
  const allSlots = useSelector(getEntries);
  const slots = allSlots.filter(s => studentIds.includes(s.get("studentId")));
  return slots;
}

function useStudents(studentIds: string[]) {
  const allStudents = useSelector(getStudents);
  const students = allStudents.filter(s => studentIds.includes(s.get("id")));
  return students;
}

const StudentReport = (props: StudentReportProps) => {
  const classes = useStyles(props);
  const translation = useTranslation();
  const printButton = usePrintButton();

  const { onClose, studentIds } = props;

  const students = useStudents(studentIds);
  const slots = useSlotsByStudents(studentIds);
  const entries = useEntriesByStudents(studentIds);

  const [mode, setMode] = React.useState<Mode>("all");
  const slotsToUse = filterSlotsByMode(mode, slots);

  const absentHoursByTeacher = React.useMemo(
    () => Reporting.absentHoursByTeacher(slotsToUse),
    [slotsToUse]
  );

  const hoursByWeekdayAndTime = React.useMemo(
    () => Reporting.hoursByWeekdayAndTime(slotsToUse),
    [slotsToUse]
  );

  const [firstStudent] = students;
  const displayname =
    students.length === 1
      ? firstStudent.get("displayname")
      : firstStudent.get("class");

  return (
    <>
      <DialogTitle>
        <Typography variant="overline">{translation.absenceReport}</Typography>
        <Typography variant="h5">{displayname}</Typography>
        {students.length === 1 && (
          <IconButton
            href={`mailto:${firstStudent.get("email")}`}
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
            <FormControl>
              <RadioGroup
                row
                value={mode}
                onChange={(evt, selected) => setMode(selected as Mode)}
              >
                <FormControlLabel
                  value="all"
                  control={<Radio />}
                  label={translation.modes.all}
                />
                <FormControlLabel
                  value="not_educational"
                  control={<Radio />}
                  label={translation.modes.not_educational}
                />
                <FormControlLabel
                  value="educational"
                  control={<Radio />}
                  label={translation.modes.educational}
                />
              </RadioGroup>
            </FormControl>
          </Grid>

          <Grid item>
            <Typography variant="h6" className={classes.heading}>
              {translation.summary}
            </Typography>
            <SummaryTable slots={slotsToUse} showPrefiled={mode === "all"} />
          </Grid>

          <Divider />

          <Grid item>
            <Typography variant="h6" className={classes.heading}>
              {translation.missedClassesOverTime}
            </Typography>
            <MissedClassesOverTimeChart slots={slotsToUse} />
          </Grid>

          <Divider />

          <Grid item>
            <Typography variant="h6" className={classes.heading}>
              {translation.absentHoursByTeacher}
            </Typography>
            <SlotsByTeacherChart data={absentHoursByTeacher} />
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

          <Grid item>
            <Typography variant="h6" className={classes.heading}>
              {translation.entries}
            </Typography>
            <EntriesTable entries={entries} />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button size="small" color="primary" onClick={onClose}>
          {translation.close}
        </Button>
      </DialogActions>
    </>
  );
};

export default withPrintButton(StudentReport);
