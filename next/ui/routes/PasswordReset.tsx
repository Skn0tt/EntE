/**
 * EntE
 * (c) 2017-present, Simon Knott <info@simonknott.de>
 *
 * This source code is licensed under the GNU Affero General Public License
 * found in the LICENSE file in the root directory of this source tree.
 */

import * as React from "react";
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
import withErrorBoundary from "../hocs/withErrorBoundary";
import { makeTranslationHook } from "../helpers/makeTranslationHook";
import { SetPasswordForm } from "../components/SetPasswordForm";
import * as querystring from "query-string";
import { useMessages } from "../context/Messages";
import { setPassword } from "../passwordReset";
import { useLanguage } from "../helpers/useLanguage";

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

interface PasswordResetRouteProps {
  token: string;
}

type PasswordResetProps = RouteComponentProps<PasswordResetRouteProps> &
  InjectedProps;

const PasswordReset: React.FC<PasswordResetProps> = props => {
  const {
    fullScreen,
    location,
    match: {
      params: { token }
    }
  } = props;
  const [newPassword, setNewPassword] = React.useState("");
  const translation = useTranslation();
  const { username: _username = "" } = querystring.parse(location.search);
  const username = typeof _username === "string" ? _username : _username[0];

  const [resetIsPending, setResetIsPending] = React.useState(false);
  const [resetSuccessful, setResetSuccessful] = React.useState(false);

  const language = useLanguage();
  const { addMessages } = useMessages();

  const requestReset = React.useCallback(
    async () => {
      setResetIsPending(true);
      const isSuccessful = await setPassword(newPassword, token, msgs =>
        addMessages(msgs[language])
      );
      setResetSuccessful(isSuccessful);
      setResetIsPending(false);
    },
    [newPassword, addMessages, language]
  );

  if (resetSuccessful) {
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

export default withMobileDialog<PasswordResetProps>()(
  withErrorBoundary()(PasswordReset)
);
