import * as React from "react";
import { Grid } from "@material-ui/core";
import { makeTranslationHook } from "../helpers/makeTranslationHook";
import { useFromToInput } from "../helpers/use-from-to-input";
import { NumberInput } from "./NumberInput";

const useTranslation = makeTranslationHook({
  en: {
    from: "From",
    to: "To"
  },
  de: {
    from: "Von",
    to: "Bis"
  }
});

interface FromToInputProps {
  onChange: (v: { from?: number; to?: number }) => void;
}

export const HourFromToInput: React.FC<FromToInputProps> = props => {
  const { onChange } = props;

  const translation = useTranslation();
  const { from, to, setFrom, setTo } = useFromToInput(1, 2);

  React.useEffect(
    () => {
      onChange({ from, to });
    },
    [from, to]
  );

  return (
    <Grid container direction="row" spacing={8}>
      <Grid item xs={6}>
        <NumberInput label={translation.from} onChange={setFrom} value={from} />
      </Grid>

      <Grid item xs={6}>
        <NumberInput label={translation.to} onChange={setTo} value={to} />
      </Grid>
    </Grid>
  );
};
