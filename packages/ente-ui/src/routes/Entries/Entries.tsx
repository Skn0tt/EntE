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
  UserN
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
import { format } from "date-fns";
import * as deLocale from "date-fns/locale/de";
import * as enLocale from "date-fns/locale/en-GB";

const useTranslation = makeTranslationHook({
  en: {
    headers: {
      name: "Name",
      date: "Date",
      created: "Created",
      forSchool: "Educational",
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
      forSchool: "Schulisch",
      manager: "Stufenleiter",
      parents: "Eltern"
    },
    yes: "Ja",
    no: "Nein",
    locale: deLocale
  }
});

class EntriesTable extends Table<EntryN> {}

interface EntriesOwnProps {}

interface EntriesStateProps {
  entries: EntryN[];
  canCreateEntries: Maybe<boolean>;
  getUser(id: string): Maybe<UserN>;
}
const mapStateToProps = (state: AppState): EntriesStateProps => ({
  entries: getEntries(state),
  canCreateEntries: canCreateEntries(state),
  getUser: (id: string) => getUser(id)(state)
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

interface State {
  showCreateEntry: boolean;
}
type Props = EntriesOwnProps &
  EntriesStateProps &
  EntriesDispatchProps &
  WithStyles &
  RouteComponentProps<{}>;

/**
 * # Component
 */

export const Entries: React.FunctionComponent<Props> = props => {
  const {
    classes,
    canCreateEntries,
    entries,
    getUser,
    history,
    requestEntries
  } = props;

  const lang = useTranslation();

  const [createEntryIsVisible, setCreateEntryIsVisible] = React.useState(false);

  React.useEffect(() => {
    requestEntries();
  }, []);

  const showCreateEntry = () => setCreateEntryIsVisible(true);
  const closeCreateEntry = () => setCreateEntryIsVisible(false);
  const customBodyRender = (v: string) => (
    <SignedAvatar signed={v === lang.yes} />
  );

  return (
    <React.Fragment>
      {/* Modals */}
      <CreateEntry onClose={closeCreateEntry} show={createEntryIsVisible} />

      {/* Main */}
      <EntriesTable
        headers={[
          lang.headers.name,
          lang.headers.date,
          lang.headers.created,
          { name: lang.headers.forSchool, options: { filter: true } },
          {
            name: lang.headers.manager,
            options: { customBodyRender, filter: true }
          },
          {
            name: lang.headers.parents,
            options: { customBodyRender, filter: true }
          }
        ]}
        items={entries}
        extract={entry => [
          getUser(entry.get("studentId"))
            .some()
            .get("displayname"),
          format(entry.get("date"), "PP", { locale: lang.locale }),
          format(entry.get("createdAt"), "PPpp", { locale: lang.locale }),
          entry.get("forSchool") ? lang.yes : lang.no,
          entry.get("signedManager") ? lang.yes : lang.no,
          entry.get("signedParent") ? lang.yes : lang.no
        ]}
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
