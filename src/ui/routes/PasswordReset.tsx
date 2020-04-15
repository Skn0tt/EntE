/**
 * EntE
 * (c) 2017-present, Simon Knott <info@simonknott.de>
 *
 * This source code is licensed under the GNU Affero General Public License
 * found in the LICENSE file in the root directory of this source tree.
 */

import * as React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@material-ui/core";
import withMobileDialog, {
  InjectedProps,
} from "@material-ui/core/withMobileDialog";
import withErrorBoundary from "../hocs/withErrorBoundary";
import { makeTranslationHook } from "../helpers/makeTranslationHook";
import { SetPasswordForm } from "../components/SetPasswordForm";
import * as querystring from "query-string";
import { useMessages } from "../context/Messages";
import { setPassword } from "../passwordReset";
import { useLanguage } from "../helpers/useLanguage";
import { useRouter } from "next/router";

const useTranslation = makeTranslationHook({
  en: {
    submit: "Reset Password",
    title: "Reset Password",
  },
  de: {
    submit: "Passwort zurücksetzen",
    title: "Passwort zurücksetzen",
  },
});

type PasswordResetProps = InjectedProps;

const PasswordReset = (props: PasswordResetProps) => {
  const { fullScreen } = props;

  const router = useRouter();
  const token = router.query.token as string;

  const [newPassword, setNewPassword] = React.useState("");
  const translation = useTranslation();
  const { username: _username = "" } = querystring.parse(location.search);
  const username = _username as string;

  const [resetIsPending, setResetIsPending] = React.useState(false);
  const [resetSuccessful, setResetSuccessful] = React.useState(false);

  const language = useLanguage();
  const { addMessages } = useMessages();

  const requestReset = React.useCallback(async () => {
    setResetIsPending(true);
    const isSuccessful = await setPassword(newPassword, token, (msgs) =>
      addMessages(msgs[language])
    );
    setResetSuccessful(isSuccessful);
    setResetIsPending(false);
  }, [newPassword, addMessages, language]);

  if (resetSuccessful) {
    router.push("/login", `/login?username=${username}`);
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
