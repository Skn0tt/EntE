import * as React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button
} from "@material-ui/core";
import { useHistory } from "react-router-dom";

const { useCallback } = React;

const CreatePrefiledSlots = props => {
  const history = useHistory();

  const handleCreate = useCallback(() => {}, []);

  const isValidInput = false; // TODO:

  return (
    <Dialog onClose={history.goBack} open>
      <DialogTitle>TITLE TODO:</DialogTitle>

      <DialogContent />

      <DialogActions>
        <Button onClick={history.goBack} color="secondary">
          CANCEL TODO:
        </Button>
        <Button
          onClick={() => {
            handleCreate();
            history.goBack();
          }}
          disabled={!isValidInput}
          color="primary"
        >
          OK TODO:
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreatePrefiledSlots;
