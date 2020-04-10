import * as React from "react";
import { TextField, MenuItem } from "@material-ui/core";
import * as _ from "lodash";
import { InputProps } from "@material-ui/core/Input";

interface DropdownInputProps<T> {
  onChange: (v: T) => void;
  options: T[];
  value: T;
  getOptionLabel: (v: T) => string;
  getOptionKey?: (v: T) => string;
  disableNative?: boolean;
  fullWidth?: boolean;
  label?: string;
  variant?: "standard" | "filled" | "outlined";
  margin?: "dense" | "normal" | "none";
  InputProps?: Partial<InputProps>;
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
    margin,
    disableNative = false,
    InputProps
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
      InputProps={InputProps}
      SelectProps={{ native: !disableNative }}
    >
      {disableNative
        ? options.map(option => (
            <MenuItem key={getOptionKey(option)} value={getOptionKey(option)}>
              {getOptionLabel(option)}
            </MenuItem>
          ))
        : options.map(option => (
            <option key={getOptionKey(option)} value={getOptionKey(option)}>
              {getOptionLabel(option)}
            </option>
          ))}
    </TextField>
  );
}
