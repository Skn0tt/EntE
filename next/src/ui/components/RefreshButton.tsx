/**
 * EntE
 * (c) 2017-present, Simon Knott <info@simonknott.de>
 *
 * This source code is licensed under the GNU Affero General Public License
 * found in the LICENSE file in the root directory of this source tree.
 */

import * as React from "react";
import { IconButton, CircularProgress } from "@material-ui/core";
import {
  connect,
  MapDispatchToPropsParam,
  MapStateToPropsParam,
} from "react-redux";
import { Action } from "redux";
import { withRouter, RouteComponentProps } from "react-router";
import RefreshIcon from "@material-ui/icons/Refresh";
import {
  AppState,
  isLoading,
  getEntriesRequest,
  getUsersRequest,
  getSlotsRequest,
} from "../redux";

interface RefreshButtonOwnProps {}

interface RefreshButtonStateProps {
  loading: boolean;
}
const mapStateToProps: MapStateToPropsParam<
  RefreshButtonStateProps,
  RefreshButtonOwnProps,
  AppState
> = (state) => ({
  loading: isLoading(state),
});

interface RefreshButtonDispatchProps {
  getEntries(): Action;
  getUsers(): Action;
  getSlots(): Action;
}
const mapDispatchToProps: MapDispatchToPropsParam<
  RefreshButtonDispatchProps,
  RefreshButtonOwnProps
> = (dispatch) => ({
  getEntries: () => dispatch(getEntriesRequest()),
  getUsers: () => dispatch(getUsersRequest()),
  getSlots: () => dispatch(getSlotsRequest()),
});

const renderPaths: string[] = ["/entries", "/users", "/slots"];

const shouldRender = (path: string) => renderPaths.indexOf(path) !== -1;

type RefreshButtonProps = RefreshButtonStateProps &
  RefreshButtonDispatchProps &
  RouteComponentProps<{}>;

const RefreshButton: React.SFC<RefreshButtonProps> = (props) => {
  const { loading, location } = props;

  if (loading) {
    return <CircularProgress style={{ color: "white" }} />;
  }

  if (shouldRender(location.pathname)) {
    return (
      <IconButton
        onClick={() => {
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
    );
  }

  return null;
};

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(RefreshButton)
);
