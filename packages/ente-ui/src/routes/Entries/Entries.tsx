/**
 * EntE
 * (c) 2017-present, Simon Knott <info@simonknott.de>
 *
 * This source code is licensed under the GNU Affero General Public License
 * found in the LICENSE file in the root directory of this source tree.
 */

import * as React from "react";
import withStyles, { WithStyles } from "@material-ui/core/styles/withStyles";
import { connect } from "react-redux";
import styles from "./Entries.styles";
import DoneIcon from "@material-ui/icons/Done";
import AddIcon from "@material-ui/icons/Add";
import {
  AppState,
  getEntries,
  canCreateEntries,
  getUser,
  getEntriesRequest,
  EntryN,
  getFilterScope,
  getRole,
  addReviewedRecordRequest
} from "../../redux";
import { Dispatch } from "redux";
import SignedAvatar from "../../elements/SignedAvatar";
import { RouteComponentProps, withRouter } from "react-router";
import Fab from "@material-ui/core/Fab";
import CreateEntry from "./CreateEntry";
import { Table } from "../../components/Table";
import withErrorBoundary from "../../hocs/withErrorBoundary";
import { makeTranslationHook } from "../../helpers/makeTranslationHook";
import { format, parseISO } from "date-fns";
import * as deLocale from "date-fns/locale/de";
import * as enLocale from "date-fns/locale/en-GB";
import { getFilterScopeValidator } from "../../filter-scope";
import { EntryReasonCategory, Roles } from "ente-types";
import FilterScopeSelectionView from "../../components/FilterScopeSelectionView";
import { useTheme } from "@material-ui/styles";
import { Theme, IconButton } from "@material-ui/core";
import { unstable_useMediaQuery as useMediaQuery } from "@material-ui/core/useMediaQuery";
import { EntriesTableSmallCard } from "./EntriesTableSmallCard";
import { EntryReasonCategoryChip } from "./EntryReasonCategoryChip";
import { EntryReasonCategoriesTranslation } from "../../entryReasonCategories.translation";

const useTranslation = makeTranslationHook({
  en: {
    reason: EntryReasonCategoriesTranslation.en,
    headers: {
      name: "Name",
      date: "Date",
      created: "Created",
      reason: "Reason",
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
      manager: "Stufenleiter",
      parents: "Eltern",
      reviewed: "Abhaken"
    },
    yes: "Ja",
    no: "Nein",
    locale: deLocale
  }
});

const mapStateToProps = (state: AppState) => ({
  entries: getEntries(state),
  getUser: (id: string) => getUser(id)(state),
  filterScope: getFilterScope(state),
  ownRole: getRole(state).orSome(Roles.STUDENT),
  canCreateEntries: canCreateEntries(state)
});

type EntriesStateProps = ReturnType<typeof mapStateToProps>;

const mapDispatchToProps = (dispatch: Dispatch) => ({
  requestEntries: () => dispatch(getEntriesRequest()),
  addToReviewed: (id: string) => dispatch(addReviewedRecordRequest(id))
});

type EntriesDispatchProps = ReturnType<typeof mapDispatchToProps>;

type Props = EntriesStateProps &
  EntriesDispatchProps &
  WithStyles &
  RouteComponentProps<{}>;

export const Entries: React.FunctionComponent<Props> = props => {
  const {
    classes,
    canCreateEntries,
    entries,
    getUser,
    history,
    requestEntries,
    filterScope,
    ownRole,
    addToReviewed
  } = props;

  const lang = useTranslation();

  const theme = useTheme<Theme>();
  const isNarrow = useMediaQuery(theme.breakpoints.down("xs"));

  const [createEntryIsVisible, setCreateEntryIsVisible] = React.useState(false);

  React.useEffect(() => {
    requestEntries();
  }, []);

  const showCreateEntry = React.useCallback(
    () => setCreateEntryIsVisible(true),
    [setCreateEntryIsVisible]
  );
  const closeCreateEntry = React.useCallback(
    () => setCreateEntryIsVisible(false),
    [setCreateEntryIsVisible]
  );
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
    <React.Fragment>
      {/* Modals */}
      <CreateEntry onClose={closeCreateEntry} show={createEntryIsVisible} />

      {/* Main */}
      <Table<EntryN>
        columns={[
          {
            name: lang.headers.name,
            extract: e =>
              getUser(e.get("studentId"))
                .map(e => e.get("displayname"))
                .orSome(""),
            options: {
              filter: false,
              display: ownRole !== Roles.STUDENT
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
                  student={getUser(entry.get("studentId"))}
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
      {canCreateEntries.some() && (
        <Fab color="primary" onClick={showCreateEntry} className={classes.fab}>
          <AddIcon />
        </Fab>
      )}
    </React.Fragment>
  );
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(withErrorBoundary()(withStyles(styles)(Entries))));
