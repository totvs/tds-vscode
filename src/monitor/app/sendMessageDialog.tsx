import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
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

const useStyles = makeStyles({
  avatar: {
    backgroundColor: blue[100],
    color: blue[600]
  }
});

export interface SendMessageDialogProps {
  open: boolean;
  recipients: string[];
  onClose: (confirmed: boolean, message: string) => void;
}

export default function SendMessageDialog(props: SendMessageDialogProps) {
  const classes = useStyles();
  const { onClose, recipients, open } = props;
  //const { open, setOpen } = React.useState(props.open);

  const handleClose = (event: {}, reason: string) => {
	console.log("*** event handleClose " + reason + " " + (reason === "send"));
	console.log(messageRef);
	console.log(messageRef.current.value);

	onClose(reason === "send", messageRef.current.value);
	//setOpen(false);
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

  let recipientsName = [];
  for (let index = 0; index < recipients.length; index++) {
    const element = recipients[index];

    if (recipientsName.indexOf(element) === -1) {
      recipientsName.push(element);
    }
  }

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
            fullWidth
          />
          <List dense={true}>
            {recipientsName.map(name => {
              return (
                <ListItem key={name}>
                  <ListItemText primary={name} />
                </ListItem>
              );
            })}
          </List>
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
        </DialogActions>{" "}
      </DialogContent>
    </Dialog>
  );
}
