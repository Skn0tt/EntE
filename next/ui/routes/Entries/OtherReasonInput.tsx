import * as React from "react";
import { OtherNonEducationalPayload, OtherEducationalPayload } from "@@types";
import { TextField } from "@material-ui/core";
import { makeTranslationHook } from "../../helpers/makeTranslationHook";

const useTranslation = makeTranslationHook({
  en: {
    label: "Why did you miss class?"
  },
  de: {
    label: "Wieso haben Sie den Unterricht verpasst?"
  }
});

interface OtherReasonInput {
  onChange: (v: OtherEducationalPayload | OtherNonEducationalPayload) => void;
}

export const OtherReasonInput: React.FC<OtherReasonInput> = props => {
  const trans = useTranslation();
  const { onChange } = props;

  const handleDescriptionChange = React.useCallback<
    React.ChangeEventHandler<HTMLInputElement>
  >(
    evt => {
      onChange({
        description: evt.target.value
      });
    },
    [onChange]
  );

  return (
    <TextField
      label={trans.label}
      multiline
      fullWidth
      onChange={handleDescriptionChange}
    />
  );
};
