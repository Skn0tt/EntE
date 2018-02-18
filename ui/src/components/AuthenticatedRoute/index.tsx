import * as React from 'react';
import { Redirect, RouteComponentProps, withRouter } from 'react-router';

interface OwnProps {
  isLoggedIn: boolean;
}

type Props = OwnProps & RouteComponentProps<{}>;

const AuthenticatedRoute: React.SFC<Props> = props => {
  if (props.isLoggedIn) return <React.Fragment>{props.children}</React.Fragment>;

  return <Redirect to={{ pathname: '/login', state: { from: props.location } }} />;
};

export default withRouter(AuthenticatedRoute);
