import * as React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button
} from "@material-ui/core";

interface DeleteModalProps {
  show: boolean;
  onDelete: () => void;
  onClose: () => void;
  text: string;
}

export const DeleteModal: React.SFC<DeleteModalProps> = props => {
  const { show, onDelete, onClose, text } = props;

  return (
    <Dialog
      open={show}
      onClose={onClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">{"Löschen?"}</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          {text}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary" autoFocus>
          Abbrechen
        </Button>
        <Button onClick={onDelete} color="secondary">
          Löschen
        </Button>
      </DialogActions>
    </Dialog>
  );
};
