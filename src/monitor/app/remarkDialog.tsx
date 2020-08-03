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
import { i18n } from "../helper";

export interface RemarkDialogProps {
  open: boolean;
  remark: string;
  onClose: (confirmed: boolean) => void;
}

export default function RemarkDialog(props: RemarkDialogProps) {
  const { onClose, open, remark } = props;

  const handleClose = (event: {}, reason: string) => {
    onClose(reason === "OK");
  };

  const lines = remark.split(/   |\n/);
  let cnt: number = 0;

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      scroll="paper"
      fullWidth
      maxWidth="md"
    >
      <DialogTitle>{i18n.localize("DLG_TITLE_REMARKS", "Remarks")}</DialogTitle>
      <DialogContent dividers={true}>
        <DialogContentText tabIndex={-1}>
          <Alert severity="info">
            {lines.map((line: string) => <Typography key={"LINE"+(cnt++)}>{line}</Typography>)}
          </Alert>
        </DialogContentText>
        <DialogActions>
          <Button
            onClick={event => {
              handleClose(event, "OK");
            }}
          >
            {i18n.localize("OK", "OK")}
          </Button>
        </DialogActions>
      </DialogContent>
    </Dialog>
  );
}
