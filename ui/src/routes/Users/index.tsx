import * as React from 'react';
import withStyles, { WithStyles } from 'material-ui/styles/withStyles';
import { connect, Dispatch } from 'react-redux';

import styles from './styles';

import * as select from '../../redux/selectors';
import { User, AppState } from '../../interfaces/index';
import { getUsersRequest } from '../../redux/actions';
import { Action } from 'redux';
import CreateUser from './components/CreateUser';
import Table from '../../components/Table';
import { withRouter, RouteComponentProps } from 'react-router';

interface StateProps {
  users: User[];
}
const mapStateToProps = (state: AppState) => ({
  users: select.getUsers(state),
});

interface DispatchProps {
  getUsers(): Action;
}
const mapDispatchToProps = (dispatch: Dispatch<Action>) => ({
  getUsers: () => dispatch(getUsersRequest()),
});

type Props = StateProps & DispatchProps & WithStyles & RouteComponentProps<{}>;

interface State {
  showCreateModal: boolean;
}

const Users = connect(mapStateToProps, mapDispatchToProps)(
  withStyles(styles)(
    withRouter(
      class extends React.Component<Props, State> {
        state: State = {
          showCreateModal: false,
        };

        componentDidMount() {
          this.props.getUsers();
        }

        showCreateModal = () => this.setState({ showCreateModal: true });
        closeCreateModal = () => this.setState({ showCreateModal: false });

        render() {
          const { users, history } = this.props;

          /*<this.TableHeadCell field="username">Username</this.TableHeadCell>
                      <this.TableHeadCell field="displayname">Name</this.TableHeadCell>
                      <this.TableHeadCell field="email">Email</this.TableHeadCell>
                      <this.TableHeadCell field="role">Role</this.TableHeadCell>
        */

          return (
            <React.Fragment>
              <Table
                headers={['Username', 'Displayname', 'Email', 'Role']}
                items={users}
                keyExtractor={(user: User) => user.get('_id')}
                cellExtractor={(user: User) => [
                  user.get('username'),
                  user.get('displayname'),
                  user.get('email'),
                  user.get('role'),
                ]}
                onClick={(user: User) => history.push(`/users/${user.get('_id')}`)}
              />
              <CreateUser
                onClose={() => this.closeCreateModal()}
                show={this.state.showCreateModal}
              />
            </React.Fragment>
          );
        }
      },
    ),
  ),
);

export default Users;
