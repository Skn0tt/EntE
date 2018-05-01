import * as React from "react";
import withStyles, { WithStyles } from "material-ui/styles/withStyles";
import { connect, Dispatch } from "react-redux";
import styles from "./styles";
import { Add as AddIcon } from "material-ui-icons";

import {
  Entry,
  AppState,
  User,
  getEntries,
  canCreateEntries,
  getUser,
  getEntriesRequest
} from "ente-redux";
import { Action } from "redux";
import SignedAvatar from "../SpecificEntry/elements/SignedAvatar";
import UnsignedAvatar from "../SpecificEntry/elements/UnsignedAvatar";
import { Route, RouteComponentProps, withRouter } from "react-router";
import Button from "material-ui/Button/Button";
import CreateEntry from "./components/CreateEntry";
import Table from "../../components/Table";
import { UserId } from "ente-types";

/**
 * # Component Types
 */
interface StateProps {
  entries: Entry[];
  canCreateEntries: boolean;
  getUser(id: UserId): User;
}
const mapStateToProps = (state: AppState) => ({
  entries: getEntries(state),
  canCreateEntries: canCreateEntries(state),
  getUser: (id: UserId) => getUser(id)(state)
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
        <Table
          headers={[
            "Name",
            "Datum",
            "Erstellt",
            "Schulisch",
            "Begründung",
            "Stufenleiter",
            "Eltern"
          ]}
          items={entries}
          keyExtractor={(entry: Entry) => entry.get("_id")}
          trueElement={<SignedAvatar />}
          falseElement={<UnsignedAvatar />}
          cellExtractor={(entry: Entry) => [
            getUser(entry.get("student")).get("displayname"),
            entry.get("date").toLocaleDateString(),
            entry.get("createdAt").toLocaleString(),
            entry.get("forSchool") ? "Ja" : "Nein",
            entry.get("reason"),
            entry.get("signedManager"),
            entry.get("signedParent")
          ]}
          onClick={(entry: Entry) =>
            history.push(`/entries/${entry.get("_id")}`)
          }
        />

        {/* FAB */}
        {canCreateEntries && (
          <Route
            render={({ history }) => (
              <Button
                color="primary"
                variant="fab"
                onClick={this.showCreateEntry}
                className={classes.fab}
              >
                <AddIcon />
              </Button>
            )}
          />
        )}
      </React.Fragment>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(
  withStyles(styles)(withRouter(Entries))
);
