//import React from 'react';
import React = require("react");
//import PropTypes from 'prop-types';
import PropTypes = require("prop-types");
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import { DialogContent, Typography } from '@material-ui/core';
import CircularProgress from '@material-ui/core/CircularProgress';

// const useStyles = makeStyles((theme: Theme) => {
//   createStyles({
//     // root: {
//     //   display: 'flex',
//     //   '& > * + *': {
//     //     marginLeft: theme.spacing(2),
//     //   },
//     // },
//     root: {
//       display: "flex",
//       alignItems: "center"
//     },
//     wrapper: {
//       margin: theme.spacing(1),
//       position: "relative",
//       alignItems: "center"
//     },

//   })
// });
const useStyles = makeStyles((theme: Theme) => ({
  spinner: {
    display: "flex",
    alignItems: "center",
    margin: theme.spacing(2),
    justifyContent: "center"
  },
  text: {
    display: "flex",
    alignItems: "center",
    margin: theme.spacing(2),
    justifyContent: "center"
  },
}));

export default function ChangePageWaitDialog(props) {

  const classes = useStyles();

  const { onClose, open } = props;

  const handleClose = () => {
    onClose();
  };

  return (
    <Dialog onClose={handleClose} aria-labelledby="customized-dialog-title" open={open}>
      <DialogContent>
      <div className={classes.spinner}>
        <CircularProgress />
      </div>
      <div className={classes.text}>
        <Typography>Loading page... Please wait... </Typography>
      </div>
      </DialogContent>
    </Dialog>
  );
}

// ChangePageWaitDialog.propTypes = {
//   open: false,
// };

//if(PropTypes)
ChangePageWaitDialog.propTypes = {
  open: PropTypes.bool.isRequired
};