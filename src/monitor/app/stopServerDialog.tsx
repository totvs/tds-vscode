import * as React from "react";
import DialogTitle from "@material-ui/core/DialogTitle";
import Dialog from "@material-ui/core/Dialog";
import {
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  Typography} from "@material-ui/core";
import Alert from "@material-ui/lab/Alert";


export interface StopServerDialogProps {
  open: boolean;
  onClose: (confirmed: boolean, killNow: boolean) => void;
}

export default function StopServerDialog(props: StopServerDialogProps) {
  const { onClose, open } = props;

  const handleClose = (event: {}, reason: string, args?: any) => {
    onClose(reason === "OK", args);
  };

  return (
    <Dialog
      onClose={handleClose}
      open={open}
      scroll="paper"
      fullWidth
      maxWidth="md"
    >
      <DialogTitle>Confirma a parada do servidor?</DialogTitle>
      <DialogContent dividers={true}>
        <DialogContentText tabIndex={-1}>
          <Alert severity="error">
            <Typography>
            Ao confirmar a parada do servidor, todas as conexões (incluindo
            esta) serão encerradas, assim como outros processos.
            <strong>A reinicialização só será possível acessando o servidor fisicamente.</strong>
            </Typography>
          </Alert>
        </DialogContentText>
        <DialogActions>
          <Button
            onClick={event => {
              handleClose(event, "ok");
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
