import * as React from "react";
import { TextField, Grid } from "@material-ui/core";
import * as _ from "lodash";

interface DropdownInputProps<T> {
  onChange: (v: T) => void;
  options: T[];
  value: T;
  getOptionLabel: (v: T) => string;
  getOptionKey: (v: T) => string;
  fullWidth: boolean;
  label: string;
}

// tslint:disable-next-line:function-name
export function DropdownInput<T>(props: DropdownInputProps<T>) {
  const {
    onChange,
    options,
    getOptionLabel,
    value,
    getOptionKey,
    fullWidth,
    label
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
    <Grid>
      <TextField
        select
        value={getOptionKey(value)}
        onChange={handleChange}
        fullWidth={fullWidth}
        label={label}
        SelectProps={{ native: true }}
      >
        {options.map(option => (
          <option key={getOptionKey(option)} value={getOptionKey(option)}>
            {getOptionLabel(option)}
          </option>
        ))}
      </TextField>
    </Grid>
  );
}
