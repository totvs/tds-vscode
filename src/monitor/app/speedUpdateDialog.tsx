import * as React from "react";
import DialogTitle from "@material-ui/core/DialogTitle";
import Dialog from "@material-ui/core/Dialog";
import {
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  FormGroup,
  FormControlLabel,
  Switch,
} from "@material-ui/core";

export interface SpeedUpdateDialogProps {
  open: boolean;
  speed: number;
  onClose: (confirmed: boolean, speed: number) => void;
}

export default function SpeedUpdateDialogDialog(props: SpeedUpdateDialogProps) {
  const { onClose, open, speed } = props;

  const [state, setState] = React.useState({
    short: speed === 15,
    normal: speed === 30,
    long: speed === 60,
    manual: speed === 0,
  });

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const current = state;

    current.short = false;
    current.normal = false;
    current.long = false;
    current.manual = false;

    setState({ ...state, [event.target.name]: event.target.checked });
  };

  const handleClose = (event: {}, reason: string) => {
    const speed = state.short? 15
    : state.normal? 30
    : state.long? 60
    : 0;

    onClose(reason === "ok", speed);
  };

  return (
    <Dialog
      onClose={handleClose}
      open={open}
      scroll="paper"
    >
      <DialogTitle>Intervalo entre atualizações</DialogTitle>
      <DialogContent dividers={true}>
        <DialogContentText tabIndex={-1}>
          <FormGroup row>
            <FormControlLabel
              control={
                <Switch
                  checked={state.short}
                  onChange={handleChange}
                  name="short"
                />
              }
              label="15 segundos"
            />
          </FormGroup>
          <FormGroup row>
            <FormControlLabel
              control={
                <Switch
                  checked={state.normal}
                  onChange={handleChange}
                  name="normal"
                />
              }
              label="30 segundos"
            />
          </FormGroup>
          <FormGroup row>
            <FormControlLabel
              control={
                <Switch
                  checked={state.long}
                  onChange={handleChange}
                  name="long"
                />
              }
              label="60 segundos"
            />
          </FormGroup>
          <FormGroup row>
            <FormControlLabel
              control={
                <Switch
                  checked={state.manual}
                  onChange={handleChange}
                  name="manual"
                />
              }
              label="Manual"
            />
          </FormGroup>
        </DialogContentText>
        <DialogActions>
          <Button
            onClick={(event) => {
              handleClose(event, "ok");
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
