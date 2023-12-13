import React = require("react");
import PropTypes = require("prop-types");
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
import { DialogContent, Typography, DialogActions, Button, Paper, Checkbox } from '@material-ui/core';
import { dir } from "console";

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
  var { onClose, sources, open, selected } = props;
  const [_selected, _setSelected] = React.useState(selected);

  const handleCancel = () => {
    onClose(undefined);
  };

  const handleApply = () => {
    onClose(_selected);
  };

  const getNoSourceComponent = () => {
    return <Typography gutterBottom>
      No source was imported
    </Typography>
  }

  const getSourcesTable = (classes: any, sourcesRows: any) => {
    return <TableContainer component={Paper}>
      <Table className={classes.table} aria-label="simple table" size="small">
        <TableHead>
          <TableRow>
            <TableCell padding="checkbox">
              <Checkbox
                onClick={(event) => handleSelectAllClick(event)}
                checked={isSelectAllClick()}
                inputProps={{ 'aria-labelledby': "filter-table-checkbox-all" }}
              />
            </TableCell>
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

  const handleSelectAllClick = (event: any) => {
    if (event.target.checked) {
      _setSelected(sources.map((element) => element.name));
    } else {
      _setSelected(["<empty>"]);
    }
  };

  const isSelectAllClick = (): boolean => {
    return _selected.length == 0;
  };

  const handleSelectClick = (name: string) => {
    const selectedIndex = _selected.indexOf(name);
    let newSelected: string[] = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(_selected, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(_selected.slice(1));
    } else if (selectedIndex === _selected.length - 1) {
      newSelected = newSelected.concat(_selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        _selected.slice(0, selectedIndex),
        _selected.slice(selectedIndex + 1),
      );
    }

    _setSelected(newSelected);
    props.onSelectChange!(newSelected);
  };

  const isSelected = (name: string) => {
    console.log("-------------------------");
    console.dir(_selected);

    return _selected.length == 0 || _selected.indexOf(name) !== -1;
  }

  if (sources !== undefined) {
    sourcesRows = sources.map((source, idx) => {
      const isItemSelected = isSelected(source.name);
      const labelId = `filter-table-checkbox-${idx}`;

      return <TableRow
        key={source.id}
        hover
        onClick={(event) => handleSelectClick(source.name)}
        role="checkbox"
        aria-checked={isItemSelected}
        tabIndex={-1}
        selected={isItemSelected}
      >
        <TableCell padding="checkbox">
          <Checkbox
            checked={isItemSelected}
            inputProps={{ 'aria-labelledby': labelId }}
          />
        </TableCell>
        <TableCell component="th" scope="row">{source.name}</TableCell>
        <TableCell align="left">{source.compileDate}</TableCell>
      </TableRow>
    });
  }

  return (
    <Dialog onClose={handleCancel} aria-labelledby="customized-dialog-title" open={open}>
      <DialogTitle id="customized-dialog-title">
        Sources<br />
        <small>Selected sources will be presented.</small>
      </DialogTitle>
      <DialogContent dividers>
        {
          sources === undefined || sources.length === 0 ? getNoSourceComponent : getSourcesTable(classes, sourcesRows)
        }
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCancel} color="secondary">Cancel</Button>
        <Button autoFocus onClick={handleApply} color="primary">Apply</Button>
      </DialogActions>
    </Dialog>
  );
}

SourcesDialog.propTypes = {
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  sources: PropTypes.array.isRequired,
  selected: PropTypes.array.isRequired,
  //onSelectChange: PropTypes.func.isRequired,
};
