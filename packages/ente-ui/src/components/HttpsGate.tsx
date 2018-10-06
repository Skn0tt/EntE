import * as React from "react";
import { WithStyles, withStyles, Typography } from "@material-ui/core";
import { Warning as WarningIcon } from "@material-ui/icons";
import styles from "./HttpsGate.styles";

const isSecure = location.protocol === "https:";

interface HttpsGateOwnProps {
  disable?: boolean;
}

type HttpsGateProps = HttpsGateOwnProps & WithStyles;

export const HttpsGate: React.SFC<HttpsGateProps> = props => {
  const { disable = false, children, classes } = props;
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
      <Typography className={classes.text}>
        This connection is not encrypted. Please contact your Administrator.
      </Typography>
    </div>
  );
};

export default withStyles(styles)(HttpsGate);
