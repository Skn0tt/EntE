import * as React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button
} from "@material-ui/core";
import { makeTranslationHook } from "../helpers/makeTranslationHook";

const useTranslation = makeTranslationHook({
  en: {
    ok: "OK",
    cancel: "Cancel"
  },
  de: {
    ok: "OK",
    cancel: "Abbrechen"
  }
});

interface Modal {
  onClose: () => void;
  onOk: () => void;
  show: boolean;
  title: string;
  labels?: {
    ok?: string;
    cancel?: string;
  };
  description?: string;
}

export const Modal: React.SFC<Modal> = React.memo(props => {
  const {
    onClose,
    onOk,
    show,
    children,
    title,
    labels = {},
    description
  } = props;
  const lang = useTranslation();

  return (
    <Dialog open={show} onClose={onClose}>
      <DialogTitle id="form-dialog-title">{title}</DialogTitle>
      <DialogContent>
        {!!description && <DialogContentText>{description}</DialogContentText>}
        {children}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">
          {labels.cancel || lang.cancel}
        </Button>
        <Button onClick={onOk} color="primary">
          {labels.ok || lang.ok}
        </Button>
      </DialogActions>
    </Dialog>
  );
});
