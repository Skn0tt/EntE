import * as React from "react";
import { Grid, Typography, WithStyles, withStyles } from "material-ui";
import styles from "./styles";

/**
 * # Assets
 */
const Diggie = require("../../res/img/Diggie.png");

/**
 * # Component Types
 */
type Props = WithStyles;

/**
 * # Component
 */
export const NotFound: React.SFC<Props> = props => (
  <Grid container alignItems="center" justify="center">
    <Grid item>
      <img src={Diggie} height={400} />
    </Grid>
    <Grid item>
      <Typography variant="title">Die Seite wurde nicht gefunden.</Typography>
    </Grid>
  </Grid>
);

export default withStyles(styles)(NotFound);
