import * as React from "react";
import { TextField } from "@material-ui/core";
import * as _ from "lodash";

interface DropdownInputProps<T> {
  onChange: (v: T) => void;
  options: T[];
  value: T;
  getOptionLabel: (v: T) => string;
  getOptionKey?: (v: T) => string;
  fullWidth?: boolean;
  label?: string;
  variant?: "standard" | "filled" | "outlined";
  margin?: "dense" | "normal" | "none";
}

// tslint:disable-next-line:function-name
export function DropdownInput<T>(props: DropdownInputProps<T>) {
  const {
    onChange,
    options,
    getOptionLabel,
    value,
    getOptionKey = (i: T): string => "" + i,
    fullWidth,
    label,
    variant,
    margin
  } = props;

  const lookup = React.useMemo(
    () => {
      return _.keyBy(options, getOptionKey);
    },
    [options, getOptionKey]
  );

  const handleChange = React.useCallback<
    React.ChangeEventHandler<HTMLInputElement>
  >(
    evt => {
      const t = lookup[evt.target.value];
      onChange(t);
    },
    [onChange, lookup]
  );

  return (
    <TextField
      select
      variant={variant as any}
      value={getOptionKey(value)}
      onChange={handleChange}
      fullWidth={fullWidth}
      margin={margin}
      label={label}
      SelectProps={{ native: true }}
    >
      {options.map(option => (
        <option key={getOptionKey(option)} value={getOptionKey(option)}>
          {getOptionLabel(option)}
        </option>
      ))}
    </TextField>
  );
}
