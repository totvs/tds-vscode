//import React from 'react';
import React = require("react");
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import {DialogContent, DialogActions, Typography, Button} from '@material-ui/core';


const useStyles = makeStyles({
});


export default function MessageDialog(props) {

  const classes = useStyles();

  const { onClose, open, msgType, message } = props;

  const handleClose = () => {
    onClose();
  };
  return (
    <Dialog onClose={handleClose} aria-labelledby="simple-dialog-title" open={open} onClick={handleClose}>
      <DialogTitle id="simple-dialog-title" onClick={handleClose}>{msgType}</DialogTitle>
      <DialogContent>
        <Typography gutterBottom>{message}</Typography>
      </DialogContent>
      <DialogActions>
        <Button autoFocus onClick={handleClose} color="primary">Close</Button>
      </DialogActions>
    </Dialog>
  );
}
