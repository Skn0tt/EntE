import * as React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button
} from "@material-ui/core";
import { makeTranslationHook } from "../../helpers/makeTranslationHook";

const useTranslation = makeTranslationHook({
  en: {
    ok: "OK",
    cancel: "Cancel",
    title: "Confirm",
    description: "Are you sure you want to delete this missed class?"
  },
  de: {
    ok: "OK",
    cancel: "Abbrechen",
    title: "Sind Sie sich sicher?",
    description: "Möchten Sie diese Fehlstunde wirklich löschen?"
  }
});

interface DeleteSlotDialogProps {
  open: boolean;
  onClose: (confirmed: boolean) => void;
}

export const DeleteSlotDialog = (props: DeleteSlotDialogProps) => {
  const { open, onClose } = props;

  const translation = useTranslation();

  return (
    <Dialog open={open} onClose={() => onClose(false)}>
      <DialogTitle>{translation.title}</DialogTitle>
      <DialogContent>
        <DialogContentText>{translation.description}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => onClose(false)} color="primary" autoFocus>
          {translation.cancel}
        </Button>
        <Button onClick={() => onClose(true)} color="secondary">
          {translation.ok}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
