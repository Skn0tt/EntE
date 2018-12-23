import * as React from "react";
import { DatePicker } from "material-ui-pickers";
import { makeTranslationHook } from "../helpers/makeTranslationHook";

const useTranslation = makeTranslationHook({
  en: {
    minDateMessage: "Date should be after minimal date",
    maxDateMessage: "Date should be before maximal date"
  },
  de: {
    minDateMessage: "Datum sollte nach Mindest-Datum liegen",
    maxDateMessage: "Datum sollte bevor Maximal-Datum liegen"
  }
});

interface DateInputProps {
  value: Date;
  onChange: (d: Date) => void;
  isValid: (d: Date) => boolean;
  minDate?: Date;
  maxDate?: Date;
  label: string;
  maxDateMessage?: string;
  minDateMessage?: string;
}

export const DateInput: React.SFC<DateInputProps> = props => {
  const {
    value,
    onChange,
    minDate,
    maxDate,
    label,
    isValid,
    maxDateMessage,
    minDateMessage
  } = props;

  const lang = useTranslation();

  return (
    <DatePicker
      label={label}
      value={value}
      onChange={d => onChange(d.toJSDate())}
      minDate={minDate}
      maxDate={maxDate}
      autoOk
      fullWidth
      error={!isValid(value)}
      minDateMessage={minDateMessage || lang.minDateMessage}
      maxDateMessage={maxDateMessage || lang.maxDateMessage}
    />
  );
};
