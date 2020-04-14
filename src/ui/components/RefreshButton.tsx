/**
 * EntE
 * (c) 2017-present, Simon Knott <info@simonknott.de>
 *
 * This source code is licensed under the GNU Affero General Public License
 * found in the LICENSE file in the root directory of this source tree.
 */

import * as React from "react";
import { IconButton, CircularProgress } from "@material-ui/core";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/router";
import RefreshIcon from "@material-ui/icons/Refresh";
import {
  isLoading,
  getEntriesRequest,
  getUsersRequest,
  getSlotsRequest,
} from "../redux";

const renderPaths: string[] = ["/entries", "/users", "/slots"];

const shouldRender = (path: string) => renderPaths.includes(path);

const RefreshButton = (props: {}) => {
  const loading = useSelector(isLoading);
  const dispatch = useDispatch();

  const { pathname } = useRouter();

  if (loading) {
    return <CircularProgress style={{ color: "white" }} />;
  }

  if (shouldRender(pathname)) {
    return (
      <IconButton
        onClick={() => {
          switch (pathname) {
            case "/entries":
              dispatch(getEntriesRequest());
              break;
            case "/users":
              dispatch(getUsersRequest());
              break;
            case "/slots":
              dispatch(getSlotsRequest());
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

export default RefreshButton;
