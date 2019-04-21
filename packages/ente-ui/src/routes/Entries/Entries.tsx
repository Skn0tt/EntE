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
  getTimeScope
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
import { EntryReasonCategoriesTranslation } from "../../entryReasonCategories.translation";
import { getTimeScopeValidator, TimeScope } from "../../time-scope";
import { EntryReasonCategory } from "ente-types";
import TimeScopeSelectionView from "../../components/TimeScopeSelectionView";

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
    reasonCategories: EntryReasonCategoriesTranslation.en,
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
    reasonCategories: EntryReasonCategoriesTranslation.de,
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
}
const mapStateToProps = (state: AppState): EntriesStateProps => ({
  entries: getEntries(state),
  canCreateEntries: canCreateEntries(state),
  getUser: (id: string) => getUser(id)(state),
  timeScope: getTimeScope(state)
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
    timeScope
  } = props;

  const lang = useTranslation();

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
              filter: false
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
              customBodyRender: (category: EntryReasonCategory) =>
                lang.reasonCategories[category]
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
        onClick={id => history.push(`/entries/${id}`)}
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
