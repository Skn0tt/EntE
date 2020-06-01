import {
  Grid,
  Theme,
  Button,
  Divider,
  TextField,
  MenuItem,
  Switch,
  FormControlLabel,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
} from "@material-ui/core";
import { Description } from "ui/components/Description";
import { makeStyles } from "@material-ui/styles";
import { makeTranslationHook } from "ui/helpers/makeTranslationHook";
import VpnKeyIcon from "@material-ui/icons/VpnKey";
import { Languages, TEACHING_ROLES } from "@@types";
import { useSelector, useDispatch } from "react-redux";
import {
  getLanguage,
  getRole,
  setLanguage,
  setColorScheme,
  getColorScheme,
  getUsername,
  isSubscribedToWeeklySummary,
  getOwnUserId,
  updateUserRequest,
  getToken,
} from "ui/redux";
import { ColorScheme } from "ui/theme";
import { useMessages } from "ui/context/Messages";
import { invokeReset } from "ui/passwordReset";
import { useCallback, useState } from "react";
import Axios from "axios";
import { useBoolean, useEffectOnce } from "react-use";
import { ResponsiveFullscreenDialog } from "ui/components/ResponsiveFullscreenDialog";
import { QRCode } from "ui/components/QRCode";
import * as config from "ui/config";

function useLatestEntEVersion() {
  const [version, setVersion] = useState<string>();

  useEffectOnce(() => {
    async function doIt() {
      const resp = await Axios.get<{ version: string }>(
        "https://gitlab.com/api/v4/projects/5030367/repository/files/package.json/raw",
        { params: { ref: "master" } }
      );
      const { version } = resp.data;
      setVersion(version);
    }

    doIt().catch(console.error);
  });

  return version;
}

const useLang = makeTranslationHook({
  de: {
    language: "Sprache",
    resetPassword: "Passwort ändern",
    german: "Deutsch",
    english: "Englisch",
    appearance: "Erscheinungsbild",
    system: "Systemeinstellung",
    dark: "Dunkel",
    light: "Hell",
    twoFa: "Zwei-Faktor-Authentifizierung",
    twoFaDescription:
      "Mit der Zwei-Faktor-Authentifizierung können Sie ihren Account zusätzlich schützen. Dafür benötigen Sie eine Authenticator-App auf ihrem Smartphone, z.B. Google Authenticator.",
    weeklySummarySubscription: "Wöchentliche Zusammenfassungs-Mail",
    weeklySummarySubscriptionDescription:
      "Einmal in der Woche sendet EntE ihnen eine Zusammenfassung der Fehlstunden per E-Mail. Möchten Sie diese erhalten?",
    on: "An",
    off: "Aus",
    installedVersion: "EntE-Version",
    latestEntEVersion: (v: string) => `Neueste Version: v${v}`,
    authenticator: {
      title: "Authenticator einrichten",
      description:
        "Um ihren Authenticator einzurichten, scannen Sie diesen QR-Code.",
      manual: (key: string) => `Für manuelle Eingabe: ${key}; Zeitbasiert.`,
      done: "OK",
    },
  },
  en: {
    language: "Language",
    resetPassword: "Change Password",
    german: "German",
    english: "English",
    appearance: "Appearance",
    system: "System preference",
    dark: "Dark",
    light: "Light",
    twoFa: "Two-Factor-Authentication",
    twoFaDescription:
      "Enabling Two-Factor-Authentification provides additional security measures to your account. To use it, an authenticator app is required (e.g. Google Authenticator).",
    weeklySummarySubscription: "Weekly summary mail",
    weeklySummarySubscriptionDescription:
      "Once a week, EntE sends a summary of missed classes via email. Do you want to receive them?",
    on: "On",
    off: "Off",
    installedVersion: "EntE Version",
    latestEntEVersion: (v: string) => `Latest version: v${v}`,
    authenticator: {
      title: "Setup Authenticator",
      description: "To setup your Authenticator, scan this QR code.",
      manual: (key: string) => `For manual setup, use: ${key}; Time-based.`,
      done: "OK",
    },
  },
});

async function get2FAState(token: string): Promise<boolean> {
  const response = await Axios.get<"enabled" | "disabled">("/api/2fa", {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data === "enabled";
}

async function enable2FA(token: string): Promise<string> {
  const response = await Axios.post<string>("/api/2fa/enable", undefined, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
}

async function disable2FA(token: string): Promise<void> {
  await Axios.post<string>("/api/2fa/disable", undefined, {
    headers: { Authorization: `Bearer ${token}` },
  });
}

const useStyles = makeStyles((theme: Theme) => ({
  iconLeft: {
    marginRight: theme.spacing.unit,
  },
  container: {
    margin: theme.spacing.unit,
  },
}));

interface PreferenceItemProps {
  title: string;
  description?: string;
}

function PreferenceItem(props: React.PropsWithChildren<PreferenceItemProps>) {
  const { title, description, children } = props;

  return (
    <Grid item>
      <Grid container direction="row" justify="flex-start" spacing={16}>
        <Grid item xs={12} md={5}>
          <Description title={title}>{description}</Description>
        </Grid>
        <Grid item xs={11} md={5}>
          {children}
        </Grid>
      </Grid>
    </Grid>
  );
}

export function Preferences() {
  const classes = useStyles();
  const lang = useLang();
  const { addMessages } = useMessages();
  const latestEntEVersion = useLatestEntEVersion();

  const dispatch = useDispatch();
  const currentLanguage = useSelector(getLanguage);
  const colorScheme = useSelector(getColorScheme);
  const ownRole = useSelector(getRole).some();
  const ownUsername = useSelector(getUsername).some();
  const ownId = useSelector(getOwnUserId).some();
  const token = useSelector(getToken).some();
  const weeklySummarySubscribed = useSelector(
    isSubscribedToWeeklySummary
  ).orSome(true);

  const isTeacher = TEACHING_ROLES.includes(ownRole);

  const [twoFAEnabled, set2FAEnabled] = useBoolean(false);
  const [twoFAOTPUrl, set2FAOTPUrl] = useState<string>();

  useEffectOnce(() => {
    get2FAState(token).then(set2FAEnabled);
  });

  const handleTwoFAEnabling = useCallback(async () => {
    const url = await enable2FA(token);
    set2FAOTPUrl(url);
    set2FAEnabled(true);
  }, [token, set2FAEnabled, set2FAOTPUrl]);

  const handleTwoFADisabling = useCallback(async () => {
    await disable2FA(token);
    set2FAEnabled(false);
  }, [token, set2FAEnabled]);

  return (
    <Grid
      container
      direction="column"
      spacing={24}
      className={classes.container}
    >
      <Grid item>
        <Grid container direction="row">
          <Grid item>
            <Button
              variant="outlined"
              onClick={() => {
                invokeReset(ownUsername, (msgs) =>
                  addMessages(msgs[currentLanguage])
                );
              }}
            >
              <VpnKeyIcon className={classes.iconLeft} />
              {lang.resetPassword}
            </Button>
          </Grid>
        </Grid>
      </Grid>

      <Grid item xs={10}>
        <Divider variant="fullWidth" />
      </Grid>

      <PreferenceItem title={lang.language}>
        <TextField
          select
          value={currentLanguage}
          onChange={(evt) => {
            dispatch(setLanguage(evt.target.value as Languages));
          }}
          fullWidth
          variant="outlined"
        >
          <MenuItem value={Languages.GERMAN}>{lang.german}</MenuItem>
          <MenuItem value={Languages.ENGLISH}>{lang.english}</MenuItem>
        </TextField>
      </PreferenceItem>

      <PreferenceItem title={lang.appearance}>
        <TextField
          value={colorScheme}
          onChange={(evt) => {
            dispatch(setColorScheme(evt.target.value as ColorScheme));
          }}
          select
          fullWidth
          variant="outlined"
        >
          <MenuItem value="system">{lang.system}</MenuItem>
          <MenuItem value="light">{lang.light}</MenuItem>
          <MenuItem value="dark">{lang.dark}</MenuItem>
        </TextField>
      </PreferenceItem>

      <ResponsiveFullscreenDialog
        open={!!twoFAOTPUrl}
        onClose={() => set2FAOTPUrl(undefined)}
      >
        <DialogTitle>{lang.authenticator.title}</DialogTitle>
        <DialogContent>
          <Typography>{lang.authenticator.description}</Typography>

          <QRCode url={twoFAOTPUrl ?? "my_random_text"} />

          <Typography>
            {lang.authenticator.manual(twoFAOTPUrl?.split("=")[1] ?? "")}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button color="primary" onClick={() => set2FAOTPUrl(undefined)}>
            {lang.authenticator.done}
          </Button>
        </DialogActions>
      </ResponsiveFullscreenDialog>

      <PreferenceItem title={lang.twoFa} description={lang.twoFaDescription}>
        <FormControlLabel
          control={
            <Switch
              checked={twoFAEnabled}
              onChange={(_, newValue) => {
                if (newValue) {
                  handleTwoFAEnabling();
                } else {
                  handleTwoFADisabling();
                }
              }}
            />
          }
          label={twoFAEnabled ? lang.on : lang.off}
        />
      </PreferenceItem>

      {isTeacher && (
        <PreferenceItem
          title={lang.weeklySummarySubscription}
          description={lang.weeklySummarySubscriptionDescription}
        >
          <FormControlLabel
            control={
              <Switch
                checked={weeklySummarySubscribed}
                onChange={(_, newValue) => {
                  dispatch(
                    updateUserRequest([
                      ownId,
                      { subscribedToWeeklySummary: newValue },
                    ])
                  );
                }}
              />
            }
            label={weeklySummarySubscribed ? lang.on : lang.off}
          />
        </PreferenceItem>
      )}

      <PreferenceItem
        title={lang.installedVersion}
        description={
          !!latestEntEVersion
            ? lang.latestEntEVersion(latestEntEVersion)
            : undefined
        }
      >
        <Typography>v{config.get().VERSION}</Typography>
      </PreferenceItem>
    </Grid>
  );
}
