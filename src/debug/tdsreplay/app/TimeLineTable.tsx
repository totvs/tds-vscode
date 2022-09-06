import React, { RefObject } from "react";
import {
  makeStyles,
  useTheme,
  Theme,
  createStyles,
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
import LibraryBooksIcon from "@material-ui/icons/LibraryBooks";
import KeyboardArrowLeft from "@material-ui/icons/KeyboardArrowLeft";
import KeyboardArrowRight from "@material-ui/icons/KeyboardArrowRight";
import LastPageIcon from "@material-ui/icons/LastPage";
import { ICommand, CommandToDA, CommandToPage } from "../Command";
import { DebugSessionCustomEvent } from "vscode";
import { FormControlLabel, Button } from "@material-ui/core";
import SourcesDialog from "./SourcesDialog";
import ChangePageWaitDialog from "./ChangePageWaitDialog";
import MessageDialog from "./MessageDialog";

enum KeyCode {
  BACKSPACE = 8,
  COMMA = 188,
  DELETE = 46,
  DOWN = 40,
  END = 35,
  ENTER = 13,
  ESCAPE = 27,
  HOME = 36,
  LEFT = 37,
  PAGE_DOWN = 34,
  PAGE_UP = 33,
  PERIOD = 190,
  RIGHT = 39,
  SPACE = 32,
  TAB = 9,
  UP = 38,
  F1 = 112,
  F2 = 113,
  F3 = 114,
  F4 = 115,
  F5 = 116,
  F6 = 117,
  F7 = 118,
  F8 = 119,
  F9 = 120,
  F10 = 121,
  F11 = 122,
  F12 = 123,
  INSERT = 45,
  SHIFT = 16,
  CONTROL = 17,
  ALT = 18,
  PAUSE_BREAK = 19,
  CAPSLOCK = 20,
}

const useStyles1 = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexShrink: 0,
      marginLeft: theme.spacing(2.5),
    },
  })
);

const tableStyles = makeStyles((_theme) => ({
  root: {
    width: "100%",
  },
  tableContainer: {
    //Esse parametro faz com que o container ocupe todo espaço disponivel do webview
    flex: 1,
    //maxHeight: 610
    //flexDirection: "row",
    //flexGrow: "inherit"
  },
  table: {},
  headCell: {
    //backgroundColor: this.props.muiTheme.palette.primary1Color,
    //color: "white"
    backgroundColor: "rgb(230,230,230)",
    //color: "white"
  },
  tableRow: {
    "&:hover": {
      backgroundColor: "gainsboro !important",
    },
  },
  pagination: {
    //backgroundColor: "blue"
  },
  selectedTableRow: {
    backgroundColor: "grey !important",
  },
  srcNotFound: {
    backgroundColor: 'rgb(255,204,204) !important',
    //backgroundColor: "LIGHTCORAL !important",
    //textDecoration: "line-through black",
    WebkitTextDecorationStyle: "solid",
  },
  sources: {
    alignItems: "right",
    justifyContent: "right",
    margin: _theme.spacing(1),
  },
}));

interface Column {
  id: 'TimeStamp' | 'SourceName' | 'Line';
  label: string;
  minWidth?: number;
  align?: 'left' | 'right' | 'center';
  format?: (value: number) => string;
}

const columns: Column[] = [
  {
    id: "TimeStamp",
    label: "Time",
    minWidth: 10,
    align: "left",
  },
  {
    id: "SourceName",
    label: "Source Name",
    minWidth: 10,
    align: 'left',
    //format: (value: number) => value.toLocaleString(),
  },
  {
    id: "Line",
    label: "Line",
    minWidth: 10,
    align: "left",
    //format: (value: number) => value.toLocaleString(),
  },
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
    <label className={classes.root}>
      <IconButton
        onClick={handleFirstPageButtonClick}
        disabled={page === 0}
        aria-label="first page"
      >
        {theme.direction === 'rtl' ? <LastPageIcon /> : <FirstPageIcon />}
      </IconButton>
      <IconButton
        onClick={handleBackButtonClick}
        disabled={page === 0}
        aria-label="previous page"
      >
        {theme.direction === 'rtl' ? (
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
        {theme.direction === 'rtl' ? (
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
        {theme.direction === 'rtl' ? <FirstPageIcon /> : <LastPageIcon />}
      </IconButton>
      </label>
  );
}

let listener = undefined;
interface ITimeLineTableInterface {
  vscode: any;
}

let tableElement: RefObject<HTMLTableElement> = null;

export default function TimeLineTable(props: ITimeLineTableInterface) {

  const vscode = props.vscode;

  const debugEvent = vscode.getState().config;

  tableElement = React.createRef();

  const tableClasses = tableStyles();

  const [jsonBody, setJsonBody] = React.useState(debugEvent.body);
  const [dense, setDense] = React.useState(false);
  const [ignoreSourcesNotfound, setIgnoreSourcesNotfound] = React.useState(
    debugEvent.body.ignoreSourcesNotFound
  );
  const [openSourcesDialog, setOpenSourcesDialog] = React.useState(false);
  const [openWaitPage, setOpenWaitPage] = React.useState(false);
  const [itemsPerPageState, setItemsPerPageState] = React.useState(debugEvent.body.itemsPerPage);
  const [openMessageDialog, setOpenMessageDialog] = React.useState(false);
  const [msgType, setMsgType] = React.useState("");
  const [message, setMessage] = React.useState("");

  //Id da timeline inicial a ser selecionada. 500 para selcionar a primeira pois o replay sempre ira parar na primeira linha
  const [selectedRowId, setSelectedRowId] = React.useState(
    jsonBody.currentSelectedTimeLineId
  );
  const [sources, setSources] = React.useState([]);

  //console.log("Do state:" + ignoreSourcesNotfound);
  //console.log("current TimeLine ID:" + jsonBody.currentSelectedTimeLineId);
  //console.log("itemsPerPageJson:" + jsonBody.itemsPerPage);
  //console.log("itemsPerPage:" + itemsPerPageState);
  //console.log("currentPage: " + jsonBody.currentPage);
  //console.log("totalPages: " + jsonBody.totalPages);
  ///console.log("TimeLineCount: " + jsonBody.timeLines.length);
  //console.log("totaItems: " + jsonBody.totalItems);

  const handleChangeDense = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDense(event.target.checked);
  };

  const handleIgnoreSourceNotFount = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    //setOpenWaitPage(true); //Essa flag aqui esta com problema
    let command: ICommand = {
      action: CommandToDA.SetIgnoreSourcesNotFound,
      content: { isIgnoreSourceNotFound: event.target.checked },
    };
    vscode.postMessage(command);
    setIgnoreSourcesNotfound((oldValue) => {
      if (event !== undefined) {
        event.preventDefault();
      }
      return event.target.checked;
    });
  };

  const handleChangePage = (newPage: number) => {
    setOpenWaitPage(true);
    let command: ICommand = {
      action: CommandToDA.ChangePage,
      content: { newPage: newPage },
    };
    vscode.postMessage(command);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setOpenWaitPage(true);
    let itemsPerPage: number = Number.parseInt(event.target.value);
    setItemsPerPageState(itemsPerPage);

    let command: ICommand = {
      action: CommandToDA.ChangeItemsPerPage,
      content: {
        itemsPerPage: itemsPerPage,
        currentTimeLineSelected: jsonBody.currentSelectedTimeLineId,
      },
    };

    vscode.postMessage(command);
  };

  const handleCloseSourcesDialog = (value) => {
    setOpenSourcesDialog(false);
  };

  const handleCloseMsgDialog = (value) => {
    setOpenMessageDialog(false);
  }

  const sendShowAllSourcesRequest = () => {
    let command: ICommand = {
      action: CommandToDA.ShowSources,
      content: { data: "all" },
    };
    vscode.postMessage(command);
  };

  const sendSelectTimeLineRequest = (id: string) => {
    let command: ICommand = {
      action: CommandToDA.SetTimeLine,
      content: { timeLineSelected: id },
    };
    vscode.postMessage(command);
    selectTimeLineInTable(id);
  };

  const selectTimeLineInTable = (timeLineIdAsString: string) => {
    let timeLineId: number = Number.parseInt(timeLineIdAsString);
    setJsonBody((jsonBody) => {
      if (event !== undefined) {
        event.preventDefault();
      }
      jsonBody.currentSelectedTimeLineId = timeLineIdAsString;
      return jsonBody;
    });
    setSelectedRowId(timeLineIdAsString);
    scrollToLineIfNeeded(timeLineId);
  };

  if (listener === undefined) {
    listener = (event) => {
      const message = event.data; // The JSON data our extension sent
      switch (message.command) {
        case CommandToPage.SelectTimeLine:
          let timeLineId = message.data;
          selectTimeLineInTable(timeLineId);
          break;
        case CommandToPage.AddTimeLines:
          setOpenWaitPage(false);
          setPageData(event, message);
          break;
        case CommandToPage.OpenSourcesDialog:
          setSources((sources) => {
            if (event !== undefined) {
              event.preventDefault();
            }
            sources = message.data;
            return sources;
          });
          setOpenSourcesDialog(true);
          break;
        case CommandToPage.ShowLoadingPageDialog:
          setOpenWaitPage(message.data);
          break;
        case CommandToPage.SetUpdatedState:
          setPageData(event, message);
          break;
        case CommandToPage.ShowMessageDialog:
          setOpenMessageDialog(true);
          setMsgType(message.data.msgType);
          setMessage(message.data.message);
          break;
      }
      message.command = '';
    };
    window.addEventListener('message', listener);
  }


  const setPageData = (event, message) => {
    setJsonBody((body) => {
      if (event !== undefined) {
        event.preventDefault();
      }
      body = message.data.body;
      return body;
    });
    setIgnoreSourcesNotfound((value) => {
      if (event !== undefined) {
        event.preventDefault(); //Impede que a pagina seja atualizada nessa alteração para que seja atualizada apenas uma vez ao selecionar a timeline
      }
      return message.data.body.ignoreSourcesNotFound;
    });
    let itemsPerPage = message.data.body.itemsPerPage;
    if(itemsPerPage !== itemsPerPageState) {
      setItemsPerPageState((value) => {
        if (event !== undefined) {
          event.preventDefault();
        }
        return itemsPerPage;
      });
    }
    selectTimeLineInTable(message.data.body.currentSelectedTimeLineId);
  }

  const scrollIntoViewIfNeeded = (target: HTMLElement) => {
    function getScrollParent(node: HTMLElement): HTMLElement {
      if (node === null) {
        return null;
      }

      if (node.scrollHeight > node.clientHeight) {
        return node;
      } else {
        return getScrollParent(node.parentNode as HTMLElement);
      }
    }

    let parent = getScrollParent(target.parentNode as HTMLElement);

    if (!parent) return;

    let parentComputedStyle = window.getComputedStyle(parent, null),
      parentBorderTopWidth = parseInt(
        parentComputedStyle.getPropertyValue("border-top-width")
      ),
      overTop = target.offsetTop - parent.offsetTop < parent.scrollTop,
      overBottom =
        target.offsetTop -
          parent.offsetTop +
          target.clientHeight -
          parentBorderTopWidth >
        parent.scrollTop + parent.clientHeight;

    if (overTop) {
      target.scrollIntoView(true);
    } else if (overBottom) {
      target.scrollIntoView(false);
    }
  };

  const scrollToLineIfNeeded = (id: number) => {
    if (tableElement.current !== null) {
      const rows = Array.from(
          tableElement.current.querySelectorAll("tbody tr")
        ),
        newRow = rows.find((row) => row.id === `${id}`) as HTMLElement;
      //tableElement.current.scrollTo()
      scrollIntoViewIfNeeded(newRow);
    }
  };

  const onKeyDown = function (
    event: React.KeyboardEvent<HTMLTableSectionElement>,
    timeline: any[]
  ) {
    const navigateToRow = (position: number | null, offset?: number) => {
      offset = offset || 0;

      if (position === null) {
        const rowId: number = Number.parseInt(selectedRowId);
        const currentItem = timeline.find((item) => {
          return item.id === rowId;
        });
        position = timeline.indexOf(currentItem);
      }

      let newPosition = position + offset;
      newPosition = Math.max(newPosition, 0);
      newPosition = Math.min(newPosition, timeline.length - 1);

      const newItem = timeline[newPosition];

      //TODO: se for para navega alem dos itens na paginacao atual, recuperar
      // os novos dados, carregar e depois setar a primeira/ultima linha
      if (newItem) {
        sendSelectTimeLineRequest("" + newItem.id);
        //scrollToLineIfNeeded(newItem.id);
      }
    };

    //TODO: calcular corretamente a quantidade de linhas em PageUp, PageDown
    switch (event.keyCode) {
      case KeyCode.UP:
        navigateToRow(null, -1);

        break;
      case KeyCode.DOWN:
        navigateToRow(null, +1);

        break;
      case KeyCode.PAGE_UP:
        navigateToRow(null, -10);

        break;
      case KeyCode.PAGE_DOWN:
        navigateToRow(null, +10);

        break;
      case KeyCode.HOME:
        navigateToRow(0);

        break;
      case KeyCode.END:
        navigateToRow(timeline.length - 1);

        break;
      default:
        return;
    }
  };

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
      let notFoundText = '';
      let bg;
      if (!timeLine.srcFoundInWS || timeLine.srcFoundInWS == 'false') {
        bg = classes.srcNotFound;
        notFoundText =
          'Source not found in Workspace. This timeline is not available to select';
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
          onClick={(event) => {
            if (timeLine.srcFoundInWS) {
              sendSelectTimeLineRequest(event.currentTarget.id);
            }
            //sendSelectTimeLineRequest(timeLine.id);
          }}
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
    //	handleChangePage(null,jsonBody.currentPage+1);
    //}
    return items;
  };

  //const theme = useTheme();

  return (
    //<Paper className={tableClasses.root}>
    <TableContainer className={tableClasses.tableContainer} component={Paper}>
      <Table
        className={tableClasses.table}
        stickyHeader
        aria-label="sticky table"
        ref={tableElement}
        size={dense ? 'medium' : 'small'}
      >
        <TableHead>
          <TableRow>
            {columns.map((column) => (
              <TableCell
                className={tableClasses.headCell}
                key={column.id}
                align={column.align}
                style={{ minWidth: column.minWidth }}
              >
                {column.label}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody onKeyDown={(event) => onKeyDown(event, jsonBody.timeLines)}>
          {createTimeLineItem(debugEvent)}
        </TableBody>
      </Table>
      <TablePagination
        className={tableClasses.pagination}
        rowsPerPageOptions={[100, 500, 1000, 2000, 3000, 5000]}
        count={parseInt(jsonBody.totalItems)}
        rowsPerPage={itemsPerPageState}
        page={jsonBody.currentPage}
        SelectProps={{
          inputProps: { "aria-label": "rows per page" },
          native: true,
        }}
        onPageChange={(event, value) => handleChangePage(value)}
        onChangePage={(event, value) => handleChangePage(value)}
        onRowsPerPageChange={(event) => handleChangeRowsPerPage(event)}
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
      <Button
        className={tableClasses.sources}
        variant="contained"
        startIcon={<LibraryBooksIcon />}
        onClick={sendShowAllSourcesRequest}
      >
        Sources
      </Button>
      {/*<SourcesDialog selectedValue={selectedValue} open={open} onClose={handleCloseSourcesDialog} />*/}
      <SourcesDialog
        sources={sources}
        open={openSourcesDialog}
        onClose={handleCloseSourcesDialog}
      />
      <ChangePageWaitDialog open={openWaitPage} />
      <MessageDialog open={openMessageDialog} msgType={msgType} message={message} onClose={handleCloseMsgDialog}/>
    </TableContainer>
    //</Paper>
  );
}

