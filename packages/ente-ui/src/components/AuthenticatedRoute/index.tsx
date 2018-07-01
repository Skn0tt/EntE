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
interface OwnProps {
  isLoggedIn: boolean;
}

type Props = OwnProps & RouteComponentProps<{}>;

/**
 * # Component
 */
export const AuthenticatedRoute: React.SFC<Props> = ({
  isLoggedIn,
  children,
  location
}) =>
  isLoggedIn ? (
    <>{children}</>
  ) : (
    <Redirect to={{ pathname: "/login", state: { from: location } }} />
  );

export default withRouter(AuthenticatedRoute);
