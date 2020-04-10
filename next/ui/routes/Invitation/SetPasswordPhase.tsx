import * as React from "react";
import {
  DialogTitle,
  DialogContent,
  DialogActions,
  Button
} from "@material-ui/core";
import { SetPasswordForm } from "../../components/SetPasswordForm";
import { makeTranslationHook } from "../../helpers/makeTranslationHook";
import { setPassword } from "../../passwordReset";
import { useMessages } from "../../context/Messages";
import { useLanguage } from "../../helpers/useLanguage";

const useTranslation = makeTranslationHook({
  en: {
    title: "Please set your password.",
    submit: "OK"
  },
  de: {
    title: "Bitte setzen Sie ihr Passwort.",
    submit: "OK"
  }
});

interface SetPasswordPhaseProps {
  token: string;
  onDone: () => void;
}
const SetPasswordPhase: React.FC<SetPasswordPhaseProps> = props => {
  const { onDone, token } = props;
  const translation = useTranslation();
  const [newPassword, setNewPassword] = React.useState("");
  const [requestPending, setRequestPending] = React.useState(false);
  const language = useLanguage();
  const { addMessages } = useMessages();

  const requestReset = React.useCallback(
    async () => {
      setRequestPending(true);
      await setPassword(newPassword, token, msgs =>
        addMessages(msgs[language])
      );
      onDone();
    },
    [newPassword, onDone, language, addMessages, token]
  );

  return (
    <>
      <DialogTitle>{translation.title}</DialogTitle>
      <DialogContent>
        <SetPasswordForm onValidPassword={setNewPassword} />
      </DialogContent>
      <DialogActions>
        <Button
          variant="raised"
          disabled={requestPending || newPassword === ""}
          onClick={requestReset}
        >
          {translation.submit}
        </Button>
      </DialogActions>
    </>
  );
};

export default SetPasswordPhase;
