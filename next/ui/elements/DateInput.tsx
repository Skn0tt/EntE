import * as React from "react";
import { DatePicker } from "material-ui-pickers";
import { makeTranslationHook } from "../helpers/makeTranslationHook";
import { isBefore, isAfter, parseISO } from "date-fns";
import { dateToIsoString } from "@@types";

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
  minDate?: string;
  maxDate?: string;
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
    (d: Date | number) => {
      const s = dateToIsoString(d);
      onChange(s);
    },
    [onChange]
  );

  const dateIsNotBeforeMinDate =
    !minDate || !isBefore(parseISO(value), parseISO(minDate));
  const dateIsNotAfterMaxDate =
    !maxDate || !isAfter(parseISO(value), parseISO(maxDate));

  React.useEffect(
    () => {
      if (!dateIsNotBeforeMinDate) {
        handleOnChange(parseISO(minDate!));
        return;
      }

      if (!dateIsNotAfterMaxDate) {
        handleOnChange(parseISO(maxDate!));
        return;
      }
    },
    [
      dateIsNotBeforeMinDate,
      dateIsNotAfterMaxDate,
      handleOnChange,
      minDate,
      maxDate
    ]
  );

  const valueIsValid =
    dateIsNotBeforeMinDate && dateIsNotAfterMaxDate && isValid(value);

  return (
    <DatePicker
      label={label}
      value={value}
      onChange={handleOnChange}
      minDate={minDate}
      maxDate={maxDate}
      autoOk
      fullWidth
      error={!valueIsValid}
      minDateMessage={minDateMessage || lang.minDateMessage}
      maxDateMessage={maxDateMessage || lang.maxDateMessage}
    />
  );
};
