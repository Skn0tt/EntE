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
import styles from "./Users.styles";
import { Action } from "redux";
import CreateUser from "./CreateUser";
import { Button } from "@material-ui/core";
import { Add as AddIcon } from "@material-ui/icons";
import { AppState, getUsers, getUsersRequest, UserN } from "../../redux";
import { withRouter, RouteComponentProps } from "react-router";
import Table from "../../components/Table";
import withErrorBoundary from "../../hocs/withErrorBoundary";
import { createTranslation } from "ente-ui/src/helpers/createTranslation";

const lang = createTranslation({
  en: {
    headers: {
      username: "Username",
      displayname: "Displayname",
      email: "Email",
      role: "Role"
    }
  },
  de: {
    headers: {
      username: "Nutzername",
      displayname: "Displayname",
      email: "Email",
      role: "Rolle"
    }
  }
});

class UserTable extends Table<UserN> {}

/**
 * # Component Types
 */
interface StateProps {
  users: UserN[];
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

type UsersProps = StateProps &
  DispatchProps &
  WithStyles &
  RouteComponentProps<{}>;

interface UsersState {
  showCreateModal: boolean;
}

/**
 * # Component
 */
export class Users extends React.PureComponent<UsersProps, UsersState> {
  state: UsersState = {
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
              name: lang.headers.username,
              options: {
                filter: false
              }
            },
            {
              name: lang.headers.displayname,
              options: {
                filter: false
              }
            },
            {
              name: lang.headers.email,
              options: {
                filter: false
              }
            },
            {
              name: lang.headers.role
            }
          ]}
          items={users}
          extract={user => [
            user.get("username")!,
            user.get("displayname")!,
            user.get("email")!,
            user.get("role")!
          ]}
          extractId={user => user.get("id")}
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

export default withStyles(styles)(
  connect(mapStateToProps, mapDispatchToProps)(
    withRouter(withErrorBoundary()(Users))
  )
);
