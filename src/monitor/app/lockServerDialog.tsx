import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import DialogTitle from "@material-ui/core/DialogTitle";
import Dialog from "@material-ui/core/Dialog";
import { blue } from "@material-ui/core/colors";
import {
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  TextField
} from "@material-ui/core";
import Alert from "@material-ui/lab/Alert";

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
            Ao confirmar o bloqueio de novas conexões, nenhum usuário poderá
            conectar-se a esse servidor.
          </Alert>
        </DialogContentText>
        <DialogActions>
          <Button
            onClick={event => {
              handleClose(event, "OK");
            }}
          >
            OK
          </Button>
          <Button
            onClick={() => {
              handleClose(event, "cancel");
            }}
          >
            Cancelar
          </Button>
        </DialogActions>
      </DialogContent>
    </Dialog>
  );
}
