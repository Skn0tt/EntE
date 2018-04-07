import * as React from "react";
import styles from "./styles";
import { withStyles, CircularProgress, WithStyles, Grid } from "material-ui";

/**
 * # Component Types
 */
interface OwnProps {}
type Props = OwnProps & WithStyles;
/**
 * # Component
 */
export const LoadingIndicator: React.SFC<Props> = props => {
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
