import * as React from "react";
import { FormControlLabel, Checkbox } from "@material-ui/core";

interface CheckboxInputProps {
  label?: string;
  onChange: (v: boolean) => void;
  value: boolean;
}

export const CheckboxInput: React.FC<CheckboxInputProps> = props => {
  const { onChange, label, value } = props;
  const handleChange = React.useCallback(
    (_, b) => {
      onChange(b);
    },
    [onChange]
  );

  return (
    <FormControlLabel
      control={<Checkbox checked={value} onChange={handleChange} />}
      label={label}
    />
  );
};
