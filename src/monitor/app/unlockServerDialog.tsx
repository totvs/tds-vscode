import * as React from "react";
import DialogTitle from "@material-ui/core/DialogTitle";
import Dialog from "@material-ui/core/Dialog";
import {
  DialogContent,
  DialogContentText,
  DialogActions,
  Button
} from "@material-ui/core";
import Alert from "@material-ui/lab/Alert";

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
      <DialogTitle>Desbloquear novas conexões?</DialogTitle>
      <DialogContent dividers={true}>
        <DialogContentText tabIndex={-1}>
          <Alert severity="info">
            Ao confirmar a liberação de novas conexões, os usuários podem
            conectar-se novamente a esse servidor.
          </Alert>
        </DialogContentText>
        <DialogActions>
          <Button
            onClick={(event) => {
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
