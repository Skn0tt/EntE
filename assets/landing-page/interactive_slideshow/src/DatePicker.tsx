import * as React from "react";
import {
  DatePicker as MUIDatePicker,
  MuiPickersUtilsProvider
} from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import deLocale from "date-fns/locale/de";
import { subDays } from "date-fns";
import { useFullscreenContainer } from "./FullScreen";

interface DatePickerProps {
  onPick: (d: Date) => void;
  enabled: boolean;
  showLabel: boolean;
}

const threeDaysAgo = subDays(Date.now(), 2);

export const DatePicker = React.forwardRef((props: DatePickerProps, ref) => {
  const { onPick, enabled, showLabel } = props;
  const [value, setValue] = React.useState<Date>(null);
  const container = useFullscreenContainer();

  return (
    <MuiPickersUtilsProvider utils={DateFnsUtils} locale={deLocale}>
      <MUIDatePicker
        PopoverProps={{ container }}
        innerRef={ref}
        fullWidth
        autoOk
        disabled={!enabled}
        disableFuture
        minDate={threeDaysAgo}
        variant="inline"
        label={showLabel ? "Datum" : undefined}
        size="small"
        format="dd. MMMM"
        value={value}
        onChange={date => {
          setValue(date);
          onPick(date);
        }}
      />
    </MuiPickersUtilsProvider>
  );
});
