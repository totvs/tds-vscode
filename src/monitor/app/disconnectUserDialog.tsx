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
  Paper,
} from "@material-ui/core";
import Alert from "@material-ui/lab/Alert";
import MaterialTable from "material-table";
import { cellDefaultStyle } from "./monitorInterface";
import { monitorIcons } from "../helper/monitorIcons";
import { i18n } from "../helper";

export interface DisconnectUserDialogProps {
  open: boolean;
  recipients: any[];
  onClose: (confirmed: boolean, killNow: boolean, recipients: any[]) => void;
}

function headCells(): any[] {
  return [
    {
      field: "server",
      title: i18n.localize("SERVER", "Server"),
      ...cellDefaultStyle,
    },
    {
      field: "environment",
      title: i18n.localize("ENVIRONMENT", "Environment"),
      ...cellDefaultStyle,
    },
    {
      field: "username",
      title: i18n.localize("USER", "User"),
      ...cellDefaultStyle,
    },
    {
      field: "remark",
      title: i18n.localize("COMMENT", "Comment"),
      ...cellDefaultStyle,
    },
  ];
}

export default function DisconnectUserDialog(props: DisconnectUserDialogProps) {
  const { onClose, recipients, open } = props;
  const [isKillNow, setKillNow] = React.useState(false);

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
      <DialogTitle>
        {i18n.localize(
          "DLG_TITLE_CLOSE_CONNECTIONS",
          "Closes user connections"
        )}
      </DialogTitle>
      <DialogContent dividers={true}>
        <DialogContentText tabIndex={-1}>
          <Alert severity="warning">
            {i18n.localize(
              "WARN_CONNECTION_TERMINATED",
              "The users listed below will have their connections terminated."
            )}
          </Alert>
          <FormControlLabel
            control={
              <Checkbox
                checked={isKillNow}
                onChange={killNowClick}
                value="checked"
              />
            }
            label={i18n.localize(
              "TERMINATE_CONNECTIONS_IMMEDIATELY",
              "Terminate connections immediately."
            )}
          />
          <Paper>
            <MaterialTable
              localization={{
                pagination: {
                  labelDisplayedRows: "{from}-{to}/{count}",
                  labelRowsSelect: i18n.localize("CONNECTIONS", "connections"),
                  labelRowsPerPage: i18n.localize("LINES_PAGE.", "lines/p."),
                  firstAriaLabel: i18n.localize("FIRST", "First"),
                  firstTooltip: i18n.localize("FIRST_PAGE", "First page"),
                  previousAriaLabel: i18n.localize("PREVIOUS", "Previous"),
                  previousTooltip: i18n.localize("PREVIOUS_PAGE", "Previous page"),
                  nextAriaLabel: i18n.localize("NEXT", "Next"),
                  nextTooltip: i18n.localize("NEXT_PAGE", "Next page"),
                  lastAriaLabel: i18n.localize("LAST", "Last"),
                  lastTooltip: i18n.localize("LAST_PAGE", "Last page"),
                }
              }}
              icons={monitorIcons.table}
              columns={headCells()}
              data={recipients}
              options={{
                toolbar: false,
                showTitle: false,
              }}
            />
          </Paper>
        </DialogContentText>
        <DialogActions>
          <Button
            onClick={(event) => {
              handleClose(event, "OK");
            }}
          >
            {i18n.localize("OK", "OK")}
          </Button>
          <Button
            onClick={() => {
              handleClose(event, "cancel");
            }}
          >
            {i18n.localize("CANCEL", "Cancel")}
          </Button>
        </DialogActions>
      </DialogContent>
    </Dialog>
  );
}
