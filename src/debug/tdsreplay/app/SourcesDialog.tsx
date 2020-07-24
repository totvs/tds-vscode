import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import { blue } from '@material-ui/core/colors';
import { DialogContent, Typography, DialogActions, Button, Paper } from '@material-ui/core';

const useStyles = makeStyles({
  avatar: {
    backgroundColor: blue[100],
    color: blue[600],
  },
  table: {
    minWidth: 300,
  },
});

export default function SourcesDialog(props) {
  const classes = useStyles();
  const { onClose, sources, open } = props;

  const handleClose = () => {
    onClose(sources);
  };

  const getNoSourceComponent = () => {
    return <Typography gutterBottom>
              No source was imported
          </Typography>
  }

  const getSourcesTable = (classes: any, sourcesRows: any) => {
    return  <TableContainer component={Paper}>
              <Table className={classes.table} aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell>Source</TableCell>
                    <TableCell align="left">Compile Date</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {sourcesRows}
                </TableBody>
              </Table>
            </TableContainer>
  }

  let sourcesRows: any;

  if(sources !== undefined) {
   sourcesRows = sources.map((source, idx) => {
     return  <TableRow key={source.id}>
               <TableCell component="th" scope="row">{source.name}</TableCell>
               <TableCell align="left">{source.compileDate}</TableCell>
             </TableRow>
   });
 }

  return (
    <Dialog onClose={handleClose} aria-labelledby="customized-dialog-title" open={open}>
      <DialogTitle id="customized-dialog-title">
        Source Information
      </DialogTitle>
      <DialogContent dividers>
        {
          sources === undefined || sources.length === 0 ? getNoSourceComponent : getSourcesTable(classes,sourcesRows)
        }
      </DialogContent>
      <DialogActions>
        <Button autoFocus onClick={handleClose} color="primary">Close</Button>
      </DialogActions>
    </Dialog>
  );
}

SourcesDialog.propTypes = {
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  sources: PropTypes.array
};
