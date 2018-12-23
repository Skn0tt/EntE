/**
 * EntE
 * (c) 2017-present, Simon Knott <info@simonknott.de>
 *
 * This source code is licensed under the GNU Affero General Public License
 * found in the LICENSE file in the root directory of this source tree.
 */

import * as React from "react";
import {
  connect,
  MapStateToPropsParam,
  MapDispatchToPropsParam
} from "react-redux";
import { RouteComponentProps, Redirect } from "react-router";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button
} from "@material-ui/core";
import withMobileDialog, {
  InjectedProps
} from "@material-ui/core/withMobileDialog";
import {
  setPasswordRequest,
  AppState,
  isTypePending,
  SET_PASSWORD_REQUEST
} from "../redux";
import withErrorBoundary from "../hocs/withErrorBoundary";
import { makeTranslationHook } from "../helpers/makeTranslationHook";
import { SetPasswordForm } from "../components/SetPasswordForm";
import * as querystring from "query-string";

const useTranslation = makeTranslationHook({
  en: {
    submit: "Reset Password",
    title: "Reset Password"
  },
  de: {
    submit: "Passwort zurücksetzen",
    title: "Passwort zurücksetzen"
  }
});

interface PasswordResetStateProps {
  resetIsPending: boolean;
}

const mapStateToProps: MapStateToPropsParam<
  PasswordResetStateProps,
  {},
  AppState
> = state => ({
  resetIsPending: isTypePending(state)(SET_PASSWORD_REQUEST)
});

interface PasswordResetRouteProps {
  token: string;
}

interface PasswordResetDispatchProps {
  setPassword: (newPassword: string) => void;
}
const mapDispatchToProps: MapDispatchToPropsParam<
  PasswordResetDispatchProps,
  PasswordResetProps
> = (dispatch, props) => {
  const { token } = props.match.params;

  return {
    setPassword: (newPassword: string) =>
      dispatch(setPasswordRequest({ token, newPassword }))
  };
};

type PasswordResetProps = RouteComponentProps<PasswordResetRouteProps> &
  InjectedProps;

type PasswordResetPropsConnected = PasswordResetProps &
  PasswordResetDispatchProps &
  PasswordResetStateProps;

const PasswordReset: React.FC<PasswordResetPropsConnected> = props => {
  const { fullScreen, resetIsPending, setPassword, location } = props;
  const [newPassword, setNewPassword] = React.useState("");
  const [requestedReset, setRequestedReset] = React.useState(false);
  const translation = useTranslation();
  const { username: _username = "" } = querystring.parse(location.search);
  const username = typeof _username === "string" ? _username : _username[0];

  const requestReset = React.useCallback(
    () => {
      setPassword(newPassword);
      setRequestedReset(true);
    },
    [setPassword, setRequestedReset, newPassword]
  );

  if (requestedReset && !resetIsPending) {
    return <Redirect to={`/login?username=${username}`} />;
  }

  return (
    <Dialog fullScreen={fullScreen} open>
      <DialogTitle>{translation.title}</DialogTitle>
      <DialogContent>
        <SetPasswordForm onValidPassword={setNewPassword} />
      </DialogContent>
      <DialogActions>
        <Button
          variant="raised"
          disabled={resetIsPending || newPassword === ""}
          onClick={requestReset}
        >
          {translation.submit}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(
  withMobileDialog<PasswordResetPropsConnected>()(
    withErrorBoundary()(PasswordReset)
  )
);
