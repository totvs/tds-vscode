import * as React from "react";
import DialogTitle from "@material-ui/core/DialogTitle";
import Dialog from "@material-ui/core/Dialog";
import {
  DialogContent,
  DialogContentText,
  DialogActions,
  Button} from "@material-ui/core";
import Alert from "@material-ui/lab/Alert";
import { i18n } from "../helper";

const localize = (key: string, message: string, args?: any): string => { return i18n.localize(key, message, args); };//nls.loadMessageBundle();

export interface LockServerDialogProps {
  open: boolean;
  onClose: (confirmed: boolean) => void;
}

export default function LockServerDialog(props: LockServerDialogProps) {
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
      <DialogTitle>Bloquear novas conexões?</DialogTitle>
      <DialogContent dividers={true}>
        <DialogContentText tabIndex={-1}>
          <Alert severity="warning">
            {localize("WARNING_BLOCKING_CONNECTIONS", "When confirming the blocking of new connections, no user can connect to that server.")}
          </Alert>
        </DialogContentText>
        <DialogActions>
          <Button
            onClick={event => {
              handleClose(event, "OK");
            }}
          >
            {localize("OK", "OK")}
          </Button>
          <Button
            onClick={() => {
              handleClose(event, "cancel");
            }}
          >
            {localize("CANCEL", "Cancel")}
          </Button>
        </DialogActions>
      </DialogContent>
    </Dialog>
  );
}
