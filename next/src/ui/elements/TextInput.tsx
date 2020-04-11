/**
 * EntE
 * (c) 2017-present, Simon Knott <info@simonknott.de>
 *
 * This source code is licensed under the GNU Affero General Public License
 * found in the LICENSE file in the root directory of this source tree.
 */

import * as React from "react";
import { Grid, Typography, TextField } from "@material-ui/core";
import * as _ from "lodash";

/**
 * # Component Types
 */
interface TextInputOwnProps {
  validator?: (s: string) => boolean;
  onChange: (s: string) => void;
  title?: string;
  value?: string;
  type?: string;
  label?: string;
  required?: boolean;
}

type Props = TextInputOwnProps;

/**
 * # Component
 */
export const TextInput: React.SFC<Props> = (props) => {
  const { validator, onChange, title, value, type, label, required } = props;

  const [state, setState] = React.useState(value || "");

  React.useEffect(() => {
    if (!_.isUndefined(value) && state !== value) {
      setState(value);
    }
  }, [state === value, setState]);

  const handleChange = React.useCallback<
    React.ChangeEventHandler<HTMLInputElement>
  >(
    (evt) => {
      const { value } = evt.target;
      setState(value);
      !!onChange && onChange(value);
    },
    [setState, onChange]
  );

  return (
    <Grid container direction="column">
      {!!title && (
        <Grid item>
          <Typography variant="h6">{title}</Typography>
        </Grid>
      )}
      <Grid item>
        <TextField
          className="updateInput"
          fullWidth
          type={type}
          error={!!validator && !validator(state)}
          value={_.isUndefined(value) ? state : value}
          label={label}
          required={required}
          onChange={handleChange}
        />
      </Grid>
    </Grid>
  );
};

export default TextInput;
