import * as React from "react";
import { DatePicker } from "material-ui-pickers";
import { makeTranslationHook } from "../helpers/makeTranslationHook";
import { format } from "date-fns";

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
  value: string;
  onChange: (d: string) => void;
  isValid?: (d: string) => boolean;
  minDate?: string | number | Date;
  maxDate?: string | number | Date;
  label: string;
  maxDateMessage?: string;
  minDateMessage?: string;
}

export const DateInput: React.FC<DateInputProps> = props => {
  const {
    value,
    onChange,
    minDate,
    maxDate,
    label,
    isValid = () => true,
    maxDateMessage,
    minDateMessage
  } = props;

  const lang = useTranslation();

  const handleOnChange = React.useCallback(
    (d: Date) => {
      const s = format(d, "yyyy-MM-dd");
      onChange(s);
    },
    [onChange]
  );

  return (
    <DatePicker
      label={label}
      value={value}
      onChange={handleOnChange}
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
