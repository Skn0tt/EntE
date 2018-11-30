/**
 * EntE
 * (c) 2017-present, Simon Knott <info@simonknott.de>
 *
 * This source code is licensed under the GNU Affero General Public License
 * found in the LICENSE file in the root directory of this source tree.
 */

import * as React from "react";
import withStyles, { WithStyles } from "@material-ui/core/styles/withStyles";
import { connect, Dispatch } from "react-redux";
import styles from "./Entries.styles";
import { Add as AddIcon } from "@material-ui/icons";

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
import Button from "@material-ui/core/Button/Button";
import CreateEntry from "./CreateEntry";
import { Table } from "../../components/Table";
import withErrorBoundary from "../../hocs/withErrorBoundary";
import { createTranslation } from "../../helpers/createTranslation";

const lang = createTranslation({
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
    no: "No"
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
    no: "Nein"
  }
});

class EntriesTable extends Table<EntryN> {}

/**
 * # Component Types
 */
interface StateProps {
  entries: EntryN[];
  canCreateEntries: boolean;
  getUser(id: string): UserN;
}
const mapStateToProps = (state: AppState) => ({
  entries: getEntries(state),
  canCreateEntries: canCreateEntries(state),
  getUser: (id: string) => getUser(id)(state)
});

interface DispatchProps {
  requestEntries(): Action;
}
const mapDispatchToProps = (dispatch: Dispatch<Action>) => ({
  requestEntries: () => dispatch(getEntriesRequest())
});

interface State {
  showCreateEntry: boolean;
}
type Props = StateProps & DispatchProps & WithStyles & RouteComponentProps<{}>;

/**
 * # Component
 */
export class Entries extends React.Component<Props, State> {
  state: State = {
    showCreateEntry: false
  };

  componentDidMount() {
    this.props.requestEntries();
  }

  showCreateEntry = () => this.setState({ showCreateEntry: true });
  closeCreateEntry = () => this.setState({ showCreateEntry: false });

  customBodyRender = v => <SignedAvatar signed={v === lang.yes} />;

  render() {
    const { classes, canCreateEntries, entries, getUser, history } = this.props;

    return (
      <React.Fragment>
        {/* Modals */}
        <CreateEntry
          onClose={this.closeCreateEntry}
          show={this.state.showCreateEntry}
        />

        {/* Main */}
        <EntriesTable
          headers={[
            lang.headers.name,
            lang.headers.date,
            lang.headers.created,
            { name: lang.headers.forSchool, options: { filter: true } },
            {
              name: lang.headers.manager,
              options: { customBodyRender: this.customBodyRender, filter: true }
            },
            {
              name: lang.headers.parents,
              options: { customBodyRender: this.customBodyRender, filter: true }
            }
          ]}
          items={entries}
          extract={entry => [
            getUser(entry.get("studentId")).get("displayname"),
            entry.get("date").toLocaleDateString(),
            entry.get("createdAt").toLocaleString(),
            entry.get("forSchool") ? lang.yes : lang.no,
            entry.get("signedManager") ? lang.yes : lang.no,
            entry.get("signedParent") ? lang.yes : lang.no
          ]}
          extractId={entry => entry.get("id")}
          onClick={id => history.push(`/entries/${id}`)}
        />

        {/* FAB */}
        {canCreateEntries && (
          <Button
            color="primary"
            variant="fab"
            onClick={this.showCreateEntry}
            className={classes.fab}
          >
            <AddIcon />
          </Button>
        )}
      </React.Fragment>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(
  withRouter(withErrorBoundary()(withStyles(styles)(Entries)))
);
