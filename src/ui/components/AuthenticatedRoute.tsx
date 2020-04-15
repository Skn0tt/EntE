/**
 * EntE
 * (c) 2017-present, Simon Knott <info@simonknott.de>
 *
 * This source code is licensed under the GNU Affero General Public License
 * found in the LICENSE file in the root directory of this source tree.
 */

import * as React from "react";
import { useRouter } from "next/router";

/**
 * # Component Types
 */
interface AuthenticatedRouteOwnProps {
  isLoggedIn: boolean;
  purgeStaleData: () => void;
}

type AuthenticatedRouteProps = AuthenticatedRouteOwnProps;

/**
 * # Component
 */
export const AuthenticatedRoute = (
  props: React.PropsWithChildren<AuthenticatedRouteProps>
) => {
  const { children, isLoggedIn, purgeStaleData } = props;

  const router = useRouter();

  React.useEffect(() => {
    if (!isLoggedIn) {
      purgeStaleData();
    }
  }, [isLoggedIn, purgeStaleData]);

  if (isLoggedIn) {
    return <>{children}</>;
  }

  router.push(`/login?from=${router.pathname}`, "/login");
  return null;
};

export default AuthenticatedRoute;
