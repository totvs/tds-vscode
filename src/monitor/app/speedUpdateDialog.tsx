import * as React from 'react';
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import {
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  FormGroup,
  FormControlLabel,
  Switch,
} from '@material-ui/core';
import { i18n } from '../helper';

export interface SpeedUpdateDialogProps {
  open: boolean;
  speed: number;
  onClose: (confirmed: boolean, speed: number) => void;
}

export default function SpeedUpdateDialog(props: SpeedUpdateDialogProps) {
  let { onClose, open, speed } = props;
  let newSpeed = speed;

  const [state, setState] = React.useState({
    short: speed === 15,
    normal: speed === 30,
    long: speed === 60,
    manual: speed === 0,
  });

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();

    if (event.target.name == 'short') {
      speed = 15;
    } else if (event.target.name == 'normal') {
      speed = 30;
    } else if (event.target.name == 'long') {
      speed = 60;
    } else {
      speed = 0;
    }

    setState({
      short: speed === 15,
      normal: speed === 30,
      long: speed === 60,
      manual: speed === 0,
    });
  };

  const handleClose = (event: {}, reason: string) => {
    if (reason === 'ok') {
      const newSpeed = state.short
        ? 15
        : state.normal
        ? 30
        : state.long
        ? 60
        : 0;
      onClose(true, newSpeed);
    } else {
      setState({
        short: speed === 15,
        normal: speed === 30,
        long: speed === 60,
        manual: speed === 0,
      });
      onClose(false, speed);
    }
  };

  return (
    <Dialog onClose={handleClose} open={open} scroll="paper">
      <DialogTitle>
        {i18n.localize('DLG_TITLE_SPEED', 'Interval between updates')}
      </DialogTitle>
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
              label={i18n.localize('SECONDS', '{0} seconds', 15)}
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
              label={i18n.localize('SECONDS', '{0} seconds', 30)}
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
              label={i18n.localize('SECONDS', '{0} seconds', 60)}
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
              label={i18n.localize('MANUAL', 'Manual')}
            />
          </FormGroup>
        </DialogContentText>
        <DialogActions>
          <Button
            onClick={(event) => {
              handleClose(event, 'ok');
            }}
          >
            {i18n.localize('OK', 'OK')}
          </Button>
          <Button
            onClick={() => {
              handleClose(event, 'cancel');
            }}
          >
            {i18n.localize('CANCEL', 'Cancel')}
          </Button>
        </DialogActions>
      </DialogContent>
    </Dialog>
  );
}
