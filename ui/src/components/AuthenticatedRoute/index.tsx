import * as React from 'react';
import { Redirect, RouteComponentProps, withRouter } from 'react-router';

interface IProps {
  isLoggedIn: boolean;
  authWasChecked: boolean;
}

type Props = IProps;

const AuthenticatedRoute: React.SFC<Props & RouteComponentProps<{}>> = (props) => {
  if (props.isLoggedIn) return (
    <React.Fragment>
      {props.children}
    </React.Fragment>
  );
  
  if (props.authWasChecked) return (
    <Redirect to={{ pathname: '/login', state: { from: props.location } }} />
  );
  
  return (
    <Redirect to={{ pathname: '/loading', state: { from: props.location } }} />
  );
};

export default withRouter(AuthenticatedRoute);
