/**
 * EntE
 * (c) 2017-present, Simon Knott <info@simonknott.de>
 *
 * This source code is licensed under the GNU Affero General Public License
 * found in the LICENSE file in the root directory of this source tree.
 */

import * as React from "react";
import withStyles, { WithStyles } from "@material-ui/core/styles/withStyles";
import { connect, MapDispatchToPropsParam } from "react-redux";
import styles from "./Entries.styles";
import AddIcon from "@material-ui/icons/Add";
import {
  AppState,
  getEntries,
  canCreateEntries,
  getUser,
  getEntriesRequest,
  EntryN,
  UserN,
  getTimeScope,
  getRole
} from "../../redux";
import { Action } from "redux";
import SignedAvatar from "../../elements/SignedAvatar";
import { RouteComponentProps, withRouter } from "react-router";
import Fab from "@material-ui/core/Fab";
import CreateEntry from "./CreateEntry";
import { Table } from "../../components/Table";
import withErrorBoundary from "../../hocs/withErrorBoundary";
import { Maybe } from "monet";
import { makeTranslationHook } from "../../helpers/makeTranslationHook";
import { format, parseISO } from "date-fns";
import * as deLocale from "date-fns/locale/de";
import * as enLocale from "date-fns/locale/en-GB";
import { getTimeScopeValidator, TimeScope } from "../../time-scope";
import { EntryReasonCategory, Roles } from "ente-types";
import TimeScopeSelectionView from "../../components/TimeScopeSelectionView";
import { useTheme } from "@material-ui/styles";
import { Theme } from "@material-ui/core";
import { unstable_useMediaQuery as useMediaQuery } from "@material-ui/core/useMediaQuery";
import { EntriesTableSmallCard } from "./EntriesTableSmallCard";
import { EntryReasonCategoryChip } from "./EntryReasonCategoryChip";

const useTranslation = makeTranslationHook({
  en: {
    headers: {
      name: "Name",
      date: "Date",
      created: "Created",
      reason: "Reason",
      manager: "Manager",
      parents: "Parents"
    },
    yes: "Yes",
    no: "No",
    locale: enLocale
  },
  de: {
    headers: {
      name: "Name",
      date: "Datum",
      created: "Erstellt",
      reason: "Grund",
      manager: "Stufenleiter",
      parents: "Eltern"
    },
    yes: "Ja",
    no: "Nein",
    locale: deLocale
  }
});

interface EntriesOwnProps {}

interface EntriesStateProps {
  entries: EntryN[];
  canCreateEntries: Maybe<boolean>;
  getUser(id: string): Maybe<UserN>;
  timeScope: TimeScope;
  ownRole: Roles;
}
const mapStateToProps = (state: AppState): EntriesStateProps => ({
  entries: getEntries(state),
  canCreateEntries: canCreateEntries(state),
  getUser: (id: string) => getUser(id)(state),
  timeScope: getTimeScope(state),
  ownRole: getRole(state).some()
});

interface EntriesDispatchProps {
  requestEntries(): Action;
}
const mapDispatchToProps: MapDispatchToPropsParam<
  EntriesDispatchProps,
  EntriesOwnProps
> = dispatch => ({
  requestEntries: () => dispatch(getEntriesRequest())
});

type Props = EntriesOwnProps &
  EntriesStateProps &
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
    timeScope,
    ownRole
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
      const validator = getTimeScopeValidator(timeScope);
      return entries.filter(e => validator(parseISO(e.get("createdAt"))));
    },
    [entries, timeScope]
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
            extract: e => parseISO(e.get("date")),
            options: {
              filter: false,
              customBodyRender: (isoTime: number) =>
                format(isoTime, "PP", { locale: lang.locale })
            }
          },
          {
            name: lang.headers.created,
            extract: e => parseISO(e.get("createdAt")),
            options: {
              filter: false,
              customBodyRender: (isoTime: number) =>
                format(isoTime, "PPpp", { locale: lang.locale })
            }
          },
          {
            name: lang.headers.reason,
            extract: e => e.get("reason").category,
            options: {
              filter: true,
              customBodyRender: (category: EntryReasonCategory) => (
                <EntryReasonCategoryChip reasonCategory={category} />
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
          }
        ]}
        title={<TimeScopeSelectionView />}
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
                />
              )
            : undefined
        }
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
