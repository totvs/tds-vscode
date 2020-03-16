import React, { forwardRef } from "react";
import MaterialTable from "material-table";
import {
  createStyles,
  lighten,
  makeStyles,
  Theme
} from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";
import {
  LockIcon,
  UnlockIcon,
  MessageIcon,
  GroupingIcon,
  StopIcon,
  WriteLogIcon,
  DisconnectIcon
} from "./monitorIcons";
import { CommandAction, ICommand } from "../command";
import IMonitorUser from "../monitorUser";
import SendMessageDialog from "./sendMessageDialog";
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
import {
  HeadCell,
  IConnectionData,
  cellDefaultStyle
} from "./monitorInterface";
import StopServerDialog from "./stopServerDialog";
import LockServerDialog from "./lockServerDialog";
import UnlockServerDialog from "./unlockServerDialog";
import DisconnectUserDialog from "./disconnectUserDialog";

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

const headCells: HeadCell[] = [
  { field: "server", title: "Servidor", ...cellDefaultStyle },
  { field: "environment", title: "Ambiente", ...cellDefaultStyle },
  { field: "username", title: "Usuário", ...cellDefaultStyle },
  { field: "computerName", title: "Estação", ...cellDefaultStyle },
  { field: "threadId", title: "Thread", ...cellDefaultStyle },
  { field: "mainName", title: "Programa", ...cellDefaultStyle },
  { field: "loginTime", title: "Conexão", ...cellDefaultStyle },
  { field: "elapsedTime", title: "Tempo Decorrido", ...cellDefaultStyle },
  { field: "inactiveTime", title: "Tempo Inatividade", ...cellDefaultStyle },
  { field: "totalInstrCount", title: "Total Instruções", ...cellDefaultStyle },
  { field: "instrCountPerSec", title: "Instruções/seg", ...cellDefaultStyle },
  { field: "remark", title: "Comentário", ...cellDefaultStyle },
  { field: "memUsed", title: "Memória em Uso", ...cellDefaultStyle },
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
  locked?: boolean;
}

let listener = undefined;


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
  const [grouping, setGrouping] = React.useState(false);
  const [filtering, setFiltering] = React.useState(false);
  const [selected, setSelected] = React.useState<IConnectionData[]>([]);
  const [, setSpeed] = React.useState<number>(0);
  const [timer, setTimer] = React.useState<number>();
  const [rows, setRows] = React.useState([]);
  const [openDialog, setOpenDialog] = React.useState({
    lockServer: false,
    unlockServer: false,
    stopServer: false,
    sendMessage: false,
    disconnectUser: false
  });

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

  const handleLockButtonClick = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>  ) => {
    event.preventDefault();

    setOpenDialog({ ...openDialog, lockServer: true });
  };

  const doLockServer = (confirm: boolean) => {
    setOpenDialog({ ...openDialog, lockServer: false });

    if (confirm) {
      let command: ICommand = {
        action: CommandAction.LockServer,
        content: { server: props.targetServer, lock: true }
      };
      props.vscode.postMessage(command);
    }
  };

  const doUnlockServer = (confirm: boolean) => {
    setOpenDialog({ ...openDialog, unlockServer: true });

    if (confirm) {
      let command: ICommand = {
        action: CommandAction.LockServer,
        content: { server: props.targetServer, lock: false }
      };
      props.vscode.postMessage(command);
    }
  };

  const handleUnlockButtonClick = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>  ) => {
    event.preventDefault();
    setOpenDialog({ ...openDialog, unlockServer: false });
  };

  const handleStopButtonClick = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    event.preventDefault();
    setOpenDialog({ ...openDialog, stopServer: true });
  };

  const doStopServer = (killNow: boolean) => {
    setOpenDialog({ ...openDialog, stopServer: false });

    let command: ICommand = {
      action: CommandAction.StopServer,
      content: { server: props.targetServer, killNow: killNow }
    };

    props.vscode.postMessage(command);
  };

  const handleSendMessageButtonClick = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>  ) => {
    event.preventDefault();
    setOpenDialog({ ...openDialog, sendMessage: true });
  };

  const handleDisconnectUserButtonClick = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    event.preventDefault();
    setOpenDialog({ ...openDialog, disconnectUser: true });
  };

  const doDisconnectUser = (
    confirmed: boolean,
    killNow: boolean,
    recipients: any[]
  ) => {
    event.preventDefault();
    setOpenDialog({ ...openDialog, disconnectUser: false });

    if (confirmed) {
      let command: ICommand = {
        action: CommandAction.KillConnection,
        content: {
          server: props.targetServer,
          recipients: recipients,
          killnow: killNow
        }
      };

      props.vscode.postMessage(command);
    }
  };

  const doSendMessage = (
    confirmed: boolean,
    message: string,
    recipients: any[]
  ) => {
    event.preventDefault();
    setOpenDialog({ ...openDialog, sendMessage: false });

    if (confirmed) {
      let command: ICommand = {
        action: CommandAction.SendMessage,
        content: {
          server: props.targetServer,
          recipients: recipients,
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



  const actions = [];
  if (!props.locked) {
    actions.push({
      icon: () => <LockIcon />,
      tooltip: "Lock server",
      isFreeAction: true,
      onClick: (event: any) => handleLockButtonClick(event)
    });
  } else {
    actions.push({
      icon: () => <UnlockIcon />,
      tooltip: "Unlock server",
      isFreeAction: true,
      onClick: (event: any) => handleUnlockButtonClick(event)
    });
  }

  actions.push({
    icon: () => <MessageIcon />,
    tooltip: "Send message to all users",
    isFreeAction: true,
    onClick: (event: any) => handleSendMessageButtonClick(event)
  });

  actions.push({
    icon: () => <MessageIcon />,
    tooltip: "Send message to selected users",
    isFreeAction: false,
    onClick: (event: any) => handleSendMessageButtonClick(event)
  });

  actions.push({
    icon: () => <DisconnectIcon />,
    tooltip: "Disconnect user",
    isFreeAction: true,
    onClick: (event: any) => handleDisconnectUserButtonClick(event)
  });

  actions.push({
    icon: () => <StopIcon />,
    tooltip: "Stop server",
    isFreeAction: true,
    onClick: (event: any) => handleStopButtonClick(event)
  });

  actions.push({
    icon: () => <WriteLogIcon />,
    tooltip: "Write log",
    isFreeAction: true,
    onClick: () => handleWriteLogButtonClick()
  });

  actions.push({
    icon: () => <GroupingIcon />,
    tooltip: "Grouping on/off",
    isFreeAction: true,
    onClick: () => setGrouping(!grouping)
  });

  actions.push({
    icon: () => <FilterList />,
    tooltip: "Filtering on/off",
    isFreeAction: true,
    onClick: () => setFiltering(!filtering)
  });

  return (
    <div >
      <Paper>
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
            exportCsv: () => {}
          }}
          onSelectionChange={rows => setSelected(rows)}
          onRowClick={(evt, selectedRow) => this.setState({ selectedRow })}
          actions={actions}
        />
      </Paper>

      <SendMessageDialog
        open={openDialog.sendMessage}
        recipients={selected.length === 0 ? rows : selected}
        onClose={doSendMessage}
      />

      <DisconnectUserDialog
        open={openDialog.disconnectUser}
        recipients={selected.length === 0 ? rows : selected}
        onClose={doDisconnectUser}
      />

      <StopServerDialog open={openDialog.stopServer} onClose={doStopServer} />

      <LockServerDialog open={openDialog.lockServer} onClose={doLockServer} />

      <UnlockServerDialog
        open={openDialog.unlockServer}
        onClose={doUnlockServer}
      />
    </div>
  );
}
