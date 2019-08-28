import * as React from "react";
import { Maybe } from "monet";
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
import { RouteComponentProps, Route } from "react-router";
import { DropdownInput } from "../elements/DropdownInput";
import { Typography, Grid, Button, Theme } from "@material-ui/core";
import { Center } from "../components/Center";
import AssessmentIcon from "@material-ui/icons/Assessment";
import { makeStyles } from "@material-ui/styles";

const useStyles = makeStyles((theme: Theme) => ({
  button: {
    color: theme.palette.grey[600]
  }
}));

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
    noUsers: "No students found.",
    openReport: "Open Report"
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
    noUsers: "Keine Schüler*innen gefunden.",
    openReport: "Bericht öffnen"
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
  const translation = useTranslation();
  const classes = useStyles();

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
            <Grid
              container
              justify="flex-start"
              alignItems="center"
              spacing={24}
            >
              {ownRole === Roles.ADMIN && (
                <Grid item xs={8}>
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
                </Grid>
              )}

              <Route
                render={({ history }) => (
                  <Grid item xs={4}>
                    <Button
                      onClick={() =>
                        history.push(
                          `/graduationYears/${year.orSome(0)}/report`
                        )
                      }
                      variant="text"
                      color="inherit"
                      className={classes.button}
                    >
                      <AssessmentIcon />
                      {translation.openReport}
                    </Button>
                  </Grid>
                )}
              />
            </Grid>
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
