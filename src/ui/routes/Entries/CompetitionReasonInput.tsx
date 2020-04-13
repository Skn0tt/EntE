import * as React from "react";
import { CompetitionPayload } from "@@types";
import { TimeAndDescriptionInput } from "./TimeAndDescriptionReasonInput";
import { makeTranslationHook } from "../../helpers/makeTranslationHook";

const useTranslation = makeTranslationHook({
  en: {
    name: "Name of competition",
  },
  de: {
    name: "Name des Wettbewerbs",
  },
});

interface CompetitionReasonInputProps {
  onChange: (v: Partial<CompetitionPayload>) => void;
}

export const CompetitionReasonInput: React.FC<CompetitionReasonInputProps> = (
  props
) => {
  const translation = useTranslation();

  const { onChange } = props;

  const handleChange = React.useCallback(
    (time: { from?: number; to?: number }, d: string) => {
      onChange({
        ...time,
        name: d,
      });
    },
    [onChange]
  );

  return (
    <TimeAndDescriptionInput
      onChange={handleChange}
      descriptionLabel={translation.name}
    />
  );
};
