import * as React from "react";
import styles from "./styles";
import { withStyles, CircularProgress, WithStyles, Grid } from "material-ui";

/**
 * # Component
 */
const LoadingIndicator: React.SFC<WithStyles> = props => {
  const { classes } = props;

  return (
    <Grid
      container
      alignItems="center"
      justify="center"
      className={classes.container}
    >
      <Grid item>
        <CircularProgress />
      </Grid>
    </Grid>
  );
};

export default withStyles(styles)(LoadingIndicator);
