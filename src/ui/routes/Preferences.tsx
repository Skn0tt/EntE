import {
  Grid,
  Theme,
  Button,
  Divider,
  TextField,
  MenuItem,
  Switch,
  FormControlLabel,
} from "@material-ui/core";
import { Description } from "ui/components/Description";
import { makeStyles } from "@material-ui/styles";
import { makeTranslationHook } from "ui/helpers/makeTranslationHook";
import { useCallback } from "react";
import VpnKeyIcon from "@material-ui/icons/VpnKey";
import { Languages } from "@@types";

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
    weeklySummarySubscription: "Wöchentliche Zusammenfassungs-Mail",
    weeklySummarySubscriptionDescription:
      "Einmal in der Woche sendet EntE ihnen eine Zusammenfassung der Fehlstunden per E-Mail. Möchten Sie diese erhalten?",
    on: "An",
    off: "Aus",
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
    weeklySummarySubscription: "Weekly summary mail",
    weeklySummarySubscriptionDescription:
      "Once a week, EntE sends a summary of missed classes via email. Do you want to receive them?",
    on: "On",
    off: "Off",
  },
});

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

  const currentLanguage = Languages.ENGLISH;

  const handleResetPassword = useCallback(() => {}, []);

  const handleChangeLanguage = useCallback((lang: Languages) => {}, []);

  const isTeacher = true;

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
            <Button variant="outlined" onClick={handleResetPassword}>
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
          onChange={(evt) =>
            handleChangeLanguage(evt.target.value as Languages)
          }
          fullWidth
          variant="outlined"
        >
          <MenuItem value={Languages.GERMAN}>{lang.german}</MenuItem>
          <MenuItem value={Languages.ENGLISH}>{lang.english}</MenuItem>
        </TextField>
      </PreferenceItem>

      <PreferenceItem title={lang.appearance}>
        <TextField select fullWidth variant="outlined">
          <MenuItem value="system">{lang.system}</MenuItem>
          <MenuItem value="light">{lang.light}</MenuItem>
          <MenuItem value="dark">{lang.dark}</MenuItem>
        </TextField>
      </PreferenceItem>

      {isTeacher && (
        <PreferenceItem
          title={lang.weeklySummarySubscription}
          description={lang.weeklySummarySubscriptionDescription}
        >
          <FormControlLabel
            control={<Switch />}
            label={true ? lang.on : lang.off}
          />
        </PreferenceItem>
      )}
    </Grid>
  );
}
