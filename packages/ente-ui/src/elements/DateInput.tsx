import * as React from "react";
import { DatePicker } from "material-ui-pickers";

interface DateInputProps {
  value: Date;
  onChange: (d: Date) => void;
  isValid: (d: Date) => boolean;
  minDate?: Date;
  maxDate?: Date;
  label: string;
}

export const DateInput: React.SFC<DateInputProps> = props => {
  const { value, onChange, minDate, maxDate, label, isValid } = props;
  return (
    <DatePicker
      label={label}
      value={value}
      onChange={onChange}
      minDate={minDate}
      maxDate={maxDate}
      autoOk
      error={!isValid(value)}
    />
  );
};
