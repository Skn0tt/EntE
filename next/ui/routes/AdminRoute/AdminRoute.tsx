import * as React from "react";
import { useDispatch } from "react-redux";
import { Button, Theme, Grid, Divider } from "@material-ui/core";
import AttachmentIcon from "@material-ui/icons/Attachment";
import ImportExportIcon from "@material-ui/icons/ImportExport";
import { downloadExcelExportRequest } from "../../redux";
import withErrorBoundary from "../../hocs/withErrorBoundary";
import { makeTranslationHook } from "../../helpers/makeTranslationHook";
import LoginBannerEditor from "./LoginBannerEditor";
import { Languages } from "@@types";
import DefaultLanguageUpdater from "./DefaultLanguageUpdater";
import { Description } from "../../components/Description";
import ParentSignatureExpiryTimeUpdater from "./ParentSignatureExpiryTimeUpdater";
import ParentSignatureNotificationTimeUpdater from "./ParentSignatureNotificationTimeUpdater";
import EntryCreationDaysUpdater from "./EntryCreationDaysUpdater";
import { Link } from "react-router-dom";
import { makeStyles } from "@material-ui/styles";

const useTranslation = makeTranslationHook({
  en: {
    downloadExcel: "Download Excel Export",
    importUsers: "Import Users",
    defaultLanguage: "Default Language",
    defaultLanguageDescription: "New users have this language set",
    entryCreationDeadline: "Entry creation deadline",
    entryCreationDeadlineDescription:
      "Duration after which an entry can not be created anymore (in days).",
    loginBanner: "Login-Banner",
    loginBannerDescription: "This text is shown on the login page.",
    parentSignature: {
      expiry: {
        title: "Signature expiry",
        description:
          "Duration after which an entry is not signable anymore (in days). Set to '0' to disable expiration."
      },
      notification: {
        title: "Signature notification delay",
        description:
          "Duration after which parents receive a notification to sign an entry (in days). Set to '0' to disable."
      }
    }
  },
  de: {
    downloadExcel: "Excel Export downloaden",
    importUsers: "Nutzer importieren",
    defaultLanguage: "Standard-Sprache",
    defaultLanguageDescription:
      "Neue Nutzer haben diese Sprache voreingestellt",
    entryCreationDeadline: "Eintrags-Erstellungs-Frist",
    entryCreationDeadlineDescription:
      "Frist, nach der ein Eintrag nicht mehr erstellt werden kann (in Tagen).",
    loginBanner: "Login-Banner",
    loginBannerDescription: "Dieser Text wird auf der Login-Seite angezeigt.",
    parentSignature: {
      expiry: {
        title: "Auslaufzeit Unterschrift",
        description:
          "Frist, nach der ein Eintrag nicht mehr unterschrieben werden kann (in Tagen). Auf '0' setzen, um zu deaktivieren."
      },
      notification: {
        title: "Erinnerungs-Email Verzögerung",
        description:
          "Zeitdauer, nach der die Eltern eine Erinnerungs-Email erhalten, falls ein Eintrag noch nicht unterschrieben wurde (in Tagen). Auf '0' setzen, um zu deaktivieren."
      }
    }
  }
});

const useStyles = makeStyles((theme: Theme) => ({
  iconLeft: {
    marginRight: theme.spacing.unit
  },
  container: {
    margin: theme.spacing.unit
  }
}));

const AdminRoute = React.memo(props => {
  const classes = useStyles();
  const lang = useTranslation();

  const dispatch = useDispatch();
  const downloadExcelExport = () => dispatch(downloadExcelExportRequest());

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
            <Button variant="outlined" onClick={downloadExcelExport}>
              <AttachmentIcon className={classes.iconLeft} />
              {lang.downloadExcel}
            </Button>
          </Grid>

          <Grid item>
            <Link to="/admin/import">
              <Button variant="outlined">
                <ImportExportIcon className={classes.iconLeft} />
                {lang.importUsers}
              </Button>
            </Link>
          </Grid>
        </Grid>
      </Grid>

      <Grid item xs={10}>
        <Divider variant="fullWidth" />
      </Grid>

      <Grid item>
        <Grid container direction="row" justify="flex-start" spacing={16}>
          <Grid item xs={12} md={5}>
            <Description title={lang.defaultLanguage}>
              {lang.defaultLanguageDescription}
            </Description>
          </Grid>
          <Grid item xs={11} md={5}>
            <DefaultLanguageUpdater />
          </Grid>
        </Grid>
      </Grid>

      <Grid item>
        <Grid container direction="row" justify="flex-start" spacing={16}>
          <Grid item xs={12} md={5}>
            <Description title={lang.entryCreationDeadline}>
              {lang.entryCreationDeadlineDescription}
            </Description>
          </Grid>
          <Grid item xs={11} md={5}>
            <EntryCreationDaysUpdater />
          </Grid>
        </Grid>
      </Grid>

      <Grid item>
        <Grid container direction="row" justify="flex-start" spacing={16}>
          <Grid item xs={12} md={5}>
            <Description title={lang.parentSignature.expiry.title}>
              {lang.parentSignature.expiry.description}
            </Description>
          </Grid>
          <Grid item xs={11} md={5}>
            <ParentSignatureExpiryTimeUpdater />
          </Grid>
        </Grid>
      </Grid>

      <Grid item>
        <Grid container direction="row" justify="flex-start" spacing={16}>
          <Grid item xs={12} md={5}>
            <Description title={lang.parentSignature.notification.title}>
              {lang.parentSignature.notification.description}
            </Description>
          </Grid>
          <Grid item xs={11} md={5}>
            <ParentSignatureNotificationTimeUpdater />
          </Grid>
        </Grid>
      </Grid>

      <Grid item>
        <Grid container direction="column" spacing={16}>
          <Grid item>
            <Description title={lang.loginBanner}>
              {lang.loginBannerDescription}
            </Description>
          </Grid>
          <Grid item>
            <Grid container spacing={16}>
              <Grid item xs={11} md={5}>
                <LoginBannerEditor language={Languages.ENGLISH} />
              </Grid>
              <Grid item xs={11} md={5}>
                <LoginBannerEditor language={Languages.GERMAN} />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
});

export default withErrorBoundary()(AdminRoute);
