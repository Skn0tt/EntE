import * as React from "react";
import DateFnsUtils from "@date-io/date-fns";
import { useLocalization } from "../helpers/use-localized-date-format";
import { MuiPickersUtilsProvider } from "material-ui-pickers";

export const LocalizedMUIPickersUtilsProvider: React.FC<{}> = ({
  children,
}) => {
  const locale = useLocalization();

  return (
    <MuiPickersUtilsProvider utils={DateFnsUtils} locale={locale}>
      {children}
    </MuiPickersUtilsProvider>
  );
};
