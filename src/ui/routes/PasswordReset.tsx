/**
 * EntE
 * (c) 2017-present, Simon Knott <info@simonknott.de>
 *
 * This source code is licensed under the GNU Affero General Public License
 * found in the LICENSE file in the root directory of this source tree.
 */

import * as React from "react";
import {
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@material-ui/core";
import withErrorBoundary from "../hocs/withErrorBoundary";
import { makeTranslationHook } from "../helpers/makeTranslationHook";
import { SetPasswordForm } from "../components/SetPasswordForm";
import * as querystring from "query-string";
import { useMessages } from "../context/Messages";
import { setPassword } from "../passwordReset";
import { useLanguage } from "../helpers/useLanguage";
import { useRouter } from "next/router";
import { ResponsiveFullscreenDialog } from "../components/ResponsiveFullscreenDialog";

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

const PasswordReset = (props: {}) => {
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
    <ResponsiveFullscreenDialog open>
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
    </ResponsiveFullscreenDialog>
  );
};

export default withErrorBoundary()(PasswordReset);
