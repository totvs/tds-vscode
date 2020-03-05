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
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Switch from "@material-ui/core/Switch";
import DeleteIcon from "@material-ui/icons/Delete";
import GroupIcon from "@material-ui/icons/Group";
import GroupSharpIcon from "@material-ui/icons/GroupSharp";
import FilterListIcon from "@material-ui/icons/FilterList";
import {
  LockIcon,
  MessageIcon,
  AgroupIcon,
  SettingsIcon,
  StopIcon,
  WriteLogIcon,
  Speed0Icon,
  Speed5Icon,
  Speed10Icon,
  Speed30Icon
} from "./monitorIcons";
import { CommandAction, ICommand } from "../command";
import { Select, MenuItem, Chip } from "@material-ui/core";
import IMonitorUser from "../monitorUser";

interface Data {
  server: string;
  environment: string;
  machine: string;
  threadID: number;
  userServer: string;
  program: string;
  conexoes: number;
  timeElapsed: string;
  directions: number;
  directionsSeconds: number;
  observation: string;
  memory: number;
  sid: string;
  rpo: string;
  inactivity: number;
  connectionType: string;
}

function createData(data: any): Data {
  //data["loginTime"]
  //data["ctreeTaskId"]
  return {
    server: data["server"],
    environment: data["environment"],
    machine: data["computerName"],
    threadID: data["threadId"],
    userServer: data["username"],
    program: data["mainName"],
    conexoes: 0,
    timeElapsed: data["elapsedTime"],
    directions: data["totalInstrCount"],
    directionsSeconds: data["instrCountPerSec"],
    observation: data["remark"],
    memory: data["memUsed"],
    sid: data["sid"],
    rpo: "",
    inactivity: data["inactiveTime"],
    connectionType: data["clientType"]
  };
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
  disablePadding: boolean;
  id: keyof Data;
  label: string;
  numeric: boolean;
  //format: (value: number) => {value.toFixed(2)};
}

const headCells: HeadCell[] = [
  { id: "server", numeric: false, disablePadding: false, label: "Servidor" },
  {
    id: "environment",
    numeric: false,
    disablePadding: false,
    label: "Ambiente"
  },
  { id: "machine", numeric: false, disablePadding: false, label: "Máquina" },
  {
    id: "threadID",
    numeric: false,
    disablePadding: false,
    label: "Thread ID"
  },
  {
    id: "userServer",
    numeric: false,
    disablePadding: false,
    label: "Usuário"
  },
  { id: "program", numeric: false, disablePadding: false, label: "Programa" },
  { id: "conexoes", numeric: false, disablePadding: false, label: "Conexões" },
  {
    id: "timeElapsed",
    numeric: false,
    disablePadding: false,
    label: "Tempo Decorrido"
  },
  {
    id: "directions",
    numeric: false,
    disablePadding: false,
    label: "Instrucoes"
  },
  {
    id: "directionsSeconds",
    numeric: false,
    disablePadding: false,
    label: "Instrucoes/seg"
  },
  {
    id: "observation",
    numeric: false,
    disablePadding: false,
    label: "Observações"
  },
  { id: "memory", numeric: false, disablePadding: false, label: "Memória" },
  { id: "sid", numeric: false, disablePadding: false, label: "SID" },
  { id: "rpo", numeric: false, disablePadding: false, label: "RPO" },
  {
    id: "inactivity",
    numeric: false,
    disablePadding: false,
    label: "Tempo de Inatividade"
  },
  {
    id: "connectionType",
    numeric: false,
    disablePadding: false,
    label: "Tipo de Conexao"
  }
];

interface EnhancedTableProps {
  classes: ReturnType<typeof useStyles>;
  numSelected: number;
  onRequestSort: (
    event: React.MouseEvent<unknown>,
    property: keyof Data
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
  const createSortHandler = (property: keyof Data) => (
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
            padding={headCell.disablePadding ? "none" : "default"}
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
      paddingLeft: theme.spacing(2),
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
}

const EnhancedTableToolbar = (props: EnhancedTableToolbarProps) => {
  const classes = useToolbarStyles();
  const { numSelected, title, subtitle, speed } = props;

  const handleButtonClick = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    args?: any
  ) => {
    event.preventDefault();
    const id = event.currentTarget.id;

    console.log(event.currentTarget.tagName + " " + event.currentTarget.id); // alerts BUTTON
  };

  const handleSpeedButtonChange = (
    event: React.ChangeEvent<{ name?: string; value: unknown }>
  ) => {
    event.preventDefault();

    let command: ICommand = {
      action: CommandAction.SetSpeedUpdate,
      content: { value: Number.parseInt(event.target.value as string) }
    };

    props.vscode.postMessage(command);
  };

  return (
    <Toolbar
      variant="dense"
      className={clsx(classes.root, {
        [classes.highlight]: numSelected > 0
      })}
    >
      <Typography className={classes.title} variant="h6" id="tableTitle">
        <span className={classes.upperCase}>{title}</span>&nbsp;
        <span className={classes.subtitle}>{subtitle}</span>
      </Typography>

      <div className={classes.toolbarButtons}>
        <Tooltip title="Bloquear novas conexões">
          <IconButton id="btnLockServer" onClick={handleButtonClick}>
            <LockIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="Enviar mensagem aos usuários">
          <IconButton id="btnSendMessage" onClick={handleButtonClick}>
            <MessageIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="Desconectar usuário">
          <IconButton id="btnDesconnectUser" onClick={handleButtonClick}>
            <DeleteIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="Para o servidor">
          <IconButton id="btnStopServer" onClick={handleButtonClick}>
            <StopIcon />
          </IconButton>
        </Tooltip>

        <Select
          id="btnSpeedButton"
          value={speed}
          onChange={event => handleSpeedButtonChange(event)}
        >
          <MenuItem value="0" key="0">
            <Tooltip title="Por solicitação">
              <IconButton size="small">
                <Speed0Icon />
              </IconButton>
            </Tooltip>
          </MenuItem>
          <MenuItem value="5" key="5">
            <Tooltip title="A cada 5 segundos">
              <IconButton size="small">
                <Speed5Icon />
              </IconButton>
            </Tooltip>
          </MenuItem>
          <MenuItem value="10" key="10">
            <Tooltip title="A cada 10 segundos">
              <IconButton size="small">
                <Speed10Icon />
              </IconButton>
            </Tooltip>
          </MenuItem>
          <MenuItem value="30" key="30">
            <Tooltip title="A cada 30 segundos">
              <IconButton size="small">
                <Speed30Icon />
              </IconButton>
            </Tooltip>
          </MenuItem>
        </Select>

        <Tooltip title="Gravar monitor">
          <IconButton id="btnWriteLog" onClick={handleButtonClick}>
            <WriteLogIcon />
          </IconButton>
        </Tooltip>

        <Tooltip title="Agrupar">
          <IconButton id="btnAgroup" onClick={handleButtonClick}>
            <AgroupIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="Configurar">
          <IconButton id="btnSettings" onClick={handleButtonClick}>
            <SettingsIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="Filtro">
          <IconButton id="btnFilterList" onClick={handleButtonClick}>
            <FilterListIcon />
          </IconButton>
        </Tooltip>
      </div>
    </Toolbar>
  );
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
    }
  })
);

interface IMonitorPanel {
  vscode: any;
  server: IMonitorServer;
}

let listener = undefined;

export default function MonitorPanel(props: IMonitorPanel) {
  const classes = useStyles();
  const server = props.server;

  if (!server) {
    return <Typography>Carregando...</Typography>;
  }

  const [order, setOrder] = React.useState<Order>("asc");
  const [orderBy, setOrderBy] = React.useState<keyof Data>("server");
  const [selected, setSelected] = React.useState<string[]>([]);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [speed, setSpeed] = React.useState<number>(0);
  const [timer, setTimer] = React.useState<number>(0);
  const [rows, setRows] = React.useState([]);

  const updateUsers = (server: IMonitorServer) => {
    window.clearInterval(timer);

    let command: ICommand = {
      action: CommandAction.UpdateUsers,
      content: server
    };

    props.vscode.postMessage(command);
  };

  if (listener === undefined) {
    listener = (event: MessageEvent) => {
      const message = event.data; // The JSON data our extension sent
      switch (message.command) {
        case CommandAction.SetSpeedUpdate: {
          setSpeed(message.data);

          if (message.data > 0) {
            setTimer(window.setInterval(updateUsers, message.data, server));
          } else {
            window.clearInterval(timer);
          }

          break;
        }
        case CommandAction.UpdateUsers: {
          const result = message.data as IMonitorUser[];

          console.log("listener: updateUsers");
          console.log(result.length);
          let users = [];

          for (let index = 0; index < result.length; index++) {
            const element = result[index];
            element["server"] = server.name;
            users.push(createData(element));
          }

          setRows(users);

          break;
        }
        default:
          console.log("***** ATENÇÃO: monitorPanel.tsx");
          console.log("\tComando não reconhecido: " + message.command);
          break;
      }
    };

    window.addEventListener("message", listener);
    updateUsers(server);
  }

  const handleRequestSort = (
    event: React.MouseEvent<unknown>,
    property: keyof Data
  ) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelecteds = rows.map(n => n.name);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event: React.MouseEvent<unknown>, name: string) => {
    const selectedIndex = selected.indexOf(name);
    let newSelected: string[] = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
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

  const isSelected = (name: string) => selected.indexOf(name) !== -1;

  const emptyRows =
    rowsPerPage - Math.min(rowsPerPage, rows.length - page * rowsPerPage);

  return (
    <div className={classes.root}>
      <Paper className={classes.paper}>
        <EnhancedTableToolbar
          numSelected={selected.length}
          title={server.name}
          subtitle={server.address + ":" + server.port}
          speed={speed}
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
                  const isItemSelected = isSelected(row.name);
                  const labelId = `enhanced-table-checkbox-${index}`;

                  return (
                    <TableRow
                      hover
                      onClick={event => handleClick(event, row.name)}
                      role="checkbox"
                      aria-checked={isItemSelected}
                      tabIndex={-1}
                      key={row.name}
                      selected={isItemSelected}
                    >
                      <TableCell padding="checkbox">
                        <Checkbox
                          checked={isItemSelected}
                          inputProps={{ "aria-labelledby": labelId }}
                        />
                      </TableCell>
                      {headCells.map(headCell => (
                        <TableCell>
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
