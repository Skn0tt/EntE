/**
 * EntE
 * (c) 2017-present, Simon Knott <info@simonknott.de>
 *
 * This source code is licensed under the GNU Affero General Public License
 * found in the LICENSE file in the root directory of this source tree.
 */

import * as React from "react";
import { connect, useSelector, useDispatch } from "react-redux";
import DoneIcon from "@material-ui/icons/Done";
import AddIcon from "@material-ui/icons/Add";
import MailOutlineIcon from "@material-ui/icons/MailOutline";
import * as _ from "lodash";
import {
  AppState,
  getEntries,
  canCreateEntries,
  getUser,
  getEntriesRequest,
  EntryN,
  getFilterScope,
  getRole,
  addReviewedRecordRequest,
  getSlots,
  getUsers,
  UserN,
  SlotN
} from "../../redux";
import { Dispatch } from "redux";
import SignedAvatar from "../../elements/SignedAvatar";
import { RouteComponentProps, withRouter, useHistory } from "react-router";
import Fab from "@material-ui/core/Fab";
import { Table } from "../../components/Table";
import withErrorBoundary from "../../hocs/withErrorBoundary";
import { makeTranslationHook } from "../../helpers/makeTranslationHook";
import { format, parseISO } from "date-fns";
import * as deLocale from "date-fns/locale/de";
import * as enLocale from "date-fns/locale/en-GB";
import { getFilterScopeValidator, FilterScope } from "../../filter-scope";
import { Roles } from "ente-types";
import FilterScopeSelectionView from "../../components/FilterScopeSelectionView";
import { useTheme, makeStyles } from "@material-ui/styles";
import { Theme, IconButton } from "@material-ui/core";
import { unstable_useMediaQuery as useMediaQuery } from "@material-ui/core/useMediaQuery";
import { EntriesTableSmallCard } from "./EntriesTableSmallCard";
import { EntryReasonCategoryChip } from "./EntryReasonCategoryChip";
import { EntryReasonCategoriesTranslation } from "../../entryReasonCategories.translation";
import { Reporting } from "../../reporting/reporting";
import { Link } from "react-router-dom";
import { useEffectOnce } from "react-use";
import { Maybe } from "monet";

const useTranslation = makeTranslationHook({
  en: {
    reason: EntryReasonCategoriesTranslation.en,
    headers: {
      name: "Name",
      date: "Date",
      created: "Created",
      reason: "Reason",
      duration: "Duration [Classes]",
      manager: "Manager",
      parents: "Parents",
      reviewed: "Review"
    },
    yes: "Yes",
    no: "No",
    locale: enLocale
  },
  de: {
    reason: EntryReasonCategoriesTranslation.de,
    headers: {
      name: "Name",
      date: "Datum",
      created: "Erstellt",
      reason: "Grund",
      duration: "Dauer [Stunden]",
      manager: "Stufenleiter",
      parents: "Eltern",
      reviewed: "Abhaken"
    },
    yes: "Ja",
    no: "Nein",
    locale: deLocale
  }
});

const useStyles = makeStyles((theme: Theme) => ({
  searchBar: {
    padding: 10
  },
  fab: {
    margin: 0,
    top: "auto",
    right: theme.spacing.unit * 2,
    bottom: theme.spacing.unit * 2,
    left: "auto",
    position: "fixed"
  },
  table: {
    overflowX: "auto"
  }
}));

export const Entries = () => {
  const classes = useStyles();
  const history = useHistory();

  const entries = useSelector<AppState, EntryN[]>(getEntries);
  const usersArr = useSelector<AppState, UserN[]>(getUsers);
  const users = _.keyBy(usersArr, u => u.get("id"));
  const filterScope = useSelector<AppState, FilterScope>(getFilterScope);
  const ownRole = useSelector<AppState, Roles>(s =>
    getRole(s).orSome(Roles.STUDENT)
  );
  const userCanCreateEntries = useSelector<AppState, boolean>(s =>
    canCreateEntries(s).some()
  );
  const slots = useSelector<AppState, SlotN[]>(getSlots);

  const dispatch = useDispatch();

  const addToReviewed = React.useCallback(
    (id: string) => dispatch(addReviewedRecordRequest(id)),
    [dispatch]
  );

  const slotsByEntryId = React.useMemo(
    () => {
      const slotByIds = _.keyBy(slots, slot => slot.get("id"));

      return _.fromPairs(
        entries.map(entry => {
          const entryId = entry.get("id");
          const slots = entry.get("slotIds").map(id => slotByIds[id]);
          return [entryId, slots];
        })
      );
    },
    [slots, entries]
  );

  const lang = useTranslation();

  const theme = useTheme<Theme>();
  const isNarrow = useMediaQuery(theme.breakpoints.down("xs"));

  useEffectOnce(() => {
    dispatch(getEntriesRequest());
  });

  const customBodyRender = React.useMemo(
    () => (v: string) => <SignedAvatar signed={v === lang.yes} />,
    [lang.yes]
  );

  const entriesInScope = React.useMemo(
    () => {
      const validator = getFilterScopeValidator(filterScope);
      return entries.filter(e =>
        validator({
          date: parseISO(e.get("createdAt")),
          id: e.get("id"),
          isInReviewedRecords: e.get("isInReviewedRecords")
        })
      );
    },
    [entries, filterScope]
  );

  const handleClick = React.useCallback(
    (id: string) => {
      history.push(`/entries/${id}`);
    },
    [history]
  );

  return (
    <>
      {/* Main */}
      <Table<EntryN>
        columns={[
          {
            name: lang.headers.name,
            extract: e => {
              const name = users[e.get("studentId")].get("displayname");
              const managerReachedOut = e.get("managerReachedOut");

              return { name, managerReachedOut };
            },
            options: {
              filter: false,
              display: ownRole !== Roles.STUDENT,
              customBodyRender: ({
                name,
                managerReachedOut
              }: {
                name: string;
                managerReachedOut: boolean;
              }) => {
                if (managerReachedOut && ownRole === Roles.MANAGER) {
                  return (
                    <span
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginRight: "-56px"
                      }}
                    >
                      {name}
                      <MailOutlineIcon color="primary" />
                    </span>
                  );
                }

                return name;
              }
            }
          },
          {
            name: lang.headers.date,
            extract: e => e.get("date"),
            options: {
              filter: false,
              customBodyRender: (isoTime: string) =>
                format(parseISO(isoTime), "PP", { locale: lang.locale })
            }
          },
          {
            name: lang.headers.created,
            extract: e => e.get("createdAt"),
            options: {
              filter: false,
              customBodyRender: (isoTime: string) =>
                format(parseISO(isoTime), "PPpp", { locale: lang.locale })
            }
          },
          {
            name: lang.headers.reason,
            extract: e => {
              const category = e.get("reason").category;
              return lang.reason[category];
            },
            options: {
              filter: true,
              customBodyRender: (s: string) => (
                <EntryReasonCategoryChip reasonCategoryTranslated={s} />
              )
            }
          },
          {
            name: lang.headers.duration,
            extract: e => {
              const slots = slotsByEntryId[e.get("id")];
              return _.sumBy(slots, Reporting.getLengthOfSlot);
            }
          },
          {
            name: lang.headers.manager,
            extract: e => (e.get("signedManager") ? lang.yes : lang.no),
            options: { customBodyRender, filter: true }
          },
          {
            name: lang.headers.parents,
            extract: e => (e.get("signedParent") ? lang.yes : lang.no),
            options: { customBodyRender, filter: true }
          },
          {
            name: lang.headers.reviewed,
            extract: (entry: EntryN) => entry.get("id"),
            options: {
              filter: false,
              display:
                [Roles.TEACHER, Roles.MANAGER].includes(ownRole) &&
                filterScope === "not_reviewed",
              customBodyRender: (id: string) => {
                return (
                  <IconButton
                    onClick={evt => {
                      evt.stopPropagation();
                      addToReviewed(id);
                    }}
                  >
                    <DoneIcon />
                  </IconButton>
                );
              }
            }
          }
        ]}
        key={"EntriesTable" + (filterScope === "not_reviewed")}
        title={<FilterScopeSelectionView />}
        items={entriesInScope}
        extractId={entry => entry.get("id")}
        onClick={handleClick}
        customRowRender={
          isNarrow
            ? entry => (
                <EntriesTableSmallCard
                  entry={entry}
                  role={ownRole}
                  student={Maybe.fromUndefined(users[entry.get("studentId")])}
                  onClick={entry => handleClick(entry.get("id"))}
                  showAddToReviewed={
                    [Roles.TEACHER, Roles.MANAGER].includes(ownRole) &&
                    filterScope === "not_reviewed"
                  }
                  addToReviewed={() => addToReviewed(entry.get("id"))}
                />
              )
            : undefined
        }
        persistenceKey="entries_table"
      />

      {/* FAB */}
      {userCanCreateEntries && (
        <Link to="/entries/new">
          <Fab color="primary" className={classes.fab}>
            <AddIcon />
          </Fab>
        </Link>
      )}
    </>
  );
};

export default withErrorBoundary()(Entries);
