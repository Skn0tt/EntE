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

interface StudentReportOwnProps {}

interface StudentReportRouteParams {
  studentId: string;
}

type StudentReportProps = StudentReportOwnProps &
  RouteComponentProps<StudentReportRouteParams>;

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
  const { entries, student, slots } = props;

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

  return (
    <>
      {student.some().get("displayname")}
      {JSON.stringify(hoursByWeekdayAndTime)}
      {JSON.stringify(summary)}
      {JSON.stringify(slotsByTeacher)}
    </>
  );
};

export default withRouter(connect(mapStateToProps)(StudentReport));
