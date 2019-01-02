import * as React from "react";
import { TextField } from "@material-ui/core";
import * as _ from "lodash";

interface NumberInputProps {
  value?: number;
  onChange: (v: number) => void;
  label?: string;
  isValid?: (n: number) => boolean;
}

export const NumberInput: React.FC<NumberInputProps> = props => {
  const { value, onChange, label, isValid } = props;

  const [state, setState] = React.useState<number>(value || 0);

  React.useEffect(
    () => {
      if (!_.isUndefined(value) && value !== state) {
        setState(value);
      }
    },
    [value === state, setState]
  );

  const handleChange = React.useCallback<
    React.ChangeEventHandler<HTMLInputElement>
  >(
    evt => {
      const n = +evt.target.value;
      setState(n);
      !!onChange && onChange(n);
    },
    [setState, onChange]
  );

  return (
    <TextField
      label={label}
      fullWidth
      value={_.isUndefined(value) ? state : value}
      onChange={handleChange}
      type="number"
      error={!!isValid && !isValid(state)}
      InputLabelProps={{
        shrink: true
      }}
    />
  );
};
