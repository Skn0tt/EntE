import * as React from "react";
import { Maybe, None } from "monet";
import { Roles } from "ente-types";
import {
  UserN,
  EntryN,
  SlotN,
  AppState,
  getRole,
  getUser,
  getUsers,
  getEntries,
  getSlotsMap,
  getOneSelvesGraduationYear
} from "../redux";
import { MapStateToPropsParam, connect } from "react-redux";
import Table from "../components/Table";
import * as _ from "lodash";
import { makeTranslationHook } from "../helpers/makeTranslationHook";
import { Map } from "immutable";
import { Reporting } from "../reporting/reporting";
import { RouteComponentProps } from "react-router";
import { DropdownInput } from "../elements/DropdownInput";
import { Grid, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import { Center } from "../components/Center";

const useStyles = makeStyles({
  padding: {
    margin: 12
  }
});

const useTranslation = makeTranslationHook({
  en: {
    headers: {
      name: "Name",
      absentDays: "Absent days",
      absentHours: "Absent hours",
      unexcusedAbsentHours: "Unexcused absent hours",
      hourRate: "Hour rate"
    },
    year: "Graduation year",
    noUsers: "No users found."
  },
  de: {
    headers: {
      name: "Name",
      absentDays: "Fehltage",
      absentHours: "Fehlstunden",
      unexcusedAbsentHours: "Unentschuldigte Fehlstunden",
      hourRate: "Stundenrate"
    },
    year: "Jahrgangsstufe",
    noUsers: "Keine Nutzer*innen gefunden."
  }
});

const extractId = (u: UserN) => u.get("id");

interface GraduationYearReportRouteOwnProps {}

interface GraduationYearReportRouteStateProps {
  ownGradYear: Maybe<number>;
  ownRole: Roles;
  existingGradYears: number[];
  getUser: (id: string) => Maybe<UserN>;
  getStudentsOfGraduationYear: (year: number) => UserN[];
  getEntriesOfStudent: (id: string) => EntryN[];
  slotsMap: Map<string, SlotN>;
}
const mapStateToProps: MapStateToPropsParam<
  GraduationYearReportRouteStateProps,
  GraduationYearReportRouteOwnProps,
  AppState
> = state => {
  return {
    ownRole: getRole(state).some(),
    ownGradYear: getOneSelvesGraduationYear(state),
    existingGradYears: _.uniq(
      getUsers(state).map(u => u.get("graduationYear")!)
    )
      .filter(v => !!v)
      .sort(),
    getUser: id => getUser(id)(state),
    getStudentsOfGraduationYear: year =>
      getUsers(state).filter(
        u => u.get("graduationYear") === year && u.get("role") === Roles.STUDENT
      ),
    getEntriesOfStudent: studentId =>
      getEntries(state).filter(e => e.get("studentId") === studentId),
    slotsMap: getSlotsMap(state)
  };
};

interface GraduationYearReportRouteParams {
  year?: string;
}

type GraduationYearReportRouteProps = GraduationYearReportRouteStateProps &
  RouteComponentProps<GraduationYearReportRouteParams>;

const GraduationYearReportRoute: React.FC<
  GraduationYearReportRouteProps
> = props => {
  const classes = useStyles(props);
  const translation = useTranslation();

  const {
    slotsMap,
    getStudentsOfGraduationYear: getUsersOfGraduationYear,
    ownGradYear,
    ownRole,
    existingGradYears,
    getEntriesOfStudent,
    history,
    match
  } = props;
  const year = Maybe.fromFalsy(Number(match.params.year))
    .filter(v => existingGradYears.includes(v))
    .orElse(ownGradYear)
    .orElse(Maybe.fromUndefined(existingGradYears[0]));

  const usersOfGradYear = React.useMemo(
    () => year.map(getUsersOfGraduationYear),
    [getUsersOfGraduationYear, year.orSome(0)]
  );

  const handleChangeGradYear = React.useCallback(
    (year: number) => {
      history.replace(`/graduationYears/${year}`);
    },
    [history]
  );

  const handleRowClicked = React.useCallback(
    (userId: string) => {
      history.push(`/users/${userId}/report`);
    },
    [history]
  );

  return usersOfGradYear.cata(
    () => (
      <Center>
        <Typography>{translation.noUsers}</Typography>
      </Center>
    ),
    users => (
      <Grid container direction="column" spacing={16}>
        {ownRole === Roles.ADMIN && (
          <Grid item className={classes.padding}>
            <DropdownInput
              value={year.some()}
              options={existingGradYears}
              getOptionLabel={String}
              onChange={handleChangeGradYear}
              fullWidth
              label={translation.year}
            />
          </Grid>
        )}

        <Grid item>
          <Table<UserN>
            headers={[
              translation.headers.name,
              translation.headers.absentDays,
              translation.headers.absentHours,
              translation.headers.unexcusedAbsentHours,
              translation.headers.hourRate
            ]}
            extract={u => {
              const entries = getEntriesOfStudent(u.get("id"));
              const summary = Reporting.summarize(entries, slotsMap);
              return [
                u.get("displayname"),
                summary.absentDays.total,
                summary.absentSlots.total,
                summary.absentSlots.unexcused,
                summary.slotsPerDay
              ].map(String);
            }}
            onClick={handleRowClicked}
            extractId={extractId}
            items={users}
          />
        </Grid>
      </Grid>
    )
  );
};

export default connect(mapStateToProps)(GraduationYearReportRoute);
