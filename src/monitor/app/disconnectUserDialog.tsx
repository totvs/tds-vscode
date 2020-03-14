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
  FormControlLabel,
  Paper
} from "@material-ui/core";
import Alert from "@material-ui/lab/Alert";
import MaterialTable from "material-table";
import { HeadCell, cellDefaultStyle } from "./monitorInterface";

export interface DisconnectUserDialogProps {
  open: boolean;
  recipients: any[];
  onClose: (confirmed: boolean, killNow: boolean, recipients: any[]) => void;
}

const headCells: HeadCell[] = [
  { field: "server", title: "Servidor", ...cellDefaultStyle },
  { field: "environment", title: "Ambiente", ...cellDefaultStyle },
  { field: "username", title: "Usuário", ...cellDefaultStyle },
  { field: "remark", title: "Comentário", ...cellDefaultStyle }
];

export default function DisconnectUserDialog(
  props: DisconnectUserDialogProps
) {
  const { onClose, recipients, open } = props;
  const [ isKillNow, setKillNow ] = React.useState(false);

  const handleClose = (event: {}, reason: string) => {
    onClose(reason === "OK", isKillNow, recipients);
  };

  const killNowClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    setKillNow(event.target.checked);
  };

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
        <DialogContentText tabIndex={-1}>
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
