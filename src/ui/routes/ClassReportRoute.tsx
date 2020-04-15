import * as React from "react";
import { UserN, getSlotsMap, getOneSelvesClass, getStudents } from "../redux";
import { useSelector } from "react-redux";
import Table from "../components/Table";
import _ from "lodash";
import { makeTranslationHook } from "../helpers/makeTranslationHook";
import { Typography, Button, Theme } from "@material-ui/core";
import { Center } from "../components/Center";
import AssessmentIcon from "@material-ui/icons/Assessment";
import { makeStyles } from "@material-ui/styles";
import { Reporting } from "../reporting/reporting";
import { useRouter } from "next/router";
import Link from "next/link";

const useStyles = makeStyles((theme: Theme) => ({
  button: {
    color: theme.palette.grey[600],
  },
}));

const useTranslation = makeTranslationHook({
  en: {
    headers: {
      name: "Name",
      absentDays: "Absent days",
      absentHours: "Absent hours",
      unexcusedAbsentHours: "Unexcused absent hours",
      hourRate: "Hour rate",
    },
    year: "Graduation year",
    noUsers: "No students found.",
    openReport: "Open Report",
  },
  de: {
    headers: {
      name: "Name",
      absentDays: "Fehltage",
      absentHours: "Fehlstunden",
      unexcusedAbsentHours: "Unentschuldigte Fehlstunden",
      hourRate: "Stundenrate",
    },
    year: "Jahrgangsstufe",
    noUsers: "Keine Schüler*innen gefunden.",
    openReport: "Bericht öffnen",
  },
});

const extractId = (u: UserN) => u.get("id");

const ClassReportRoute = (props: {}) => {
  const translation = useTranslation();
  const classes = useStyles({});

  const router = useRouter();

  const slotsMap = useSelector(getSlotsMap);
  const ownClass = useSelector(getOneSelvesClass);
  const students = useSelector(getStudents);
  const studentsOfOwnClass = ownClass.map((ownClass) =>
    students.filter((s) => s.get("class") === ownClass)
  );

  const slotsByStudent = _.groupBy(slotsMap.valueSeq().toArray(), (s) =>
    s.get("studentId")
  );

  const handleRowClicked = React.useCallback(
    (userId: string) => {
      router.push("/users/[userId]/report", `/users/${userId}/report`);
    },
    [router]
  );

  return studentsOfOwnClass.cata(
    () => (
      <Center>
        <Typography>{translation.noUsers}</Typography>
      </Center>
    ),
    (users) => {
      return (
        <Table<UserN>
          title={
            <Link href="/class/report">
              <Button variant="text" color="inherit" className={classes.button}>
                <AssessmentIcon />
                {translation.openReport}
              </Button>
            </Link>
          }
          columns={[
            {
              name: translation.headers.name,
              extract: (u) => u.get("displayname"),
              options: {
                filter: false,
              },
            },
            {
              name: translation.headers.absentDays,
              extract: (u) => {
                const slots = slotsByStudent[u.get("id")] || [];
                return Reporting.countDays(slots);
              },
              options: {
                filter: false,
              },
            },
            {
              name: translation.headers.absentHours,
              extract: (u) => {
                const slots = slotsByStudent[u.get("id")] || [];
                return Reporting.countHours(slots);
              },
              options: {
                filter: false,
              },
            },
            {
              name: translation.headers.unexcusedAbsentHours,
              extract: (u) => {
                const slots = slotsByStudent[u.get("id")] || [];
                const { created } = Reporting.partitionSlots(slots);
                return Reporting.countHours(created);
              },
              options: {
                filter: false,
              },
            },
            {
              name: translation.headers.hourRate,
              extract: (u) => {
                const slots = slotsByStudent[u.get("id")] || [];
                return Reporting.calcHourRate(slots);
              },
              options: {
                filter: false,
              },
            },
          ]}
          onClick={handleRowClicked}
          extractId={extractId}
          items={users}
        />
      );
    }
  );
};

export default ClassReportRoute;
