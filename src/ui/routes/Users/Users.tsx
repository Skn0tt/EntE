/**
 * EntE
 * (c) 2017-present, Simon Knott <info@simonknott.de>
 *
 * This source code is licensed under the GNU Affero General Public License
 * found in the LICENSE file in the root directory of this source tree.
 */

import * as React from "react";
import { useDispatch, useSelector } from "react-redux";
import CreateUser from "./CreateUser";
import Fab from "@material-ui/core/Fab";
import AddIcon from "@material-ui/icons/Add";
import { getUsers, getUsersRequest } from "../../redux";
import withErrorBoundary from "../../hocs/withErrorBoundary";
import { UserTable } from "./UserTable";
import { useEffectOnce } from "react-use";
import { makeStyles } from "@material-ui/styles";
import { Theme } from "@material-ui/core";
import { useRouter } from "next/router";

const useStyles = makeStyles((theme: Theme) => ({
  searchBar: {
    padding: 10,
  },
  fab: {
    margin: 0,
    top: "auto",
    right: theme.spacing.unit * 2,
    bottom: theme.spacing.unit * 2,
    left: "auto",
    position: "fixed",
  },
  table: {
    overflowX: "auto",
  },
}));

export function Users(props: {}) {
  const [showCreateModal, setShowCreateModal] = React.useState(false);

  const classes = useStyles();
  const users = useSelector(getUsers);
  const dispatch = useDispatch();
  const router = useRouter();

  useEffectOnce(() => {
    dispatch(getUsersRequest());
  });

  return (
    <React.Fragment>
      {/* Modals */}
      <CreateUser
        onClose={() => setShowCreateModal(false)}
        show={showCreateModal}
      />

      {/* Main */}
      <UserTable
        users={users}
        onClick={(id) => router.push("/users/[userId]", `/users/${id}`)}
      />

      {/* FAB */}
      <Fab
        color="primary"
        onClick={() => setShowCreateModal(true)}
        className={classes.fab}
      >
        <AddIcon />
      </Fab>
    </React.Fragment>
  );
}

export default withErrorBoundary()(Users);
