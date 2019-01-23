import * as React from "react";
import LoadingIndicator from "../elements/LoadingIndicator";
import {
  AppState,
  isInstanceConfigPresent,
  fetchInstanceConfigRequest
} from "../redux";
import {
  MapStateToPropsParam,
  MapDispatchToPropsParam,
  connect
} from "react-redux";

interface InstanceConfigGateOwnProps {
  children: React.ReactNode;
}

interface InstanceConfigGateStateProps {
  hasInstanceConfig: boolean;
}
const mapStateToProps: MapStateToPropsParam<
  InstanceConfigGateStateProps,
  InstanceConfigGateOwnProps,
  AppState
> = state => ({
  hasInstanceConfig: isInstanceConfigPresent(state)
});

interface InstanceConfigGateDispatchProps {
  fetchInstanceConfig: () => void;
}
const mapDispatchToProps: MapDispatchToPropsParam<
  InstanceConfigGateDispatchProps,
  InstanceConfigGateOwnProps
> = dispatch => ({
  fetchInstanceConfig: () => dispatch(fetchInstanceConfigRequest())
});

type InstanceConfigProps = InstanceConfigGateStateProps &
  InstanceConfigGateDispatchProps &
  InstanceConfigGateOwnProps;

const InstanceConfigGate: React.FC<InstanceConfigProps> = props => {
  const { children, fetchInstanceConfig, hasInstanceConfig } = props;

  React.useEffect(
    () => {
      if (!hasInstanceConfig) {
        fetchInstanceConfig();
      }
    },
    [hasInstanceConfig]
  );

  return hasInstanceConfig ? <>{children}</> : <LoadingIndicator />;
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(InstanceConfigGate);
