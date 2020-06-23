import * as React from "react";
import DialogTitle from "@material-ui/core/DialogTitle";
import Dialog from "@material-ui/core/Dialog";
import {
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  TextField,
  Paper
} from "@material-ui/core";
import MaterialTable from "material-table";
import { HeadCell, cellDefaultStyle } from "./monitorInterface";


export interface SendMessageDialogProps {
  open: boolean;
  recipients: any[];
  onClose: (confirmed: boolean, message: string, recipients: any) => void;
}

const headCells: HeadCell[] = [
  { field: "server", title: "Servidor", ...cellDefaultStyle },
  { field: "environment", title: "Ambiente", ...cellDefaultStyle },
  { field: "username", title: "Usuário", ...cellDefaultStyle },
  { field: "remark", title: "Comentário", ...cellDefaultStyle }
];

export default function SendMessageDialog(props: SendMessageDialogProps) {
  const { onClose, recipients, open } = props;

  const handleClose = (event: {}, reason: string) => {
    onClose(reason === "send", messageRef.current.value, recipients);
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
      maxWidth="lg"
    >
      <DialogTitle>Envio de mensagem</DialogTitle>
      <DialogContent dividers={true}>
        <DialogContentText ref={descriptionElementRef} tabIndex={-1}>
          <TextField
            inputRef={messageRef}
            required
            label="Mensagem"
            defaultValue=""
            variant="outlined"
            multiline
            rows={3}
            rowsMax={10}
            fullWidth
          />
          <Paper>
            <MaterialTable
              columns={headCells}
              data={recipients}
              options={{
                toolbar: false,
                showTitle: false
              }}
            />
          </Paper>
        </DialogContentText>
        <DialogActions>
          <Button
            onClick={event => {
              handleClose(event, "send");
            }}
          >
            Enviar
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
