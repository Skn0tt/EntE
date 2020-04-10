/**
 * EntE
 * (c) 2017-present, Simon Knott <info@simonknott.de>
 *
 * This source code is licensed under the GNU Affero General Public License
 * found in the LICENSE file in the root directory of this source tree.
 */

import * as React from "react";
import { Redirect, RouteComponentProps, withRouter } from "react-router";

/**
 * # Component Types
 */
interface AuthenticatedRouteOwnProps {
  isLoggedIn: boolean;
  purgeStaleData: () => void;
}

type AuthenticatedRouteProps = AuthenticatedRouteOwnProps &
  RouteComponentProps<{}>;

/**
 * # Component
 */
export const AuthenticatedRoute: React.SFC<AuthenticatedRouteProps> = props => {
  const { location, children, isLoggedIn, purgeStaleData } = props;

  React.useEffect(
    () => {
      if (!isLoggedIn) {
        purgeStaleData();
      }
    },
    [isLoggedIn, purgeStaleData]
  );

  if (isLoggedIn) {
    return <>{children}</>;
  }

  return <Redirect to={{ pathname: "/login", state: { from: location } }} />;
};

export default withRouter(AuthenticatedRoute);
