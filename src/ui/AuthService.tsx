import * as React from "react";
import { useDispatch } from "react-redux";
import { refreshTokenRequest } from "./redux";
import * as config from "./config";

const { ROTATION_PERIOD } = config.get();

function AuthService(props: {}) {
  const dispatch = useDispatch();

  React.useEffect(() => {
    console.log(
      `Starting token refresh cycle: Period is '${ROTATION_PERIOD}'.`
    );
    const timer = setInterval(() => {
      dispatch(refreshTokenRequest());
    }, ROTATION_PERIOD);
    return () => clearInterval(timer);
  }, [dispatch]);

  return null;
}

export default AuthService;
