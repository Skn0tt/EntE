/**
 * EntE
 * (c) 2017-present, Simon Knott <info@simonknott.de>
 *
 * This source code is licensed under the GNU Affero General Public License
 * found in the LICENSE file in the root directory of this source tree.
 */

import * as React from "react";
import { CircularProgress, Grid } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";

const useStyles = makeStyles({
  container: {
    width: "100%",
    height: "100%"
  }
});

/**
 * # Component Types
 */
interface OwnProps {}
type Props = OwnProps;
/**
 * # Component
 */
export const LoadingIndicator: React.SFC<Props> = props => {
  const classes = useStyles(props);

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

export default LoadingIndicator;
