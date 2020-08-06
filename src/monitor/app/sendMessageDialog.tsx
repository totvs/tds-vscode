import * as React from "react";
import DialogTitle from "@material-ui/core/DialogTitle";
import Dialog from "@material-ui/core/Dialog";
import {
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  TextField,
  Paper,
} from "@material-ui/core";
import MaterialTable from "material-table";
import { cellDefaultStyle } from "./monitorInterface";
import { monitorIcons } from "../helper/monitorIcons";
import { i18n } from "../helper";

export interface SendMessageDialogProps {
  open: boolean;
  recipients: any[];
  onClose: (confirmed: boolean, message: string, recipients: any) => void;
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
      title: i18n.localize("REMARKS", "Remarks"),
      ...cellDefaultStyle,
    },
  ];
}

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
      <DialogTitle>
        {i18n.localize("DLG_TITLE_SEND_MESSAGE", "Message sending")}
      </DialogTitle>
      <DialogContent dividers={true}>
        <DialogContentText ref={descriptionElementRef} tabIndex={-1}>
          <TextField
            inputRef={messageRef}
            required
            label={i18n.localize("MESSAGE_TEXT", "Message Text")}
            defaultValue=""
            variant="outlined"
            multiline
            rows={3}
            rowsMax={10}
            fullWidth
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
                  previousTooltip: i18n.localize(
                    "PREVIOUS_PAGE",
                    "Previous page"
                  ),
                  nextAriaLabel: i18n.localize("NEXT", "Next"),
                  nextTooltip: i18n.localize("NEXT_PAGE", "Next page"),
                  lastAriaLabel: i18n.localize("LAST", "Last"),
                  lastTooltip: i18n.localize("LAST_PAGE", "Last page"),
                },
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
              handleClose(event, "send");
            }}
          >
            {i18n.localize("SEND", "Submit")}
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
