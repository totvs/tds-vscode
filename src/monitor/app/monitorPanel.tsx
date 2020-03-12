import React from "react";
import clsx from "clsx";
import {
  createStyles,
  lighten,
  makeStyles,
  Theme
} from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TablePagination from "@material-ui/core/TablePagination";
import TableRow from "@material-ui/core/TableRow";
import TableSortLabel from "@material-ui/core/TableSortLabel";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";
import Checkbox from "@material-ui/core/Checkbox";
import IconButton from "@material-ui/core/IconButton";
import Tooltip from "@material-ui/core/Tooltip";
import DeleteIcon from "@material-ui/icons/Delete";
import FilterListIcon from "@material-ui/icons/FilterList";
import {
  LockIcon,
  UnlockIcon,
  MessageIcon,
  AgroupIcon,
  SettingsIcon,
  StopIcon,
  WriteLogIcon,
  Speed0Icon,
  Speed5Icon,
  Speed10Icon,
  Speed30Icon,
  DisconnectIcon
} from "./monitorIcons";
import { CommandAction, ICommand } from "../command";
import IMonitorUser from "../monitorUser";
import SpeedButton from "./speedButton";
import SendMessageDialog from "./sendMessageDialog";
import DisconnecttUserDialog from "./disconnectUserDialog";
import Dialog from "@material-ui/core/Dialog";
import {
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button
} from "@material-ui/core";

interface IConnectionData {
  username: string;
  computerName: string;
  threadId: number;
  server: string;
  mainName: string;
  environment: string;
  loginTime: string;
  elapsedTime: string;
  totalInstrCount: number;
  instrCountPerSec: number;
  remark: string;
  memUsed: number;
  sid: string;
  ctreeTaskId: number;
  clientType: string;
  inactiveTime: string;
}

function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

type Order = "asc" | "desc";

function getComparator<Key extends keyof any>(
  order: Order,
  orderBy: Key
): (
  a: { [key in Key]: number | string },
  b: { [key in Key]: number | string }
) => number {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort<T>(array: T[], comparator: (a: T, b: T) => number) {
  const stabilizedThis = array.map((el, index) => [el, index] as [T, number]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) {
      return order;
    }
    return a[1] - b[1];
  });

  return stabilizedThis.map(el => el[0]);
}

interface HeadCell {
  id: keyof IConnectionData;
  label: string;
  numeric?: boolean;
}

const headCells: HeadCell[] = [
  { id: "server", label: "Servidor" },
  { id: "environment", label: "Ambiente" },
  { id: "username", label: "Usuário" },
  { id: "computerName", label: "Estação" },
  { id: "threadId", label: "Thread", numeric: true },
  { id: "mainName", label: "Programa" },
  { id: "loginTime", label: "Conexão" },
  { id: "elapsedTime", label: "Tempo Decorrido" },
  { id: "inactiveTime", label: "Tempo Inatividade" },
  { id: "totalInstrCount", label: "Total Instruções", numeric: true },
  { id: "instrCountPerSec", label: "Instruções/seg", numeric: true },
  { id: "remark", label: "Comentário" },
  { id: "memUsed", label: "Memória em Uso", numeric: true },
  { id: "sid", label: "SID" },
  { id: "ctreeTaskId", label: "CTree ID" },
  { id: "clientType", label: "Tipo Conexão" }
];

interface EnhancedTableProps {
  classes: ReturnType<typeof useStyles>;
  numSelected: number;
  onRequestSort: (
    event: React.MouseEvent<unknown>,
    property: keyof IConnectionData
  ) => void;
  onSelectAllClick: (
    event: React.ChangeEvent<HTMLInputElement>,
    checked: boolean
  ) => void;
  order: Order;
  orderBy: string;
  rowCount: number;
}

function EnhancedTableHead(props: EnhancedTableProps) {
  const {
    classes,
    onSelectAllClick,
    order,
    orderBy,
    numSelected,
    rowCount,
    onRequestSort
  } = props;
  const createSortHandler = (property: keyof IConnectionData) => (
    event: React.MouseEvent<unknown>
  ) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        <TableCell padding="checkbox">
          <Checkbox
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={rowCount > 0 && numSelected === rowCount}
            onChange={onSelectAllClick}
            inputProps={{ "aria-label": "select all desserts" }}
          />
        </TableCell>
        {headCells.map(headCell => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? "right" : "left"}
            padding="default"
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : "asc"}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <span className={classes.visuallyHidden}>
                  {order === "desc" ? "sorted descending" : "sorted ascending"}
                </span>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

const useToolbarStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      paddingLeft: theme.spacing(1),
      paddingRight: theme.spacing(1)
    },
    highlight:
      theme.palette.type === "light"
        ? {
            color: theme.palette.secondary.main,
            backgroundColor: lighten(theme.palette.secondary.light, 0.85)
          }
        : {
            color: theme.palette.text.primary,
            backgroundColor: theme.palette.secondary.dark
          },
    title: {
      fontSize: "180%",
      fontWeight: "bold"
    },
    subtitle: {
      fontSize: "85%",
      color: "silver"
    },
    upperCase: {
      textTransform: "uppercase"
    },
    toolbarButtons: {
      marginLeft: "auto"
    },
    chips: {
      display: "flex",
      flexWrap: "wrap"
    },
    chip: {
      margin: 2
    }
  })
);

interface EnhancedTableToolbarProps {
  vscode: any;
  numSelected: number;
  title: string;
  subtitle: string;
  speed: number;
  lockServer: boolean;
  targetServer: IMonitorServer;
  selecteds: IConnectionData[];
}

const EnhancedTableToolbar = (props: EnhancedTableToolbarProps) => {
  const classes = useToolbarStyles();
  const {
    vscode,
    numSelected,
    title,
    subtitle,
    speed,
    lockServer,
    targetServer,
    selecteds
  } = props;
  const [openSendMessageDialog, setOpenSendMessageDialog] = React.useState(
    false
  );
  const [openDesconnectUserDialog, setDisconnectUserDialog] = React.useState(
    false
  );
  const [openStopServerDialog, setOpenStopServerDialog] = React.useState(false);

  const handleLockButtonClick = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    args?: any
  ) => {
    event.preventDefault();
    const id = event.currentTarget.id;

    let command: ICommand = {
      action: CommandAction.LockServer,
      content: { server: targetServer, lock: id === "btnLockServer" }
    };

    vscode.postMessage(command);
  };

  const handleSendMessageButtonClick = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    event.preventDefault();
    setOpenSendMessageDialog(true);
  };

  const handleDisconnectUserButtonClick = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    event.preventDefault();
    setDisconnectUserDialog(true);
  };

  const handleStopButtonClick = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    event.preventDefault();
    setOpenStopServerDialog(true);
  };

  const handleCloseStopServerDialog = (event: any, reason: string) => {
    console.log("handleCloseStopServerDialog " + reason);

    if (reason === "_YES_") {
      let command: ICommand = {
        action: CommandAction.StopServer,
        content: {
          server: targetServer
        }
      };

      vscode.postMessage(command);
    }

    setOpenStopServerDialog(false);
  };

  const doDisconnectUser = (confirmed: boolean, killNow: boolean) => {
    event.preventDefault();

    setDisconnectUserDialog(false);

    if (confirmed) {
      let command: ICommand = {
        action: CommandAction.KillConnection,
        content: {
          server: targetServer,
          recipients: selecteds,
          killnow: killNow
        }
      };

      vscode.postMessage(command);
    }
  };

  const doSendMessage = (confirmed: boolean, message: string) => {
    event.preventDefault();
    setOpenSendMessageDialog(false);

    if (confirmed) {
      let command: ICommand = {
        action: CommandAction.SendMessage,
        content: {
          server: targetServer,
          recipients: selecteds,
          message: message
        }
      };

      vscode.postMessage(command);
    }
  };

  const handleAgroupButtonClick = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    args?: any
  ) => {
    event.preventDefault();

    let command: ICommand = {
      action: CommandAction.ToggleAGroup,
      content: true
    };

    vscode.postMessage(command);
  };

  const handleWriteLogButtonClick = () => {
    let command: ICommand = {
      action: CommandAction.ToggleWriteLogServer,
      content: { server: targetServer }
    };

    vscode.postMessage(command);
  };

  const speeds = [0, 5, 10, 30];
  const handleSpeedButtonChange = (index: number) => {
    let command: ICommand = {
      action: CommandAction.SetSpeedUpdate,
      content: { speed: speeds[index], server: targetServer }
    };

    vscode.postMessage(command);
  };

  const speedOptions = [
    <Tooltip title="Por solicitação">
      <IconButton size="small">
        <Speed0Icon />
      </IconButton>
    </Tooltip>,
    <Tooltip title="A cada 5 segundos">
      <IconButton size="small">
        <Speed5Icon />
      </IconButton>
    </Tooltip>,
    <Tooltip title="A cada 10 segundos">
      <IconButton size="small">
        <Speed10Icon />
      </IconButton>
    </Tooltip>,
    <Tooltip title="A cada 30 segundos">
      <IconButton size="small">
        <Speed30Icon />
      </IconButton>
    </Tooltip>
  ];

  return (
    <Toolbar variant="dense" className={classes.root}>
      <Typography className={classes.title} variant="h6" id="tableTitle">
        <span className={classes.upperCase}>{title}</span>&nbsp;
        <span className={classes.subtitle}>{subtitle}</span>
      </Typography>

      <div className={classes.toolbarButtons}>
        {lockServer ? (
          <Tooltip title="Desbloquear novas conexões">
            <IconButton id="btnUnlockServer" onClick={handleLockButtonClick}>
              <UnlockIcon />
            </IconButton>
          </Tooltip>
        ) : (
          <Tooltip title="Bloquear novas conexões">
            <IconButton id="btnLockServer" onClick={handleLockButtonClick}>
              <LockIcon />
            </IconButton>
          </Tooltip>
        )}
        <Tooltip title="Enviar mensagem aos usuários">
          <span>
            <IconButton
              id="btnSendMessage"
              onClick={handleSendMessageButtonClick}
              disabled={numSelected === 0}
            >
              <MessageIcon />
            </IconButton>
          </span>
        </Tooltip>
        <Tooltip title="Desconectar usuário">
          <span>
            <IconButton
              id="btnDesconnectUser"
              onClick={handleDisconnectUserButtonClick}
              disabled={numSelected === 0}
            >
              <DisconnectIcon />
            </IconButton>
          </span>
        </Tooltip>
        <Tooltip title="Parar o servidor">
          <IconButton id="btnStopServer" onClick={handleStopButtonClick}>
            <StopIcon />
          </IconButton>
        </Tooltip>

        <Tooltip title="Gravar monitor">
          <IconButton id="btnWriteLog" onClick={handleWriteLogButtonClick}>
            <WriteLogIcon />
          </IconButton>
        </Tooltip>

        <SpeedButton
          options={speedOptions}
          callback={handleSpeedButtonChange}
          value={speeds.indexOf(speed)}
        />
      </div>

      <Dialog
        open={openStopServerDialog}
        onClose={handleCloseStopServerDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Confirma a parada do servidor?"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Ao confirmar a parada do servidor, o mesmo será encerrado
            imediatamente. A sua reinicialização só será possível acessando o
            servidor localmente.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => handleCloseStopServerDialog(null, "_NO_")}
            color="primary"
          >
            Não
          </Button>
          <Button
            onClick={() => handleCloseStopServerDialog(null, "_YES_")}
            color="primary"
            autoFocus
          >
            Sim
          </Button>
        </DialogActions>
      </Dialog>

      <SendMessageDialog
        open={openSendMessageDialog}
        recipients={selecteds.map(element => element.username)}
        onClose={doSendMessage}
      />

      <DisconnecttUserDialog
        open={openDesconnectUserDialog}
        recipients={selecteds.map(element => element.username)}
        onClose={doDisconnectUser}
      />
    </Toolbar>
  );

  /*
          <Tooltip title="Agrupar">
          <IconButton id="btnAgroup" onClick={handleAgroupButtonClick}>
            <AgroupIcon />
          </IconButton>
        </Tooltip>

  */
};

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: "100%"
    },
    paper: {
      width: "100%",
      marginBottom: theme.spacing(2)
    },
    table: {
      minWidth: 750
    },
    visuallyHidden: {
      border: 0,
      clip: "rect(0 0 0 0)",
      height: 1,
      margin: -1,
      overflow: "hidden",
      padding: 0,
      position: "absolute",
      top: 20,
      width: 1
    },
    collumn: {
      whiteSpace: "nowrap",
      overflow: "hidden",
      textOverflow: "ellipsis",
      paddingLeft: theme.spacing(0),
      paddingRight: theme.spacing(1),
      maxWidth: "30em",
      minWidth: "8em"
    },
    collumnCB: {
      whiteSpace: "nowrap",
      overflow: "hidden",
      paddingLeft: theme.spacing(1),
      paddingRight: theme.spacing(0),
      width: "4em"
    }
  })
);

interface IMonitorPanel {
  vscode: any;
  targetServer: any;
  titles: string[];
}

let listener = undefined;

export default function MonitorPanel(props: IMonitorPanel) {
  const classes = useStyles();
  const [order, setOrder] = React.useState<Order>("asc");
  const [orderBy, setOrderBy] = React.useState<keyof IConnectionData>("server");
  const [selected, setSelected] = React.useState<string[]>([]);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [speed, setSpeed] = React.useState<number>(0);
  const [timer, setTimer] = React.useState<number>();
  const [rows, setRows] = React.useState([]);
  const [lock, setLock] = React.useState(false);

  if (listener === undefined) {
    listener = (event: MessageEvent) => {
      const message = event.data; // The JSON data our extension sent

      switch (message.command) {
        case CommandAction.SetSpeedUpdate: {
          setSpeed(message.data);

          if (timer) {
            window.clearInterval(timer);
          }
          if (message.data > 0) {
            setTimer(window.setInterval(updateUsers, message.data * 1000));
          }

          break;
        }
        case CommandAction.UpdateUsers: {
          window.clearInterval(timer);
          const result = message.data as IMonitorUser[];

          setRows(result);

          break;
        }
        case CommandAction.LockServer: {
          setLock(message.data);

          break;
        }
        default:
          console.log("***** ATENÇÃO: monitorPanel.tsx");
          console.log("\tComando não reconhecido: " + message.command);
          break;
      }
    };

    window.addEventListener("message", listener);
  }

  const updateUsers = () => {
    let command: ICommand = {
      action: CommandAction.UpdateUsers,
      content: props.targetServer
    };

    props.vscode.postMessage(command);
  };

  const handleRequestSort = (
    event: React.MouseEvent<unknown>,
    property: keyof IConnectionData
  ) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelecteds = rows.map(n => n.threadId);
      setSelected(newSelecteds);
      return;
    }

    setSelected([]);
  };

  const handleClick = (event: React.MouseEvent<unknown>, threadId: string) => {
    const selectedIndex = selected.indexOf(threadId);
    let newSelected: string[] = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, threadId);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }

    setSelected(newSelected);
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const isSelected = (threadId: string) => {
    return selected.indexOf(threadId) !== -1;
  };

  const emptyRows =
    rowsPerPage - Math.min(rowsPerPage, rows.length - page * rowsPerPage);

  if (!props.targetServer) {
    return <Typography>Inicializando...</Typography>;
  }

  return (
    <div className={classes.root}>
      <Paper className={classes.paper}>
        <EnhancedTableToolbar
          numSelected={selected.length}
          selecteds={rows.filter(
            value => selected.indexOf(value.threadId) !== -1
          )}
          title={props.titles[0]}
          subtitle={props.titles[1]}
          speed={speed}
          lockServer={lock}
          targetServer={props.targetServer}
          vscode={props.vscode}
        />
        <TableContainer>
          <Table className={classes.table} size="small">
            <EnhancedTableHead
              classes={classes}
              numSelected={selected.length}
              order={order}
              orderBy={orderBy}
              onSelectAllClick={handleSelectAllClick}
              onRequestSort={handleRequestSort}
              rowCount={rows.length}
            />
            <TableBody>
              {stableSort(rows, getComparator(order, orderBy))
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, index) => {
                  const isItemSelected = isSelected(row.threadId);
                  const labelId = `enhanced-table-checkbox-${index}`;

                  return (
                    <TableRow
                      hover
                      onClick={event => handleClick(event, row.threadId)}
                      role="checkbox"
                      aria-checked={isItemSelected}
                      tabIndex={-1}
                      key={row.threadId}
                      selected={isItemSelected}
                    >
                      <TableCell
                        className={classes.collumnCB}
                        padding="checkbox"
                      >
                        <Checkbox
                          checked={isItemSelected}
                          inputProps={{ "aria-labelledby": labelId }}
                        />
                      </TableCell>
                      {headCells.map(headCell => (
                        <TableCell
                          className={classes.collumn}
                          align={headCell.numeric ? "right" : "left"}
                        >
                          {row[headCell.id]}
                        </TableCell>
                      ))}
                    </TableRow>
                  );
                })}
              {emptyRows > 0 && (
                <TableRow style={{ height: 33 * emptyRows }}>
                  <TableCell colSpan={headCells.length} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={rows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onChangePage={handleChangePage}
          onChangeRowsPerPage={handleChangeRowsPerPage}
        />
      </Paper>
    </div>
  );
}
