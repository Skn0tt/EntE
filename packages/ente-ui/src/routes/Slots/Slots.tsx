/**
 * EntE
 * (c) 2017-present, Simon Knott <info@simonknott.de>
 *
 * This source code is licensed under the GNU Affero General Public License
 * found in the LICENSE file in the root directory of this source tree.
 */

import * as React from "react";
import { connect } from "react-redux";
import DoneIcon from "@material-ui/icons/Done";
import CloseIcon from "@material-ui/icons/Close";
import SignedAvatar from "../../elements/SignedAvatar";
import { Dispatch } from "redux";
import { Table } from "../../components/Table";
import {
  getSlotsRequest,
  getUser,
  getSlots,
  AppState,
  SlotN,
  getFilterScope,
  getRole,
  addReviewedRecordRequest
} from "../../redux";
import withErrorBoundary from "../../hocs/withErrorBoundary";
import { Maybe, None } from "monet";
import { makeTranslationHook } from "../../helpers/makeTranslationHook";
import { format, parseISO } from "date-fns";
import * as enLocale from "date-fns/locale/en-GB";
import * as deLocale from "date-fns/locale/de";
import { getFilterScopeValidator } from "../../filter-scope";
import FilterScopeSelectionView from "../../components/FilterScopeSelectionView";
import { Grid, Theme, IconButton } from "@material-ui/core";
import { CourseFilterButton } from "../../components/CourseFilterButton";
import { CourseFilter, isSlotDuringCourse } from "../../helpers/course-filter";
import { useTheme } from "@material-ui/styles";
import { unstable_useMediaQuery as useMediaQuery } from "@material-ui/core/useMediaQuery";
import { SlotsTableSmallCard } from "./SlotsTableSmallCard";
import { Roles } from "ente-types";
import { Set } from "immutable";

const useTranslation = makeTranslationHook({
  en: {
    headers: {
      name: "Name",
      date: "Date",
      from: "From",
      to: "To",
      forSchool: "For School",
      signed: "Signed",
      teacher: "Teacher",
      reviewed: "Review"
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
      teacher: "Lehrer",
      reviewed: "Abhaken"
    },
    deleted: "Gelöscht",
    yes: "Ja",
    no: "Nein",
    locale: deLocale
  }
});

const mapStateToProps = (state: AppState) => {
  return {
    slots: getSlots(state),
    getUser: (id: string) => getUser(id)(state),
    filterScope: getFilterScope(state),
    role: getRole(state).some()
  };
};

type SlotsStateProps = ReturnType<typeof mapStateToProps>;

const mapDispatchToProps = (dispatch: Dispatch) => ({
  requestSlots: () => dispatch(getSlotsRequest()),
  addToReviewed: (id: string) => dispatch(addReviewedRecordRequest(id))
});

type SlotsDispatchProps = ReturnType<typeof mapDispatchToProps>;

type SlotsProps = SlotsStateProps & SlotsDispatchProps;

const Slots: React.FunctionComponent<SlotsProps> = props => {
  const lang = useTranslation();
  const {
    getUser,
    slots,
    requestSlots,
    filterScope,
    role,
    addToReviewed
  } = props;
  const theme = useTheme<Theme>();
  const isNarrow = useMediaQuery(theme.breakpoints.down("xs"));

  const [courseFilter, setCourseFilter] = React.useState<Maybe<CourseFilter>>(
    None()
  );

  const slotsInScope = React.useMemo(
    () => {
      const validator = getFilterScopeValidator(filterScope);
      return slots.filter(s =>
        validator({
          id: s.get("id"),
          date: parseISO(s.get("date")),
          isInReviewedRecords: s.get("isInReviewedRecords")
        })
      );
    },
    [slots, filterScope]
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
        },
        {
          name: lang.headers.reviewed,
          extract: (slot: SlotN) => slot.get("id"),
          options: {
            filter: false,
            display:
              [Roles.MANAGER, Roles.TEACHER].includes(role) &&
              filterScope === "not_reviewed",
            customBodyRender: (id: string) => {
              return (
                <IconButton onClick={() => addToReviewed(id)}>
                  <DoneIcon />
                </IconButton>
              );
            }
          }
        }
      ]}
      title={
        <Grid container direction="row" spacing={16} alignItems="center">
          <Grid item xs={6}>
            <FilterScopeSelectionView />
          </Grid>

          <Grid item xs={6}>
            <CourseFilterButton onChange={setCourseFilter} />
          </Grid>
        </Grid>
      }
      items={slotsInCourse}
      extractId={user => user.get("id")}
      key={"SlotsTable" + (filterScope === "not_reviewed")}
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
                addToReviewed={() => addToReviewed(slot.get("id"))}
                showAddToReviewed={
                  [Roles.MANAGER, Roles.TEACHER].includes(role) &&
                  filterScope === "not_reviewed"
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
