import * as React from "react";
import { ExamenPayload } from "ente-types";
import { makeTranslationHook } from "../../helpers/makeTranslationHook";
import { TimeAndDescriptionInput } from "./TimeAndDescriptionReasonInput";

const useTranslation = makeTranslationHook({
  en: {
    class: "Class"
  },
  de: {
    class: "Fach"
  }
});

interface ExamenReasonInputProps {
  onChange: (v: ExamenPayload) => void;
}

export const ExamenReasonInput: React.FC<ExamenReasonInputProps> = props => {
  const translation = useTranslation();

  const { onChange } = props;

  const handleChange = React.useCallback(
    (time: { from: number; to: number }, d: string) => {
      onChange({
        ...time,
        class: d
      });
    },
    [onChange]
  );

  return (
    <TimeAndDescriptionInput
      onChange={handleChange}
      descriptionLabel={translation.class}
    />
  );
};
