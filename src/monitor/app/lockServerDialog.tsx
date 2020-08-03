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
      <DialogTitle>{i18n.localize("DLG_TITLE_LOCK_SERVER", "Block new connections?")}</DialogTitle>
      <DialogContent dividers={true}>
        <DialogContentText tabIndex={-1}>
          <Alert severity="warning">
            {i18n.localize("WARNING_BLOCKING_CONNECTIONS", "When confirming the blocking of new connections, no user can connect to that server.")}
          </Alert>
        </DialogContentText>
        <DialogActions>
          <Button
            onClick={event => {
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
