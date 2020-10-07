import * as React from "react";
import LoadingIndicator from "../elements/LoadingIndicator";
import { fetchInstanceConfigRequest, isInstanceConfigUpToDate } from "../redux";
import { useSelector, useDispatch } from "react-redux";

function InstanceConfigGate(props: React.PropsWithChildren<{}>) {
  const { children } = props;

  const instanceConfigIsUpToDate = useSelector(isInstanceConfigUpToDate);
  const dispatch = useDispatch();

  React.useEffect(() => {
    if (!instanceConfigIsUpToDate) {
      dispatch(fetchInstanceConfigRequest());
    }
  }, [instanceConfigIsUpToDate, dispatch]);

  return instanceConfigIsUpToDate ? <>{children}</> : <LoadingIndicator />;
}

export default InstanceConfigGate;
