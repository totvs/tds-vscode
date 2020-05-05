import React, { useReducer, RefObject } from "react";
import {
  makeStyles,
  useTheme,
  Theme,
  createStyles
} from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TablePagination from "@material-ui/core/TablePagination";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import Switch from "@material-ui/core/Switch";
import IconButton from "@material-ui/core/IconButton";
import FirstPageIcon from "@material-ui/icons/FirstPage";
import KeyboardArrowLeft from "@material-ui/icons/KeyboardArrowLeft";
import KeyboardArrowRight from "@material-ui/icons/KeyboardArrowRight";
import LastPageIcon from "@material-ui/icons/LastPage";
import { ICommand, CommandAction } from "../Command";
import { DebugSessionCustomEvent } from "vscode";
import { FormControlLabel } from "@material-ui/core";

const useStyles1 = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexShrink: 0,
      marginLeft: theme.spacing(2.5)
    }
  })
);

const tableStyles = makeStyles(_theme => ({
  root: {
    width: "100%"
  },
  container: {
    maxHeight: 610
  },

  headCell: {
    //backgroundColor: this.props.muiTheme.palette.primary1Color,
    //color: "white"
    //backgroundColor: "grey"
    //color: "white"
  },
  tableRow: {
    "&:hover": {
      backgroundColor: "gainsboro !important"
    }
  },
  selectedTableRow: {
    backgroundColor: "grey !important"
  },
  srcNotFound: {
    backgroundColor: "rgb(255,204,204) !important",
    //backgroundColor: "LIGHTCORAL !important",
    //textDecoration: "line-through black",
    WebkitTextDecorationStyle: "solid"
  }
}));

interface Column {
  id: "TimeStamp" | "SourceName" | "Line";
  label: string;
  minWidth?: number;
  align?: "left" | "right" | "center";
  format?: (value: number) => string;
}

const columns: Column[] = [
	{
		id: 'TimeStamp',
		label: 'Time',
		minWidth: 10,
		align: 'left'
	},
	{
		id: 'SourceName',
		label: 'Source Name',
		minWidth: 10,
		align: 'left'
		//format: (value: number) => value.toLocaleString(),
	},
	{
		id: 'Line',
		label: 'Line',
		minWidth: 10,
		align: 'left'
		//format: (value: number) => value.toLocaleString(),
	}
];

interface TablePaginationActionsProps {
  count: number;
  page: number;
  rowsPerPage: number;
  onChangePage: (
    event: React.MouseEvent<HTMLButtonElement>,
    newPage: number
  ) => void;
}

function TablePaginationActions(props: TablePaginationActionsProps) {
  const classes = useStyles1();
  const theme = useTheme();
  const { count, page, rowsPerPage, onChangePage } = props;

  const handleFirstPageButtonClick = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    onChangePage(event, 0);
  };

  const handleBackButtonClick = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    onChangePage(event, page - 1);
  };

  const handleNextButtonClick = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    onChangePage(event, page + 1);
  };

  const handleLastPageButtonClick = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    onChangePage(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
  };

  return (
    <div className={classes.root}>
      <IconButton
        onClick={handleFirstPageButtonClick}
        disabled={page === 0}
        aria-label="first page"
      >
        {theme.direction === "rtl" ? <LastPageIcon /> : <FirstPageIcon />}
      </IconButton>
      <IconButton
        onClick={handleBackButtonClick}
        disabled={page === 0}
        aria-label="previous page"
      >
        {theme.direction === "rtl" ? (
          <KeyboardArrowRight />
        ) : (
          <KeyboardArrowLeft />
        )}
      </IconButton>
      <IconButton
        onClick={handleNextButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="next page"
      >
        {theme.direction === "rtl" ? (
          <KeyboardArrowLeft />
        ) : (
          <KeyboardArrowRight />
        )}
      </IconButton>
      <IconButton
        onClick={handleLastPageButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="last page"
      >
        {theme.direction === "rtl" ? <FirstPageIcon /> : <LastPageIcon />}
      </IconButton>
    </div>
  );
}

let listener = undefined;
interface ITimeLineTableInterface {
  vscode: any;
}

export default function TimeLineTable(props: ITimeLineTableInterface) {
  const vscode = props.vscode;
  const debugEvent = vscode.getState().config;

  const tableElement: RefObject<HTMLTableElement> = React.createRef();

  const classes = tableStyles();
  const [jsonBody, setJsonBody] = React.useState(debugEvent.body);
  const [dense, setDense] = React.useState(false);
  const [ignoreSourcesNotfound, setIgnoreSourcesNotfound] = React.useState(
    debugEvent.body.ignoreSourcesNotFound
  );

  console.log("DEbugEvent:" + debugEvent.body.ignoreSourcesNotFound);
  console.log("Do state:" + ignoreSourcesNotfound);
  //console.log("current TimeLine ID:" + jsonBody.currentSelectedTimeLineId);
  //console.log("itemsPerPage:" + jsonBody.itemsPerPage);
  //console.log("currentPage: " + jsonBody.currentPage);
  //console.log("totalPages: " + jsonBody.totalPages);
  ///console.log("TimeLineCount: " + jsonBody.timeLines.length);
  //console.log("totaItems: " + jsonBody.totalItems);

  const [selectedRow, setSelectedRow] = React.useState(
    jsonBody.currentSelectedTimeLineId
  ); //Id da timeline inicial a ser selecionada. 500 para selcionar a primeira pois o replay sempre ira parar na primeira linha

  const handleChangeDense = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDense(event.target.checked);
  };

  const handleIgnoreSourceNotFount = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    let command: ICommand = {
      action: CommandAction.SetIgnoreSourcesNotFound,
      content: { isIgnoreSourceNotFound: event.target.checked }
    };
    vscode.postMessage(command);
    setIgnoreSourcesNotfound(oldValue => {
      if (event !== undefined) {
        event.preventDefault();
      }
      return event.target.checked;
    });
  };

  const handleChangePage = (
    _event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number
  ) => {
    //console.log("handleChangePage (newPage: " + newPage + ")");
    let command: ICommand = {
      action: CommandAction.ChangePage,
      content: { newPage: newPage }
    };
    vscode.postMessage(command);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    //console.log("handleChangeRowsPerPage: " + event.target.value);
    let command: ICommand = {
      action: CommandAction.ChangeItemsPerPage,
      content: {
        itemsPerPage: event.target.value,
        currentTimeLineSelected: jsonBody.currentSelectedTimeLineId
      }
    };
    vscode.postMessage(command);
  };

  const sendSelectTimeLineRequest = (
    event: React.MouseEvent<HTMLTableRowElement, MouseEvent>,
    id: string
  ) => {
    //console.log("------> postMessage Set TimeLine");
    let command: ICommand = {
      action: CommandAction.SetTimeLine,
      content: { timeLineSelected: id }
    };
    vscode.postMessage(command);
    selectTimeLineInTable(id);
  };

  const selectTimeLineInTable = (timeLineId: string) => {
    //Metodo que controla a selecao de timeline
    //console.log("------> rowSelected");
    setJsonBody(jsonBody => {
      if (event !== undefined) {
        event.preventDefault();
      }
      jsonBody.currentSelectedTimeLineId = timeLineId;
      return jsonBody;
    });
    setSelectedRow(timeLineId);
    //console.log("------> rowSelected (setPageInfo finished)");
  };

  if (listener === undefined) {
    listener = event => {
      const message = event.data; // The JSON data our extension sent
      switch (message.command) {
        case "selectTimeLine":
          //console.log("------> selectTimeLine");
          let timeLineId = message.data;
          //console.log("------> TimeLineID: " + timeLineId);
          selectTimeLineInTable(timeLineId);
          break;
        case "addTimeLines":
          //console.log("------> addTimeLines");
          setJsonBody(body => {
            if (event !== undefined) {
              event.preventDefault();
            }
            body = message.data.body;
            return body;
          });
          setIgnoreSourcesNotfound(value => {
            if (event !== undefined) {
              event.preventDefault(); //Impede que a pagina seja atualizada nessa alteração para que seja atualizada apenas uma vez ao selecionar a timeline
            }
            return message.data.body.ignoreSourcesNotFound;
          });
          //console.log("FirstTimeLineID: "+message.data.body.currentSelectedTimeLineId);
          selectTimeLineInTable(message.data.body.currentSelectedTimeLineId);
          break;
      }
      message.command = "";
    };
    //console.log("------> ADICIONANDO LISTENER")
    window.addEventListener("message", listener);
  }

  const createTimeLineItem = (_debugEvent: DebugSessionCustomEvent) => {
    const classes = tableStyles();
    let items = [];
    let timeLines = jsonBody.timeLines;
    //console.log("Criando TIMELINES:");
    //let timeLineFoundInPage = false;
    for (let index = 0; index < jsonBody.timeLines.length; index++) {
      let timeLine = timeLines[index];
      let isSelected: boolean =
        timeLine.id === parseInt(jsonBody.currentSelectedTimeLineId);
      let notFoundText = "";
      let bg;
      if (!timeLine.srcFoundInWS || timeLine.srcFoundInWS == "false") {
        bg = classes.srcNotFound;
        notFoundText =
          "Source not found in Workspace. This timeline is not available to select";
      } else {
        bg =
          jsonBody.currentSelectedTimeLineId !== undefined && isSelected
            ? classes.selectedTableRow
            : classes.tableRow;
      }

      items.push(
        <TableRow
          title={notFoundText}
          hover
          tabIndex={-1}
          id={timeLine.id}
          key={timeLine.id}
          className={bg}
          onClick={
            timeLine.srcFoundInWS
              ? event => {
                  sendSelectTimeLineRequest(event, event.currentTarget.id);
                }
              : event => {
                  /*does nothing*/
                }
          }
          selected={isSelected}
        >
          <TableCell component="th" scope="row">
            {timeLine.timeStamp}
          </TableCell>
          <TableCell align="left">{timeLine.srcName}</TableCell>
          <TableCell align="left">{timeLine.line}</TableCell>
        </TableRow>
      );
    }
    //if(!timeLineFoundInPage) {
    //console.log("TimeLine nao encontrado nessa pagina, mudando de pagina");
    //	handleChangePage(null,jsonBody.currentPage+1);
    //}
    //console.log("Retornando do createTimeLineItem LOOP");
    return items;
  };

  //console.log("TimeLineTable chamado");
  //console.log("TimeLine Selecionada: "+selectedRow)

  //const theme = useTheme();

  return (
    <Paper className={classes.root}>
      <TableContainer className={classes.container}>
        <Table
          stickyHeader
          aria-label="sticky table"
          ref={tableElement}
          size={dense ? "medium" : "small"}
        >
          <TableHead>
            <TableRow>
              {columns.map(column => (
                <TableCell
                  className={classes.headCell}
                  key={column.id}
                  align={column.align}
                  style={{ minWidth: column.minWidth }}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>{createTimeLineItem(debugEvent)}</TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[100, 500, 1000, 1500, 2000, 3000, 5000]}
        component="div"
        count={parseInt(jsonBody.totalItems)}
        rowsPerPage={jsonBody.itemsPerPage}
        page={jsonBody.currentPage}
        SelectProps={{
          inputProps: { "aria-label": "rows per page" },
          native: true
        }}
        onChangePage={handleChangePage}
        onChangeRowsPerPage={handleChangeRowsPerPage}
        ActionsComponent={TablePaginationActions}
      />
      <FormControlLabel
        control={<Switch checked={dense} onChange={handleChangeDense} />}
        label="Dense padding"
      />
      <FormControlLabel
        control={
          <Switch
            checked={ignoreSourcesNotfound}
            onChange={handleIgnoreSourceNotFount}
          />
        }
        label="Ignore Source Not Found"
      />
    </Paper>
  );
}
