import * as React from "react";
import { makeTranslationHook } from "../helpers/makeTranslationHook";
import { PasswordRequirementsHint } from "../elements/PasswordRequirementsHint";
import { Grid, TextField, Typography } from "@material-ui/core";
import { isValidPassword } from "ente-types";

const useTranslation = makeTranslationHook({
  en: {
    password: "Password",
    verification: "Enter again",
    passwordSpecs: PasswordRequirementsHint.en
  },
  de: {
    password: "Passwort",
    verification: "Passwort erneut eingeben",
    passwordSpecs: PasswordRequirementsHint.de
  }
});

interface SetPasswordFormOwnProps {
  onValidPassword: (p: string) => void;
}

export const SetPasswordForm: React.FC<SetPasswordFormOwnProps> = props => {
  const { onValidPassword } = props;
  const translation = useTranslation();

  const [password, setPassword] = React.useState("");
  const [verification, setVerification] = React.useState("");

  React.useEffect(
    () => {
      if (password === verification && isValidPassword(password)) {
        onValidPassword(password);
      }
    },
    [password, verification]
  );

  const handleChangePassword = React.useCallback<
    React.ChangeEventHandler<HTMLInputElement>
  >(
    evt => {
      setPassword(evt.target.value);
    },
    [setPassword]
  );

  const handleChangeVerification = React.useCallback<
    React.ChangeEventHandler<HTMLInputElement>
  >(
    evt => {
      setVerification(evt.target.value);
    },
    [setVerification]
  );

  return (
    <Grid container direction="column">
      <Grid item>
        <TextField
          fullWidth
          id="password"
          label={translation.password}
          type="password"
          error={!isValidPassword(password)}
          onChange={handleChangePassword}
        />
      </Grid>
      <Typography variant="body1">
        <translation.passwordSpecs />
      </Typography>
      <Grid item>
        <TextField
          fullWidth
          id="verification"
          type="password"
          label={translation.verification}
          error={password !== verification}
          onChange={handleChangeVerification}
        />
      </Grid>
    </Grid>
  );
};
