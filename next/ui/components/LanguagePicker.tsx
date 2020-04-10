import * as React from "react";
import { Languages } from "@@types";
import { Modal } from "../elements/Modal";
import { Select, MenuItem, TextField } from "@material-ui/core";
import { makeTranslationHook } from "../helpers/makeTranslationHook";

const useTranslation = makeTranslationHook({
  en: {
    title: "Choose Language",
    german: "German",
    english: "English"
  },
  de: {
    title: "Sprache wählen",
    german: "Deutsch",
    english: "Englisch"
  }
});

interface LanguagePickerProps {
  value: Languages;
  onChange: (v: Languages) => void;
  show: boolean;
  onClose: () => void;
}

export const LanguagePicker: React.FunctionComponent<
  LanguagePickerProps
> = props => {
  const { value, onChange, show, onClose } = props;
  const translation = useTranslation();

  return (
    <Modal
      show={show}
      title={translation.title}
      onClose={onClose}
      onOk={onClose}
    >
      <TextField
        select
        value={value}
        onChange={evt => onChange(evt.target.value as Languages)}
        fullWidth
        variant="outlined"
      >
        <MenuItem value={Languages.GERMAN}>{translation.german}</MenuItem>
        <MenuItem value={Languages.ENGLISH}>{translation.english}</MenuItem>
      </TextField>
    </Modal>
  );
};
