import * as React from "react";
import { MapDispatchToPropsParam } from "../../../node_modules/@types/react-redux";
import { refreshTokenRequest } from "./redux";
import { connect } from "react-redux";

interface AuthServiceOwnProps {
  period: number;
}

interface AuthServiceDispatchProps {
  refreshToken: () => void;
}

const mapDispatchToProps: MapDispatchToPropsParam<
  AuthServiceDispatchProps,
  AuthServiceOwnProps
> = dispatch => ({
  refreshToken: () => dispatch(refreshTokenRequest())
});

type AuthServiceProps = AuthServiceOwnProps & AuthServiceDispatchProps;

const AuthService: React.FC<AuthServiceProps> = props => {
  const { period, refreshToken } = props;

  React.useEffect(
    () => {
      console.log(`Starting token refresh cycle: Period is '${period}'.`);
      const timer = setInterval(refreshToken, period);
      return () => clearInterval(timer);
    },
    [period, refreshToken]
  );

  return null;
};

export default connect<{}, AuthServiceDispatchProps, AuthServiceOwnProps>(
  undefined,
  mapDispatchToProps
)(AuthService);
