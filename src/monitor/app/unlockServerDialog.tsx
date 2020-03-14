import React from "react";
import DialogTitle from "@material-ui/core/DialogTitle";
import Dialog from "@material-ui/core/Dialog";
import {
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  TextField} from "@material-ui/core";


export interface UnlockServerDialogProps {
  open: boolean;
  onClose: (confirmed: boolean) => void;
}

export default function UnlockServerDialog(props: UnlockServerDialogProps) {
  const { onClose, open } = props;

  const handleClose = (event: {}, reason: string) => {
    onClose(reason === "OK");
  };

  const messageRef = React.useRef<HTMLTextAreaElement>();
  const descriptionElementRef = React.useRef<HTMLElement>(null);

  React.useEffect(() => {
    if (open) {
      const { current: descriptionElement } = descriptionElementRef;
      if (descriptionElement !== null) {
        descriptionElement.focus();
      }
    }
  }, [open]);

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
        <DialogContentText ref={descriptionElementRef} tabIndex={-1}>
          <TextField
            inputRef={messageRef}
            required
            label="Mensagem"
            defaultValue="Ao confirmar a liberação de novas conexões, os usuários podem
            conectar-se novamente a esse servidor."
            variant="outlined"
            multiline
            rows={3}
            rowsMax={10}
            fullWidth
            disabled={true}
          />
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
