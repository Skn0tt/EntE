import * as React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from "@material-ui/core";
import { makeTranslationHook } from "../helpers/makeTranslationHook";

const useTranslation = makeTranslationHook({
  en: {
    title: "Delete?",
    abort: "Abort",
    submit: "Delete",
  },
  de: {
    title: "Löschen?",
    abort: "Abbrechen",
    submit: "Löschen",
  },
});

interface DeleteModalProps {
  show: boolean;
  onDelete: () => void;
  onClose: () => void;
  text: string;
}

export const DeleteModal: React.SFC<DeleteModalProps> = (props) => {
  const { show, onDelete, onClose, text } = props;
  const translation = useTranslation();

  return (
    <Dialog
      open={show}
      onClose={onClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">{translation.title}</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          {text}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary" autoFocus>
          {translation.abort}
        </Button>
        <Button onClick={onDelete} color="secondary">
          {translation.submit}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
