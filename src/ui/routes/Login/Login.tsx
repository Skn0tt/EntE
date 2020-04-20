/**
 * EntE
 * (c) 2017-present, Simon Knott <info@simonknott.de>
 *
 * This source code is licensed under the GNU Affero General Public License
 * found in the LICENSE file in the root directory of this source tree.
 */

import * as React from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  TextField,
  Grid,
  Typography,
  Theme,
} from "@material-ui/core";
import { getCurrentLoginBanner, getLanguage, loginSuccess } from "../../redux";
import { withErrorBoundary } from "../../hocs/withErrorBoundary";
import { PasswordResetModal } from "./PasswordResetModal";
import * as querystring from "query-string";
import * as config from "../../config";
import { makeStyles } from "@material-ui/styles";
import { invokeReset } from "../../passwordReset";
import { useMessages } from "../../context/Messages";
import { useRouter } from "next/router";
import { ResponsiveFullscreenDialog } from "../../components/ResponsiveFullscreenDialog";
import { makeTranslationHook } from "../../helpers/makeTranslationHook";
import { useBoolean } from "react-use";
import { LoginAPI } from "../../login.api";

const useStyles = makeStyles((theme: Theme) => ({
  versionCode: {
    bottom: 0,
    left: 0,
    margin: theme.spacing.unit,
    position: "absolute",
  },
}));

const lang = {
  en: {
    title: "Login",
    submit: "Login",
    username: "Username",
    password: "Password",
    passwordForgot: "Forgot Password?",
    defaultBanner: "In order to use EntE, log in.",
    invalidCredentials: "Login failed: Invalid credentials",
  },
  de: {
    title: "Anmelden",
    submit: "Anmelden",
    username: "Benutzername",
    password: "Passwort",
    passwordForgot: "Passwort Vergessen?",
    defaultBanner: "Bitte melden Sie sich an, um EntE zu nutzen.",
    invalidCredentials: "Anmeldung fehlgeschlagen: Falsche Anmeldedaten",
  },
};

const useTranslation = makeTranslationHook(lang);

function getInitalUsername() {
  const { username = "" } = querystring.parse(location.search);
  return username as string;
}

function Login(prosp: {}) {
  const lang = useTranslation();
  const router = useRouter();
  const classes = useStyles();
  const { addMessages } = useMessages();

  const dispatch = useDispatch();
  const currentLanguage = useSelector(getLanguage);
  const loginBanner = useSelector(getCurrentLoginBanner);

  const [username, setUsername] = React.useState(getInitalUsername());
  const [password, setPassword] = React.useState("");
  const [showPasswordReset, togglePasswordReset] = useBoolean(false);

  const [passwordResetPending, setPasswordResetPending] = useBoolean(false);
  const [loginPending, setLoginPending] = useBoolean(false);

  const handleResetPassword = React.useCallback(
    async (username: string) => {
      togglePasswordReset(false);
      setPasswordResetPending(true);
      await invokeReset(username, (msg) => addMessages(msg[currentLanguage]));
      setPasswordResetPending(false);
    },
    [togglePasswordReset, setPasswordResetPending, currentLanguage]
  );

  const handleSignIn = React.useCallback(async () => {
    setLoginPending(true);
    const response = await LoginAPI.login({ username, password });
    setLoginPending(false);

    response.cata(
      () => {
        setPassword("");
        addMessages(lang.invalidCredentials);
      },
      (response) => {
        dispatch(loginSuccess(response));

        const from = (router.query.from as string) ?? "/";
        router.push(from);
      }
    );
  }, [
    dispatch,
    username,
    password,
    setPassword,
    router,
    setLoginPending,
    addMessages,
    lang,
  ]);

  const handleKeyPress: React.KeyboardEventHandler<{}> = React.useCallback(
    (event) => {
      if (event.key === "Enter") {
        handleSignIn();
      }
    },
    [handleSignIn]
  );

  return (
    <>
      <PasswordResetModal
        onReset={handleResetPassword}
        show={showPasswordReset}
        onClose={togglePasswordReset}
      />
      <ResponsiveFullscreenDialog open onKeyPress={handleKeyPress}>
        <DialogTitle>{lang.title}</DialogTitle>
        <DialogContent>
          <DialogContentText
            dangerouslySetInnerHTML={{
              __html: loginBanner
                .orSome(lang.defaultBanner)
                .replace(/(?:\r\n|\r|\n)/g, "<br />"),
            }}
          />
          <Grid container direction="column">
            <Grid item>
              <TextField
                fullWidth
                id="name"
                label={lang.username}
                autoComplete="username"
                onChange={(evt) => setUsername(evt.target.value)}
                value={username}
              />
            </Grid>

            <Grid item>
              <TextField
                fullWidth
                id="password"
                label={lang.password}
                type="password"
                autoComplete="current-password"
                onChange={(evt) => setPassword(evt.target.value)}
                value={password}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={togglePasswordReset} disabled={passwordResetPending}>
            {lang.passwordForgot}
          </Button>
          <Button
            color="primary"
            onClick={handleSignIn}
            disabled={loginPending}
          >
            {lang.submit}
          </Button>
        </DialogActions>
      </ResponsiveFullscreenDialog>

      <Typography color="default" className={classes.versionCode}>
        v{config.get().VERSION}
      </Typography>
    </>
  );
}

export default withErrorBoundary()(Login);
