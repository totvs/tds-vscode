import * as React from "react";
import DialogTitle from "@material-ui/core/DialogTitle";
import Dialog from "@material-ui/core/Dialog";
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
import { cellDefaultStyle } from "./monitorInterface";
import { monitorIcons } from "../helper/monitorIcons";
import { i18n } from "../helper";

const localize = (key: string, message: string, args?: any): string => { return i18n.localize(key, message, args); };//nls.loadMessageBundle();

export interface DisconnectUserDialogProps {
  open: boolean;
  recipients: any[];
  onClose: (confirmed: boolean, killNow: boolean, recipients: any[]) => void;
}

const headCells: any[] = [
  { field: "server", title:      localize("SERVER"   , "Server"),...cellDefaultStyle },
  { field: "environment", title: localize("AMBIENT"  , "Ambient"),...cellDefaultStyle },
  { field: "username", title:    localize("USER"     , "User"),...cellDefaultStyle },
  { field: "remark", title:      localize("COMMENT"  , "Comment"),...cellDefaultStyle }
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
            {localize("WARN_CONNECTION_TERMINATED", "The users listed below will have their connections terminated.")}
          </Alert>
          <FormControlLabel
            control={
              <Checkbox
                checked={isKillNow}
                onChange={killNowClick}
                value="checked"
              />
            }
            label={localize("TERMINATE_CONNECTIONS_IMMEDIATELY", "Terminate connections immediately.")}
          />
          <Paper>
            <MaterialTable
              icons={monitorIcons.table}
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
            {localize("OK", "OK")}
          </Button>
          <Button
            onClick={() => {
              handleClose(event, "cancel");
            }}
          >
            {localize("CANCEL", "Cancel")}
          </Button>
        </DialogActions>
      </DialogContent>
    </Dialog>
  );
}
