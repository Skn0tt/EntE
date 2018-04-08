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
