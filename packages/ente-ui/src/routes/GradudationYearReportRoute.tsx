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
import { Reporting, EntrySummary } from "../reporting/reporting";
import { RouteComponentProps } from "react-router";
import { DropdownInput } from "../elements/DropdownInput";
import { Typography } from "@material-ui/core";
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
    users => {
      const results: Record<string, EntrySummary> = _.fromPairs(
        users.map(user => {
          const userId = user.get("id");
          const entries = getEntriesOfStudent(userId);
          const summary = Reporting.summarize(entries, slotsMap);
          return [userId, summary];
        })
      );

      return (
        <Table<UserN>
          title={
            ownRole === Roles.ADMIN ? (
              <DropdownInput
                value={year.some()}
                options={existingGradYears}
                getOptionLabel={String}
                onChange={handleChangeGradYear}
                fullWidth
                variant="outlined"
                margin="dense"
                label={translation.year}
              />
            ) : (
              undefined
            )
          }
          columns={[
            {
              name: translation.headers.name,
              extract: u => u.get("displayname"),
              options: {
                filter: false
              }
            },
            {
              name: translation.headers.absentDays,
              extract: u => {
                const record = results[u.get("id")];
                return record.absentDays.total;
              },
              options: {
                filter: false
              }
            },
            {
              name: translation.headers.absentHours,
              extract: u => {
                const record = results[u.get("id")];
                return record.absentSlots.total;
              },
              options: {
                filter: false
              }
            },
            {
              name: translation.headers.unexcusedAbsentHours,
              extract: u => {
                const record = results[u.get("id")];
                return record.absentSlots.unexcused;
              },
              options: {
                filter: false
              }
            },
            {
              name: translation.headers.hourRate,
              extract: u => {
                const record = results[u.get("id")];
                return record.slotsPerDay;
              },
              options: {
                filter: false
              }
            }
          ]}
          onClick={handleRowClicked}
          extractId={extractId}
          items={users}
        />
      );
    }
  );
};

export default connect(mapStateToProps)(GraduationYearReportRoute);
