import * as React from "react";
import DialogTitle from "@material-ui/core/DialogTitle";
import Dialog from "@material-ui/core/Dialog";
import {
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  Typography,
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup
} from "@material-ui/core";
import { i18n } from "../helper";

export interface ChangeCodePageDialogProps {
  open: boolean;
  environment: any;
  onClose: (confirmed: boolean, environment: string, newValue: string) => void;
}

export default function ChangeCodePageDialog(props: ChangeCodePageDialogProps) {
  const { onClose, open, environment } = props;
  const [value, setValue] = React.useState(environment.codePage);

  const handleClose = (event: {}, reason: string) => {
    onClose(reason === "OK", environment.name, value);
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue((event.target as HTMLInputElement).value);
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      scroll="paper"
      fullWidth
      maxWidth="sm"
    >
      <DialogTitle>{i18n.localize("DLG_TITLE_CHANGE_CODE_PAGE", "Change Environment Encoding")}</DialogTitle>
      <DialogContent dividers={true}>
        <DialogContentText tabIndex={-1}>
          <FormControl>
            <FormLabel>Environment: {props.environment.name}</FormLabel>
            <RadioGroup
              value={props.environment.codepage}
              onChange={handleChange}
            >
              <FormControlLabel value="0" control={<Radio />} label="CP-1252" />
              <FormControlLabel value="1" control={<Radio />} label="CP-1251" />
              <FormControlLabel value="2" control={<Radio />} label="UTF-8" />
            </RadioGroup>
          </FormControl>
        </DialogContentText>
        <DialogActions>
          <Button
            onClick={event => {
              handleClose(event, "OK");
            }}
          >
            {i18n.localize("OK", "OK")}
          </Button>
          <Button
            onClick={(event) => {
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
