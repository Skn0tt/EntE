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
import styles from "./Users.styles";
import { Action, Dispatch } from "redux";
import CreateUser from "./CreateUser";
import Fab from "@material-ui/core/Fab";
import AddIcon from "@material-ui/icons/Add";
import { AppState, getUsers, getUsersRequest, UserN } from "../../redux";
import { withRouter, RouteComponentProps } from "react-router";
import withErrorBoundary from "../../hocs/withErrorBoundary";
import { UserTable } from "./UserTable";

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
        <UserTable users={users} onClick={id => history.push(`/users/${id}`)} />

        {/* FAB */}
        <Fab
          color="primary"
          onClick={this.showCreateModal}
          className={classes.fab}
        >
          <AddIcon />
        </Fab>
      </React.Fragment>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(
  withRouter(withErrorBoundary()(withStyles(styles)(Users)))
);
