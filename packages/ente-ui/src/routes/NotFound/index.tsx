/**
 * EntE
 * (c) 2017-present, Simon Knott <info@simonknott.de>
 *
 * This source code is licensed under the GNU Affero General Public License
 * found in the LICENSE file in the root directory of this source tree.
 */

import * as React from "react";
import { Grid, Typography, WithStyles, withStyles } from "@material-ui/core";
import styles from "./styles";
import withErrorBoundary from "../../components/withErrorBoundary";

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
      <Typography variant="h6">Die Seite wurde nicht gefunden.</Typography>
    </Grid>
  </Grid>
);

export default withStyles(styles)(withErrorBoundary()(NotFound));
