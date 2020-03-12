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
  Checkbox,
  FormControlLabel
} from "@material-ui/core";
import Alert from "@material-ui/lab/Alert";

const useStyles = makeStyles({
  avatar: {
    backgroundColor: blue[100],
    color: blue[600]
  }
});

export interface DisconnecttUserDialogProps {
  open: boolean;
  recipients: string[];
  onClose: (confirmed: boolean, killNow: boolean) => void;
}

export default function DisconnecttUserDialog(
  props: DisconnecttUserDialogProps
) {
  const { onClose, recipients, open } = props;
  const [ isKillNow, setKillNow ] = React.useState(false);

  const handleClose = (event: {}, reason: string) => {
    onClose(reason === "desconnect", isKillNow);
    //setOpen(false);
  };

  const descriptionElementRef = React.useRef<HTMLElement>(null);

  React.useEffect(() => {
    if (open) {
      const { current: descriptionElement } = descriptionElementRef;
      if (descriptionElement !== null) {
        descriptionElement.focus();
      }
    }
  }, [open]);

  const killNowClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    setKillNow(event.target.checked);
  };

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
      <DialogTitle>Encerra conexões de usuários</DialogTitle>
      <DialogContent dividers={true}>
        <DialogContentText ref={descriptionElementRef} tabIndex={-1}>
          <Alert severity="warning">
            Os usuários abaixo listados terão suas conexões encerradas.
          </Alert>
          <FormControlLabel
            control={
              <Checkbox
                checked={isKillNow}
                onChange={killNowClick}
                value="checked"
              />
            }
            label="Encerrar conexões imediatamente."
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
              handleClose(event, "desconnect");
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
