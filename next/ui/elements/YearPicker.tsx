import * as React from "react";
import { TextField } from "@material-ui/core";

const currentYear = new Date().getFullYear();

const nextYears = (amnt: number) =>
  // tslint:disable-next-line:prefer-array-literal
  new Array(amnt).fill(0).map((_, i) => currentYear + i);

interface YearPickerProps {
  onChange: (y: number) => void;
  value: number;
  amount: number;
  label: string;
}

export const YearPicker: React.SFC<YearPickerProps> = props => {
  const { value, onChange, amount, label } = props;

  return (
    <TextField
      select
      label={label}
      value={value}
      fullWidth
      onChange={e => onChange(+e.target.value)}
      SelectProps={{ native: true }}
    >
      {nextYears(amount).map(year => (
        <option key={year} value={year}>
          {"" + year}
        </option>
      ))}
    </TextField>
  );
};
