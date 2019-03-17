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
  isLoading,
  getSlotsMap
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
  IconButton,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  FormGroup
} from "@material-ui/core";
import { makeTranslationHook } from "../../helpers/makeTranslationHook";
import SlotsByTeacherChart from "./SlotsByTeacherChart";
import * as _ from "lodash";
import { SummaryTable } from "./SummaryTable";
import { HoursByWeekdayAndTimeChart } from "./HoursByWeekdayAndTimeChart";
import { withPrintButton, usePrintButton } from "../../hocs/withPrint";
import MailIcon from "@material-ui/icons/Mail";
import { makeStyles } from "@material-ui/styles";
import { Roles, entryReasonCategoryIsEducational } from "ente-types";
import { NotFound } from "../NotFound";
import LoadingIndicator from "../../elements/LoadingIndicator";
import EntriesTable from "./EntriesTable";
import { Map } from "immutable";

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
    summary: "Zusammenfassung",
    entries: "Einträge",
    modes: {
      educational: "Schulisch",
      not_educational: "Nicht Schulisch",
      all: "Alles"
    }
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
  slotsMap: Map<string, SlotN>;
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
  const slotsMap = getSlotsMap(state);
  const slots = getSlots(state).filter(f => f.get("studentId") === studentId);

  const role = getRole(state).some();

  const loading = isLoading(state);

  return {
    role,
    student,
    entries,
    slots,
    slotsMap,
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

type Mode = "all" | "educational" | "not_educational";

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
    isLoading,
    slotsMap
  } = props;

  const classes = useStyles(props);
  const translation = useTranslation();
  const printButton = usePrintButton();

  const [mode, setMode] = React.useState<Mode>("not_educational");

  const handleModeChanged = React.useCallback(
    (_, value: string) => {
      setMode(value as Mode);
    },
    [setMode]
  );

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

  const entriesEducational = React.useMemo(
    () =>
      entries.filter(e =>
        entryReasonCategoryIsEducational(e.get("reason").category)
      ),
    [entries]
  );

  const entriesNotForSchool = React.useMemo(
    () =>
      entries.filter(
        e => !entryReasonCategoryIsEducational(e.get("reason").category)
      ),
    [entries]
  );

  const slotsForSchool = React.useMemo(
    () => slots.filter(e => e.get("forSchool")),
    [slots]
  );

  const slotsNotForSchool = React.useMemo(
    () => slots.filter(e => !e.get("forSchool")),
    [slots]
  );

  const entriesToUse = {
    all: entries,
    educational: entriesEducational,
    not_educational: entriesNotForSchool
  }[mode];

  const slotsToUse = {
    all: slots,
    educational: slotsForSchool,
    not_educational: slotsNotForSchool
  }[mode];

  const summary = React.useMemo(
    () => Reporting.summarize(entriesToUse, slotsMap),
    [entriesToUse]
  );

  const absentHoursByTeacher = React.useMemo(
    () => Reporting.absentHoursByTeacher(slotsToUse),
    [slotsToUse]
  );

  const hoursByWeekdayAndTime = React.useMemo(
    () => Reporting.hoursByWeekdayAndTime(slotsToUse),
    [slotsToUse]
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
              <FormControl>
                <RadioGroup row value={mode} onChange={handleModeChanged}>
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
                  <FormControlLabel
                    value="all"
                    control={<Radio />}
                    label={translation.modes.all}
                  />
                </RadioGroup>
              </FormControl>
            </Grid>

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
      </div>
    )
  );
};

export default withPrintButton(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(StudentReport)
) as React.FC<StudentReportOwnProps>;
