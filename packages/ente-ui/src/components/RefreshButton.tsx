/**
 * EntE
 * (c) 2017-present, Simon Knott <info@simonknott.de>
 *
 * This source code is licensed under the GNU Affero General Public License
 * found in the LICENSE file in the root directory of this source tree.
 */

import * as React from "react";
import { IconButton, CircularProgress } from "@material-ui/core";
import { Dispatch, connect } from "react-redux";
import { Action } from "redux";
import { withRouter, RouteComponentProps } from "react-router";
import RefreshIcon from "@material-ui/icons/Refresh";
import {
  AppState,
  isLoading,
  getEntriesRequest,
  getUsersRequest,
  getSlotsRequest
} from "../redux";

interface StateProps {
  loading: boolean;
}
const mapStateToProps = (state: AppState) => ({
  loading: isLoading(state)
});

interface DispatchProps {
  getEntries(): Action;
  getUsers(): Action;
  getSlots(): Action;
}
const mapDispatchToProps = (dispatch: Dispatch<Action>) => ({
  getEntries: () => dispatch(getEntriesRequest()),
  getUsers: () => dispatch(getUsersRequest()),
  getSlots: () => dispatch(getSlotsRequest())
});

const renderPaths: string[] = ["/entries", "/users", "/slots"];

const shouldRender = (path: string) => renderPaths.indexOf(path) !== -1;

type Props = StateProps & DispatchProps & RouteComponentProps<{}>;

const RefreshButton: React.SFC<Props> = props =>
  props.loading ? (
    <CircularProgress style={{ color: "white" }} />
  ) : shouldRender(props.location.pathname) ? (
    <IconButton
      onClick={() => {
        const { location } = props;
        switch (location.pathname) {
          case "/entries":
            props.getEntries();
            break;
          case "/users":
            props.getUsers();
            break;
          case "/slots":
            props.getSlots();
            break;
          default:
            break;
        }
      }}
      style={{ color: "white" }}
    >
      <RefreshIcon />
    </IconButton>
  ) : null;

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(RefreshButton)
);
