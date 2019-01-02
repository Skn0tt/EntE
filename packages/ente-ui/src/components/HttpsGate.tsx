import * as React from "react";
import WarningIcon from "@material-ui/icons/Warning";
import { makeStyles } from "@material-ui/styles";
import { Typography } from "@material-ui/core";
import { makeTranslationHook } from "../helpers/makeTranslationHook";

const useStyles = makeStyles({
  center: {
    display: "flex",
    height: "100vh",
    alignItems: "center",
    justifyContent: "center"
  },
  text: {
    fontSize: "1.2em"
  }
});

const useTranslation = makeTranslationHook({
  en: "This connection is not encrypted. Please contact your Administrator.",
  de:
    "Diese Verbindung ist nicht verschlüsselt. Bitte kontaktieren Sie ihren Administrator."
});

const isSecure = location.protocol === "https:";

interface HttpsGateOwnProps {
  disable?: boolean;
}

type HttpsGateProps = HttpsGateOwnProps;

export const HttpsGate: React.FC<HttpsGateProps> = props => {
  const classes = useStyles(props);
  const lang = useTranslation();
  const { disable = false, children } = props;
  if (disable || isSecure) {
    return <>{children}</>;
  }

  return (
    <div className={classes.center}>
      <WarningIcon
        color="error"
        viewBox="0 0 24 24"
        style={{ height: "200px", width: "200px" }}
      />
      <Typography className={classes.text}>{lang}</Typography>
    </div>
  );
};
