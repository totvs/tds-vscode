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

export interface ConfirmDialogProps {
  open: boolean;
  operation: string;
  message: string;
  onClose: (confirmed: boolean) => void;
}

export default function ConfirmDialog(props: ConfirmDialogProps) {
  const { onClose, message, open, operation } = props;

  const handleClose = (event: {}, reason: string) => {
    onClose(reason === "YES");
  };

  return (
    <Dialog
      onClose={handleClose}
      open={open}
      scroll="paper"
      fullWidth
      maxWidth="lg"
    >
      <DialogTitle>{operation}</DialogTitle>
      <DialogContent dividers={true}>
        <DialogContentText tabIndex={-1}>
          <Alert severity="warning">{message}</Alert>
        </DialogContentText>
        <DialogActions>
          <Button
            onClick={(event) => {
              handleClose(event, "YES");
            }}
          >
            {i18n.localize("YES", "Yes")}
          </Button>
          <Button
            onClick={() => {
              handleClose(event, "NO");
            }}
          >
            {i18n.localize("NO", "NO")}
          </Button>
        </DialogActions>
      </DialogContent>
    </Dialog>
  );
}
