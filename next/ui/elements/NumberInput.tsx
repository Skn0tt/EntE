import * as React from "react";
import { TextField } from "@material-ui/core";
import * as _ from "lodash";

interface NumberInputProps {
  value?: number;
  onChange: (v?: number) => void;
  label?: string;
  isValid?: (n: number) => boolean;
}

export const NumberInput: React.FC<NumberInputProps> = props => {
  const { value, onChange, label, isValid } = props;

  const [state, setState] = React.useState<number | undefined>(0);

  const handleChange = React.useCallback<
    React.ChangeEventHandler<HTMLInputElement>
  >(
    evt => {
      const { value } = evt.target;
      const n = value === "" ? undefined : +value;
      setState(n);
      if (!!onChange) {
        onChange(n);
      }
    },
    [setState, onChange]
  );

  React.useEffect(
    () => {
      if (state !== value) {
        setState(value);
      }
    },
    [state !== value, setState]
  );

  const showError = (() => {
    if (!isValid) {
      return false;
    }

    if (_.isUndefined(state)) {
      return true;
    }

    return !isValid(state);
  })();

  return (
    <TextField
      label={label}
      fullWidth
      value={state}
      onChange={handleChange}
      type="number"
      error={showError}
      InputLabelProps={{
        shrink: true
      }}
    />
  );
};
