/**
 * EntE
 * (c) 2017-present, Simon Knott <info@simonknott.de>
 *
 * This source code is licensed under the GNU Affero General Public License
 * found in the LICENSE file in the root directory of this source tree.
 */

import * as React from "react";
import {
  connect,
  MapStateToPropsParam,
  MapDispatchToPropsParam
} from "react-redux";

import SignedAvatar from "../../elements/SignedAvatar";
import { Action } from "redux";
import { Table } from "../../components/Table";
import {
  getSlotsRequest,
  getUser,
  getSlots,
  AppState,
  SlotN,
  UserN,
  getTimeScope,
  getRole
} from "../../redux";
import withErrorBoundary from "../../hocs/withErrorBoundary";
import { Maybe, None, Some } from "monet";
import { makeTranslationHook } from "../../helpers/makeTranslationHook";
import { format, parseISO } from "date-fns";
import * as enLocale from "date-fns/locale/en-GB";
import * as deLocale from "date-fns/locale/de";
import { getTimeScopeValidator, TimeScope } from "../../time-scope";
import TimeScopeSelectionView from "../../components/TimeScopeSelectionView";
import { Grid, Theme } from "@material-ui/core";
import { CourseFilterButton } from "../../components/CourseFilterButton";
import { CourseFilter, isSlotDuringCourse } from "../../helpers/course-filter";
import { useTheme } from "@material-ui/styles";
import { unstable_useMediaQuery as useMediaQuery } from "@material-ui/core/useMediaQuery";
import { SlotsTableSmallCard } from "./SlotsTableSmallCard";
import { Roles } from "ente-types";

const useTranslation = makeTranslationHook({
  en: {
    headers: {
      name: "Name",
      date: "Date",
      from: "From",
      to: "To",
      forSchool: "For School",
      signed: "Signed",
      teacher: "Teacher"
    },
    deleted: "Deleted",
    yes: "Yes",
    no: "No",
    locale: enLocale
  },
  de: {
    headers: {
      name: "Name",
      date: "Datum",
      from: "Von",
      to: "Bis",
      forSchool: "Schulisch",
      signed: "Unterschrieben",
      teacher: "Lehrer"
    },
    deleted: "Gelöscht",
    yes: "Ja",
    no: "Nein",
    locale: deLocale
  }
});

interface SlotsStateProps {
  slots: SlotN[];
  getUser(id: string): Maybe<UserN>;
  timeScope: TimeScope;
  role: Roles;
}
const mapStateToProps: MapStateToPropsParam<
  SlotsStateProps,
  SlotsOwnProps,
  AppState
> = state => ({
  slots: getSlots(state),
  getUser: id => getUser(id)(state),
  timeScope: getTimeScope(state),
  role: getRole(state).some()
});

interface SlotsDispatchProps {
  requestSlots(): Action;
}
const mapDispatchToProps: MapDispatchToPropsParam<
  SlotsDispatchProps,
  SlotsOwnProps
> = dispatch => ({
  requestSlots: () => dispatch(getSlotsRequest())
});

interface SlotsOwnProps {}

type SlotsProps = SlotsStateProps & SlotsDispatchProps;

const Slots: React.FunctionComponent<SlotsProps> = props => {
  const lang = useTranslation();
  const { getUser, slots, requestSlots, timeScope, role } = props;
  const theme = useTheme<Theme>();
  const isNarrow = useMediaQuery(theme.breakpoints.down("xs"));

  const [courseFilter, setCourseFilter] = React.useState<Maybe<CourseFilter>>(
    None()
  );

  const slotsInScope = React.useMemo(
    () => {
      const validator = getTimeScopeValidator(timeScope);
      return slots.filter(s => validator(parseISO(s.get("date"))));
    },
    [slots, timeScope]
  );

  const slotsInCourse = React.useMemo(
    () =>
      courseFilter.cata(
        () => slotsInScope,
        course => slotsInScope.filter(isSlotDuringCourse(course))
      ),
    [courseFilter, slotsInScope]
  );

  React.useEffect(() => {
    requestSlots();
  }, []);

  return (
    <Table<SlotN>
      columns={[
        {
          name: lang.headers.name,
          extract: slot =>
            getUser(slot.get("studentId"))
              .map(user => user.get("displayname"))
              .orSome(""),
          options: {
            filter: false,
            display: role !== Roles.STUDENT
          }
        },
        {
          name: lang.headers.date,
          extract: slot => parseISO(slot.get("date")),
          options: {
            filter: false,
            customBodyRender: isoTime =>
              format(isoTime, "PP", { locale: lang.locale })
          }
        },
        {
          name: lang.headers.from,
          extract: slot => slot.get("from"),
          options: {
            filter: false
          }
        },
        {
          name: lang.headers.to,
          extract: slot => slot.get("to"),
          options: {
            filter: false
          }
        },
        {
          name: lang.headers.forSchool,
          extract: slot => (slot.get("forSchool") ? lang.yes : lang.no)
        },
        {
          name: lang.headers.signed,
          extract: slot => (slot.get("signed") ? lang.yes : lang.no),
          options: {
            customBodyRender: s => <SignedAvatar signed={s === lang.yes} />
          }
        },
        {
          name: lang.headers.teacher,
          extract: slot =>
            Maybe.fromNull(slot.get("teacherId")).cata(
              () => lang.deleted,
              id =>
                getUser(id)
                  .map(user => user.get("displayname"))
                  .orSome("")
            ),
          options: {
            filter: false,
            display: role !== Roles.TEACHER
          }
        }
      ]}
      title={
        <Grid container direction="row" spacing={16} alignItems="center">
          <Grid item xs={6}>
            <TimeScopeSelectionView />
          </Grid>

          <Grid item xs={6}>
            <CourseFilterButton onChange={setCourseFilter} />
          </Grid>
        </Grid>
      }
      items={slotsInCourse}
      extractId={user => user.get("id")}
      customRowRender={
        isNarrow
          ? slot => (
              <SlotsTableSmallCard
                slot={slot}
                role={role}
                studentName={getUser(slot.get("studentId"))
                  .map(s => s.get("displayname"))
                  .orSome("")}
                teacherName={
                  !!slot.get("teacherId")
                    ? getUser(slot.get("teacherId")!)
                        .map(t => t.get("displayname"))
                        .orSome("")
                    : lang.deleted
                }
              />
            )
          : undefined
      }
      persistenceKey="slots-table"
    />
  );
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withErrorBoundary()(Slots));
