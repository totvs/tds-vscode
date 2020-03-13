import React, { forwardRef } from "react";
import MaterialTable, { MTableToolbar } from "material-table";
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
  GroupingIcon,
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
  Button,
  Chip
} from "@material-ui/core";
import AddBox from "@material-ui/icons/AddBox";
import ArrowDownward from "@material-ui/icons/ArrowDownward";
import Check from "@material-ui/icons/Check";
import ChevronLeft from "@material-ui/icons/ChevronLeft";
import ChevronRight from "@material-ui/icons/ChevronRight";
import Clear from "@material-ui/icons/Clear";
import DeleteOutline from "@material-ui/icons/DeleteOutline";
import Edit from "@material-ui/icons/Edit";
import FilterList from "@material-ui/icons/FilterList";
import FirstPage from "@material-ui/icons/FirstPage";
import LastPage from "@material-ui/icons/LastPage";
import Remove from "@material-ui/icons/Remove";
import SaveAlt from "@material-ui/icons/SaveAlt";
import Search from "@material-ui/icons/Search";
import ViewColumn from "@material-ui/icons/ViewColumn";

const tableIcons = {
  Add: forwardRef<SVGSVGElement>((props, ref) => (
    <AddBox {...props} ref={ref} />
  )),
  Check: forwardRef<SVGSVGElement>((props, ref) => (
    <Check {...props} ref={ref} />
  )),
  Clear: forwardRef<SVGSVGElement>((props, ref) => (
    <Clear {...props} ref={ref} />
  )),
  Delete: forwardRef<SVGSVGElement>((props, ref) => (
    <DeleteOutline {...props} ref={ref} />
  )),
  DetailPanel: forwardRef<SVGSVGElement>((props, ref) => (
    <ChevronRight {...props} ref={ref} />
  )),
  Edit: forwardRef<SVGSVGElement>((props, ref) => (
    <Edit {...props} ref={ref} />
  )),
  Export: forwardRef<SVGSVGElement>((props, ref) => (
    <SaveAlt {...props} ref={ref} />
  )),
  Filter: forwardRef<SVGSVGElement>((props, ref) => (
    <FilterList {...props} ref={ref} />
  )),
  FirstPage: forwardRef<SVGSVGElement>((props, ref) => (
    <FirstPage {...props} ref={ref} />
  )),
  LastPage: forwardRef<SVGSVGElement>((props, ref) => (
    <LastPage {...props} ref={ref} />
  )),
  NextPage: forwardRef<SVGSVGElement>((props, ref) => (
    <ChevronRight {...props} ref={ref} />
  )),
  PreviousPage: forwardRef<SVGSVGElement>((props, ref) => (
    <ChevronLeft {...props} ref={ref} />
  )),
  ResetSearch: forwardRef<SVGSVGElement>((props, ref) => (
    <Clear {...props} ref={ref} />
  )),
  Search: forwardRef<SVGSVGElement>((props, ref) => (
    <Search {...props} ref={ref} />
  )),
  SortArrow: forwardRef<SVGSVGElement>((props, ref) => (
    <ArrowDownward {...props} ref={ref} />
  )),
  ThirdStateCheck: forwardRef<SVGSVGElement>((props, ref) => (
    <Remove {...props} ref={ref} />
  )),
  ViewColumn: forwardRef<SVGSVGElement>((props, ref) => (
    <ViewColumn {...props} ref={ref} />
  ))
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

interface HeadCell {
  field: keyof IConnectionData;
  title: string;
  cellStyle?: any;
  numeric?: any;
  headerStyle?: any;
}

const cellDefaultStyle = {
  cellStyle: {
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
    maxWidth: "30em",
    minWidth: "8em"
  },
  headerStyle: {
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
    maxWidth: "30em",
    minWidth: "8em"
  }
};

const headCells: HeadCell[] = [
  { field: "server", title: "Servidor", ...cellDefaultStyle },
  { field: "environment", title: "Ambiente", ...cellDefaultStyle },
  { field: "username", title: "Usuário", ...cellDefaultStyle },
  { field: "computerName", title: "Estação", ...cellDefaultStyle },
  { field: "threadId", title: "Thread", numeric: true, ...cellDefaultStyle },
  { field: "mainName", title: "Programa", ...cellDefaultStyle },
  { field: "loginTime", title: "Conexão", ...cellDefaultStyle },
  { field: "elapsedTime", title: "Tempo Decorrido", ...cellDefaultStyle },
  { field: "inactiveTime", title: "Tempo Inatividade", ...cellDefaultStyle },
  {
    field: "totalInstrCount",
    title: "Total Instruções",
    numeric: true,
    ...cellDefaultStyle
  },
  {
    field: "instrCountPerSec",
    title: "Instruções/seg",
    numeric: true,
    ...cellDefaultStyle
  },
  { field: "remark", title: "Comentário", ...cellDefaultStyle },
  {
    field: "memUsed",
    title: "Memória em Uso",
    numeric: true,
    ...cellDefaultStyle
  },
  { field: "sid", title: "SID", ...cellDefaultStyle },
  { field: "ctreeTaskId", title: "CTree ID", ...cellDefaultStyle },
  { field: "clientType", title: "Tipo Conexão", ...cellDefaultStyle }
];

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

/*  return (
    <div className={classes.toolbarButtons}>
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
    </div>
  );
*/

interface IMonitorPanel {
  vscode: any;
  targetServer: any;
  titles: string[];
}

let listener = undefined;

interface CustomActionsProps {
  vscode: any;
  targetServer: any;
  speed: number;
  lockServer: boolean;
}

function customActions(props: CustomActionsProps): any[] {
  const handleLockButtonClick = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    args?: any
  ) => {
    event.preventDefault();
    const id = event.currentTarget.id;

    let command: ICommand = {
      action: CommandAction.LockServer,
      content: { server: props.targetServer, lock: id === "btnLockServer" }
    };

    props.vscode.postMessage(command);
  };

  const handleSendMessageButtonClick = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    event.preventDefault();
    //setOpenSendMessageDialog(true);
  };

  const handleDisconnectUserButtonClick = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    event.preventDefault();
    //setDisconnectUserDialog(true);
  };

  const handleStopButtonClick = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    event.preventDefault();
    //setOpenStopServerDialog(true);
  };

  const handleCloseStopServerDialog = (event: any, reason: string) => {
    console.log("handleCloseStopServerDialog " + reason);

    if (reason === "_YES_") {
      let command: ICommand = {
        action: CommandAction.StopServer,
        content: {
          server: props.targetServer
        }
      };

      props.vscode.postMessage(command);
    }

    //setOpenStopServerDialog(false);
  };

  const doDisconnectUser = (confirmed: boolean, killNow: boolean) => {
    event.preventDefault();

    //setDisconnectUserDialog(false);

    if (confirmed) {
      let command: ICommand = {
        action: CommandAction.KillConnection,
        content: {
          server: props.targetServer,
          recipients: [], //selecteds,
          killnow: killNow
        }
      };

      props.vscode.postMessage(command);
    }
  };

  const doSendMessage = (confirmed: boolean, message: string) => {
    event.preventDefault();
    //setOpenSendMessageDialog(false);

    if (confirmed) {
      let command: ICommand = {
        action: CommandAction.SendMessage,
        content: {
          server: props.targetServer,
          recipients: [], //selecteds,
          message: message
        }
      };

      props.vscode.postMessage(command);
    }
  };

  const handleWriteLogButtonClick = () => {
    let command: ICommand = {
      action: CommandAction.ToggleWriteLogServer,
      content: { server: props.targetServer }
    };

    props.vscode.postMessage(command);
  };

  const speeds = [0, 5, 10, 30];
  const handleSpeedButtonChange = (index: number) => {
    let command: ICommand = {
      action: CommandAction.SetSpeedUpdate,
      content: { speed: speeds[index], server: props.targetServer }
    };

    props.vscode.postMessage(command);
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

  return [
    props.lockServer
      ? {
          icon: () => <LockIcon />,
          tooltip: "Lock server",
          isFreeAction: true,
          onClick: (event: any) => handleLockButtonClick(event)
        }
      : {
          icon: "UnlockIcon",
          tooltip: "Unlock server",
          isFreeAction: true,
          onClick: (event: any) => handleLockButtonClick(event)
        },
    {
      icon: () => <MessageIcon />,
      tooltip: "Send message to users",
      isFreeAction: false,
      onClick: (event: any) => handleSendMessageButtonClick(event)
    },
    {
      icon: () => <DisconnectIcon /> ,
      tooltip: "Disconnect user",
      isFreeAction: false,
      onClick: (event: any) => handleDisconnectUserButtonClick(event)
    },
    {
      icon: () => <StopIcon />,
      tooltip: "Stop server",
      isFreeAction: false,
      onClick: (event: any) => handleStopButtonClick(event)
    },
    {
      icon: () => <WriteLogIcon />,
      tooltip: "Write log",
      isFreeAction: false,
      onClick: (event: any) => handleWriteLogButtonClick()
    }
  ];
}

/*
  <SpeedButton
    options={speedOptions}
    callback={handleSpeedButtonChange}
    value={speeds.indexOf(speed)}
  />
*/

interface ITitleProps {
  title: string;
  subtitle: string;
}

function Title(props: ITitleProps) {
  const style = useToolbarStyles();

  return (
    <React.Fragment>
      <span className={style.title}>{props.title}</span>{" "}
      <span className={style.subtitle}>{props.subtitle}</span>
    </React.Fragment>
  );
}

export default function MonitorPanel(props: IMonitorPanel) {
  const classes = useStyles();
  const [grouping, setGrouping] = React.useState(false);
  const [filtering, setFiltering] = React.useState(false);
  const [selected, setSelected] = React.useState<string[]>([]);
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

  if (!props.targetServer) {
    return <Typography>Inicializando...</Typography>;
  }

  const actions = customActions({
    vscode: props.vscode,
    targetServer: props.targetServer,
    speed: speed,
    lockServer: lock
  });

  actions.push({
    icon: () => <GroupingIcon />,
    tooltip: "Grouping on/off",
    isFreeAction: true,
    onClick: (event: any) => setGrouping(!grouping)
  });

  actions.push({
    icon: () => <FilterList />,
    tooltip: "Filtering on/off",
    isFreeAction: true,
    onClick: (event: any) => setFiltering(!filtering)
  });

  return (
    <div className={classes.root}>
      <Paper className={classes.paper}>
        <MaterialTable
          icons={tableIcons}
          columns={headCells}
          data={rows}
          title={<Title title={props.titles[0]} subtitle={props.titles[1]} />}
          options={{
            selection: true,
            grouping: grouping,
            filtering: filtering,
            exportButton: false,
            exportCsv: (columns, data) => {}
          }}
          onSelectionChange={rows => setSelected(rows)}
          onRowClick={(evt, selectedRow) => this.setState({ selectedRow })}
          actions={actions}
        />
      </Paper>
    </div>
  );
}
