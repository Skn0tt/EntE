import * as React from "react";
import { MapDispatchToPropsParam } from "../../../node_modules/@types/react-redux";
import { refreshTokenRequest } from "ente-redux";
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

export class AuthService extends React.PureComponent<AuthServiceProps> {
  timer: NodeJS.Timer;

  componentDidMount() {
    const { period, refreshToken } = this.props;
    setTimeout(() => {
      console.log(`Starting token refresh cycle: Period is '${period}.'`);
      this.timer = setInterval(refreshToken, period);
    }, period);
  }

  componentWillUnmount() {
    clearInterval(this.timer);
  }

  render() {
    return null;
  }
}

export default connect<{}, AuthServiceDispatchProps, AuthServiceOwnProps>(
  undefined,
  mapDispatchToProps
)(AuthService);
