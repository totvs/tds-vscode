import * as React from "react";
import DialogTitle from "@material-ui/core/DialogTitle";
import Dialog from "@material-ui/core/Dialog";
import {
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from "@material-ui/core";
import Alert from "@material-ui/lab/Alert";
import { i18n } from "../helper";

export interface UnlockServerDialogProps {
  open: boolean;
  onClose: (confirmed: boolean) => void;
}

export default function UnlockServerDialog(props: UnlockServerDialogProps) {
  const { onClose, open } = props;

  const handleClose = (event: {}, reason: string) => {
    onClose(reason === "OK");
  };

  return (
    <Dialog
      onClose={handleClose}
      open={open}
      scroll="paper"
      fullWidth
      maxWidth="md"
    >
      <DialogTitle>Unlock new connections?</DialogTitle>
      <DialogContent dividers={true}>
        <DialogContentText tabIndex={-1}>
          <Alert severity="info">
            {i18n.localize(
              "INFO_RELEASE_CONNECTION",
              "When confirming the release of new connections, users can connect to that server again."
            )}
          </Alert>
        </DialogContentText>
        <DialogActions>
          <Button
            onClick={(event) => {
              handleClose(event, "OK");
            }}
          >
            {i18n.localize("OK", "OK")}
          </Button>
          <Button
            onClick={() => {
              handleClose(event, "cancel");
            }}
          >
            {i18n.localize("CANCEL", "Cancel")}
          </Button>
        </DialogActions>
      </DialogContent>
    </Dialog>
  );
}
