import * as React from "react";
import { Maybe } from "monet";
import { Roles } from "ente-types";
import {
  UserN,
  AppState,
  getUsers,
  getSlotsMap,
  getOneSelvesClass
} from "../redux";
import { MapStateToPropsParam, connect, useSelector } from "react-redux";
import Table from "../components/Table";
import * as _ from "lodash";
import { makeTranslationHook } from "../helpers/makeTranslationHook";
import {
  RouteComponentProps,
  Route,
  useRouteMatch,
  useHistory
} from "react-router";
import { Typography, Grid, Button, Theme } from "@material-ui/core";
import { Center } from "../components/Center";
import AssessmentIcon from "@material-ui/icons/Assessment";
import { makeStyles } from "@material-ui/styles";
import { Reporting } from "../reporting/reporting";

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
  existingClasses: string[];
  getStudentsOfClass: (_class: string) => UserN[];
}
const mapStateToProps: MapStateToPropsParam<
  ClassReportRouteStateProps,
  ClassReportRouteOwnProps,
  AppState
> = state => {
  return {
    existingClasses: _.uniq(getUsers(state).map(u => u.get("class")!))
      .filter(v => !!v)
      .sort(),
    getStudentsOfClass: c =>
      getUsers(state)
        .filter(u => u.get("class") === c)
        .filter(u => u.get("role") === Roles.STUDENT)
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

  const { getStudentsOfClass, existingClasses } = props;

  const { params } = useRouteMatch<ClassReportRouteParams>();
  const history = useHistory();

  const slotsMap = useSelector(getSlotsMap);
  const ownClass = useSelector(getOneSelvesClass);

  const slotsByStudent = _.groupBy(slotsMap.valueSeq().toArray(), s =>
    s.get("studentId")
  );

  const _class = Maybe.fromFalsy(params.class)
    .filter(v => existingClasses.includes(v))
    .orElse(ownClass)
    .orElse(Maybe.fromUndefined(existingClasses[0]));

  const usersOfClass = React.useMemo(() => _class.map(getStudentsOfClass), [
    getStudentsOfClass,
    _class.orUndefined()
  ]);

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
      return (
        <Table<UserN>
          title={
            <Grid
              container
              justify="flex-start"
              alignItems="center"
              spacing={24}
            >
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
                const slots = slotsByStudent[u.get("id")] || [];
                return Reporting.countDays(slots);
              },
              options: {
                filter: false
              }
            },
            {
              name: translation.headers.absentHours,
              extract: u => {
                const slots = slotsByStudent[u.get("id")] || [];
                return Reporting.countHours(slots);
              },
              options: {
                filter: false
              }
            },
            {
              name: translation.headers.unexcusedAbsentHours,
              extract: u => {
                const slots = slotsByStudent[u.get("id")] || [];
                const { created } = Reporting.partitionSlots(slots);
                return Reporting.countHours(created);
              },
              options: {
                filter: false
              }
            },
            {
              name: translation.headers.hourRate,
              extract: u => {
                const slots = slotsByStudent[u.get("id")] || [];
                return Reporting.calcHourRate(slots);
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
