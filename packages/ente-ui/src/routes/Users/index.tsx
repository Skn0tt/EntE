/**
 * EntE
 * (c) 2017-present, Simon Knott <info@simonknott.de>
 *
 * This source code is licensed under the GNU Affero General Public License
 * found in the LICENSE file in the root directory of this source tree.
 */

import * as React from "react";
import withStyles, { WithStyles } from "material-ui/styles/withStyles";
import { connect, Dispatch } from "react-redux";
import styles from "./styles";
import { Action } from "redux";
import CreateUser from "./components/CreateUser";
import { Button } from "material-ui";
import { Add as AddIcon } from "material-ui-icons";
import { User, AppState, getUsers, getUsersRequest } from "ente-redux";
import withErrorBoundary from "../../components/withErrorBoundary";
import Table from "../../components/Table";
import { withRouter, RouteComponentProps } from "react-router";

class UserTable extends Table<User> {}

/**
 * # Component Types
 */
interface StateProps {
  users: User[];
}
const mapStateToProps = (state: AppState) => ({
  users: getUsers(state)
});

interface DispatchProps {
  getUsers(): Action;
}
const mapDispatchToProps = (dispatch: Dispatch<Action>) => ({
  getUsers: () => dispatch(getUsersRequest())
});

type Props = StateProps & DispatchProps & WithStyles & RouteComponentProps<{}>;

interface State {
  showCreateModal: boolean;
}

/**
 * # Component
 */
export class Users extends React.PureComponent<Props, State> {
  state: State = {
    showCreateModal: false
  };

  componentDidMount() {
    this.props.getUsers();
  }

  showCreateModal = () => this.setState({ showCreateModal: true });
  closeCreateModal = () => this.setState({ showCreateModal: false });

  render() {
    const { users, history, classes } = this.props;

    return (
      <React.Fragment>
        {/* Modals */}
        <CreateUser
          onClose={this.closeCreateModal}
          show={this.state.showCreateModal}
        />

        {/* Main */}
        <UserTable
          headers={[
            {
              name: "Username",
              options: {
                filter: false
              }
            },
            {
              name: "Displayname",
              options: {
                filter: false
              }
            },
            {
              name: "Email",
              options: {
                filter: false
              }
            },
            {
              name: "Role"
            }
          ]}
          items={users}
          extract={user => [
            user.get("username")!,
            user.get("displayname")!,
            user.get("email")!,
            user.get("role")!
          ]}
          extractId={user => user.get("_id")}
          onClick={id => history.push(`/users/${id}`)}
        />

        {/* FAB */}
        <Button
          color="primary"
          variant="fab"
          onClick={this.showCreateModal}
          className={classes.fab}
        >
          <AddIcon />
        </Button>
      </React.Fragment>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(
  withStyles(styles)(withRouter(withErrorBoundary()(Users)))
);
