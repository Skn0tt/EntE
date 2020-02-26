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
  getOneSelvesClass
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

interface ClassReportRouteOwnProps {}

interface ClassReportRouteStateProps {
  ownClass: Maybe<string>;
  ownRole: Roles;
  existingClasses: string[];
  getUser: (id: string) => Maybe<UserN>;
  getStudentsOfClass: (_class: string) => UserN[];
  getEntriesOfStudent: (id: string) => EntryN[];
  slotsMap: Map<string, SlotN>;
}
const mapStateToProps: MapStateToPropsParam<
  ClassReportRouteStateProps,
  ClassReportRouteOwnProps,
  AppState
> = state => {
  return {
    ownRole: getRole(state).some(),
    ownClass: getOneSelvesClass(state),
    existingClasses: _.uniq(getUsers(state).map(u => u.get("class")!))
      .filter(v => !!v)
      .sort(),
    getUser: id => getUser(id)(state),
    getStudentsOfClass: c =>
      getUsers(state)
        .filter(u => u.get("class") === c)
        .filter(u => u.get("role") === Roles.STUDENT),
    getEntriesOfStudent: studentId =>
      getEntries(state).filter(e => e.get("studentId") === studentId),
    slotsMap: getSlotsMap(state)
  };
};

interface ClassReportRouteParams {
  class?: string;
}

type ClassReportRouteProps = ClassReportRouteStateProps &
  RouteComponentProps<ClassReportRouteParams>;

const ClassReportRoute: React.FC<ClassReportRouteProps> = props => {
  const translation = useTranslation();
  const classes = useStyles();

  const {
    slotsMap,
    getStudentsOfClass,
    ownClass,
    ownRole,
    existingClasses,
    getEntriesOfStudent,
    history,
    match
  } = props;
  const _class = Maybe.fromFalsy(match.params.class)
    .filter(v => existingClasses.includes(v))
    .orElse(ownClass)
    .orElse(Maybe.fromUndefined(existingClasses[0]));

  const usersOfClass = React.useMemo(() => _class.map(getStudentsOfClass), [
    getStudentsOfClass,
    _class.orUndefined()
  ]);

  const handleChangeClass = React.useCallback(
    (_class: string) => {
      history.replace(`/classes/${_class}`);
    },
    [history]
  );

  const handleRowClicked = React.useCallback(
    (userId: string) => {
      history.push(`/users/${userId}/report`);
    },
    [history]
  );

  return usersOfClass.cata(
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
                    value={_class.some()}
                    options={existingClasses}
                    getOptionLabel={String}
                    onChange={handleChangeClass}
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
                        history.push(`/classes/${_class.orUndefined()}/report`)
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

export default connect(mapStateToProps)(ClassReportRoute);
