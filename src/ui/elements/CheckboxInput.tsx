import * as React from "react";
import { FormControlLabel, Checkbox } from "@material-ui/core";
import * as _ from "lodash";

interface CheckboxInputProps {
  label?: string;
  onChange: (v: boolean) => void;
  value?: boolean;
}

export const CheckboxInput: React.FC<CheckboxInputProps> = (props) => {
  const { onChange, label, value } = props;

  const [state, setState] = React.useState(value || false);

  const handleChange = React.useCallback(
    (_, b) => {
      onChange(b);
      setState(b);
    },
    [onChange]
  );

  return (
    <FormControlLabel
      control={
        <Checkbox
          checked={_.isUndefined(value) ? state : value}
          onChange={handleChange}
        />
      }
      label={label}
    />
  );
};
