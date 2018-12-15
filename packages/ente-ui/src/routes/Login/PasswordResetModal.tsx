import * as React from "react";
import { createTranslation } from "../../helpers/createTranslation";
import { Modal } from "../../elements/Modal";
import { TextField } from "@material-ui/core";
import { isValidUsername } from "ente-types";

const lang = createTranslation({
  en: {
    ok: "Reset Password",
    title: "Reset Password",
    username: "Username",
    description: "Enter your username, we will send you a verification link.",
    inputValidUsername: "Please enter a valid username."
  },
  de: {
    ok: "Passwort Zurücksetzen",
    title: "Passwort Zurücksetzen",
    username: "Benutzername",
    description:
      "Geben sie ihren Benutzernamen ein, wir senden ihnen dann einen Verfizierungs-Link zu.",
    inputValidUsername: "Bitte geben sie einen gültigen Benutzernamen ein."
  }
});

interface PasswordResetModal {
  onClose: () => void;
  onReset: (username: string) => void;
  show: boolean;
}

export const PasswordResetModal: React.FunctionComponent<
  PasswordResetModal
> = React.memo(props => {
  const { onClose, onReset, show } = props;
  const [username, setUsername] = React.useState("");

  return (
    <Modal
      onClose={onClose}
      onOk={() => onReset(username)}
      show={show}
      title={lang.title}
      description={lang.description}
      labels={{ ok: lang.ok }}
    >
      <TextField
        onChange={event => setUsername(event.target.value)}
        value={username}
        fullWidth
        autoFocus
        margin="dense"
        label={lang.username}
        error={!isValidUsername(username)}
        helperText={!isValidUsername(username) && lang.inputValidUsername}
      />
    </Modal>
  );
});
