/**
 * EntE
 * (c) 2017-present, Simon Knott <info@simonknott.de>
 *
 * This source code is licensed under the GNU Affero General Public License
 * found in the LICENSE file in the root directory of this source tree.
 */

import * as React from "react";
import { Grid, Typography, Switch } from "@material-ui/core";

/**
 * # Component Types
 */
interface SwitchInputOwnProps {
  onChange(b: boolean): void;
  value: boolean;
  title: string;
}

type SwitchInputProps = SwitchInputOwnProps;

/**
 * # Component
 */
export const SwitchInput: React.SFC<SwitchInputProps> = props => {
  const { onChange, value, title } = props;

  return (
    <Grid container direction="column">
      <Grid item>
        <Typography variant="h6">{title}</Typography>
      </Grid>
      <Grid item>
        <Switch
          className="updateSwitch"
          checked={value}
          onChange={e => onChange(e.target.checked)}
        />
      </Grid>
    </Grid>
  );
};

export default SwitchInput;
