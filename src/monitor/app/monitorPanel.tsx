import * as React from "react";
import MaterialTable from "material-table";
import {
  createStyles,
  lighten,
  makeStyles,
  Theme,
} from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";
import {
  WriteLogIcon,
  DisconnectIcon,
  GroupingIcon,
} from "../helper/monitorIcons";
import { MonitorPanelAction, IMonitorPanelAction } from "../actions";
import IMonitorUser from "../monitorUser";
import SendMessageDialog from "./sendMessageDialog";
import AddBox from "@material-ui/icons/AddBox";
import ArrowDownward from "@material-ui/icons/ArrowDownward";
import Check from "@material-ui/icons/Check";
import ChevronLeft from "@material-ui/icons/ChevronLeft";
import ChevronRight from "@material-ui/icons/ChevronRight";
import Clear from "@material-ui/icons/Clear";
import Delete from "@material-ui/icons/Delete";
import Edit from "@material-ui/icons/Edit";
import FilterList from "@material-ui/icons/FilterList";
import FirstPage from "@material-ui/icons/FirstPage";
import LastPage from "@material-ui/icons/LastPage";
import Remove from "@material-ui/icons/Remove";
import SaveAlt from "@material-ui/icons/SaveAlt";
import Search from "@material-ui/icons/Search";
import ViewColumn from "@material-ui/icons/ViewColumn";
import SpeedIcon from "@material-ui/icons/Speed";
import RefreshIcon from "@material-ui/icons/Refresh";
import LockIcon from "@material-ui/icons/Lock";
import LockOpenIcon from "@material-ui/icons/LockOpen";
import MessageIcon from "@material-ui/icons/Message";
import StopIcon from "@material-ui/icons/Stop";

import {
  HeadCell,
  IConnectionData,
  cellDefaultStyle,
} from "./monitorInterface";
import StopServerDialog from "./stopServerDialog";
import LockServerDialog from "./lockServerDialog";
import UnlockServerDialog from "./unlockServerDialog";
import DisconnectUserDialog from "./disconnectUserDialog";
import SpeedUpdateDialogDialog from "./speedUpdateDialog";
import MonitorTheme from "../helper/theme";
import ErrorBoundary from "../helper/errorBoundary";
import { ServerItem } from "../../serverItemProvider";

const tableIcons = {
  Add: React.forwardRef<SVGSVGElement>((props, ref) => (
    <AddBox {...props} ref={ref} />
  )),
  Check: React.forwardRef<SVGSVGElement>((props, ref) => (
    <Check {...props} ref={ref} />
  )),
  Clear: React.forwardRef<SVGSVGElement>((props, ref) => (
    <Clear {...props} ref={ref} />
  )),
  Delete: React.forwardRef<SVGSVGElement>((props, ref) => (
    <Delete {...props} ref={ref} />
  )),
  DetailPanel: React.forwardRef<SVGSVGElement>((props, ref) => (
    <ChevronRight {...props} ref={ref} />
  )),
  Edit: React.forwardRef<SVGSVGElement>((props, ref) => (
    <Edit {...props} ref={ref} />
  )),
  Export: React.forwardRef<SVGSVGElement>((props, ref) => (
    <SaveAlt {...props} ref={ref} />
  )),
  Filter: React.forwardRef<SVGSVGElement>((props, ref) => (
    <FilterList {...props} ref={ref} />
  )),
  FirstPage: React.forwardRef<SVGSVGElement>((props, ref) => (
    <FirstPage {...props} ref={ref} />
  )),
  LastPage: React.forwardRef<SVGSVGElement>((props, ref) => (
    <LastPage {...props} ref={ref} />
  )),
  NextPage: React.forwardRef<SVGSVGElement>((props, ref) => (
    <ChevronRight {...props} ref={ref} />
  )),
  PreviousPage: React.forwardRef<SVGSVGElement>((props, ref) => (
    <ChevronLeft {...props} ref={ref} />
  )),
  ResetSearch: React.forwardRef<SVGSVGElement>((props, ref) => (
    <Clear {...props} ref={ref} />
  )),
  Search: React.forwardRef<SVGSVGElement>((props, ref) => (
    <Search {...props} ref={ref} />
  )),
  SortArrow: React.forwardRef<SVGSVGElement>((props, ref) => (
    <ArrowDownward {...props} ref={ref} />
  )),
  ThirdStateCheck: React.forwardRef<SVGSVGElement>((props, ref) => (
    <Remove {...props} ref={ref} />
  )),
  ViewColumn: React.forwardRef<SVGSVGElement>((props, ref) => (
    <ViewColumn {...props} ref={ref} />
  )),
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
  { field: "clientType", title: "Tipo Conexão", ...cellDefaultStyle },
];

const useToolbarStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      paddingLeft: theme.spacing(1),
      paddingRight: theme.spacing(1),
    },
    highlight:
      theme.palette.type === "light"
        ? {
            color: theme.palette.secondary.main,
            backgroundColor: lighten(theme.palette.secondary.light, 0.85),
          }
        : {
            color: theme.palette.text.primary,
            backgroundColor: theme.palette.secondary.dark,
          },
    title: {
      fontSize: "180%",
      fontWeight: "bold",
    },
    subtitle: {
      color: "silver",
    },
    upperCase: {
      textTransform: "uppercase",
    },
    toolbarButtons: {
      marginLeft: "auto",
    },
    chips: {
      display: "flex",
      flexWrap: "wrap",
    },
    chip: {
      margin: 2,
    },
  })
);

interface IMonitorPanel {
  speed: any;
  vscode: any;
  targetServer: ServerItem[];
}

let listener = undefined;

interface ITitleProps {
  title: string;
  subtitle: string;
}

function Title(props: ITitleProps) {
  const style = useToolbarStyles();

  return (
    <>
      <div className={style.title}>{props.title}</div>
      <div className={style.subtitle}>{props.subtitle}</div>
    </>
  );
}

export default function MonitorPanel(props: IMonitorPanel) {
  const [grouping, setGrouping] = React.useState(false);
  const [filtering, setFiltering] = React.useState(false);
  const [selected, setSelected] = React.useState<IConnectionData[]>([]);
  const [speed, setSpeed] = React.useState(props.speed);
  const [rows, setRows] = React.useState([]);
  const [subtitle, setSubtitle] = React.useState(props.targetServer.length?props.targetServer[0].name:"");

  const [openDialog, setOpenDialog] = React.useState({
    lockServer: false,
    unlockServer: false,
    stopServer: false,
    sendMessage: false,
    disconnectUser: false,
    speedUpdate: false,
  });

  const [targetRow, setTargetRow] = React.useState(null);

  if (listener === undefined) {
    listener = (event: MessageEvent) => {
      const message = event.data; // The JSON data our extension sent

      switch (message.command) {
        case MonitorPanelAction.SetSpeedUpdate: {
          setSpeed(message.data);

          break;
        }
        case MonitorPanelAction.UpdateUsers: {
          const result = message.data.users as IMonitorUser[];

          setRows(result);
          setSubtitle(message.data.serverName);
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

  const handleSpeedButtonChange = () => {
    event.preventDefault();

    setOpenDialog({ ...openDialog, speedUpdate: true });
  };

  const handleRefreshButtonChange = () => {
    event.preventDefault();

    let command: IMonitorPanelAction = {
      action: MonitorPanelAction.UpdateUsers,
      content: { server: props.targetServer },
    };

    props.vscode.postMessage(command);
  };

  if (!props.targetServer) {
    return <Typography>Inicializando...</Typography>;
  }

  const handleLockButtonClick = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    event.preventDefault();

    setTargetRow(null);
    setOpenDialog({ ...openDialog, lockServer: true });
  };

  const doLockServer = (confirm: boolean) => {
    setTargetRow(null);
    setOpenDialog({ ...openDialog, lockServer: false });

    if (confirm) {
      let command: IMonitorPanelAction = {
        action: MonitorPanelAction.LockServer,
        content: { server: props.targetServer, lock: true },
      };
      props.vscode.postMessage(command);
    }
  };

  const doUnlockServer = (confirm: boolean) => {
    setOpenDialog({ ...openDialog, unlockServer: true });

    if (confirm) {
      let command: IMonitorPanelAction = {
        action: MonitorPanelAction.LockServer,
        content: { server: props.targetServer, lock: false },
      };
      props.vscode.postMessage(command);
    }
  };

  const doSpeedUpdate = (confirm: boolean, speed: number) => {
    setOpenDialog({ ...openDialog, speedUpdate: false });

    if (confirm) {
      let command: IMonitorPanelAction = {
        action: MonitorPanelAction.SetSpeedUpdate,
        content: { speed: speed },
      };

      props.vscode.postMessage(command);
    }
  };

  const handleUnlockButtonClick = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    event.preventDefault();

    setTargetRow(null);
    setOpenDialog({ ...openDialog, unlockServer: false });
  };

  const handleStopButtonClick = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    event.preventDefault();

    setTargetRow(null);
    setOpenDialog({ ...openDialog, stopServer: true });
  };

  const doStopServer = (killNow: boolean) => {
    setTargetRow(null);
    setOpenDialog({ ...openDialog, stopServer: false });

    let command: IMonitorPanelAction = {
      action: MonitorPanelAction.StopServer,
      content: { server: props.targetServer, killNow: killNow },
    };

    props.vscode.postMessage(command);
  };

  const handleSendMessageButtonClick = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    row: any
  ) => {
    event.preventDefault();

    setTargetRow(row);
    setOpenDialog({ ...openDialog, sendMessage: true });
  };

  const handleDisconnectUserButtonClick = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    row: any
  ) => {
    event.preventDefault();

    setTargetRow(row);
    setOpenDialog({ ...openDialog, disconnectUser: true });
  };

  const doDisconnectUser = (
    confirmed: boolean,
    killNow: boolean,
    recipients: any[]
  ) => {
    event.preventDefault();

    setTargetRow(null);
    setOpenDialog({ ...openDialog, disconnectUser: false });

    if (confirmed) {
      let command: IMonitorPanelAction = {
        action: MonitorPanelAction.KillConnection,
        content: {
          server: props.targetServer,
          recipients: recipients,
          killnow: killNow,
        },
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

    setTargetRow(null);
    setOpenDialog({ ...openDialog, sendMessage: false });

    if (confirmed) {
      let command: IMonitorPanelAction = {
        action: MonitorPanelAction.SendMessage,
        content: {
          server: props.targetServer,
          recipients: recipients,
          message: message,
        },
      };

      props.vscode.postMessage(command);
    }
  };

  const handleWriteLogButtonClick = () => {
    let command: IMonitorPanelAction = {
      action: MonitorPanelAction.ToggleWriteLogServer,
      content: { server: props.targetServer },
    };

    props.vscode.postMessage(command);
  };

  const actions = [];

  const locked = false;
  if (!locked) {
    actions.push({
      icon: () => <LockIcon />,
      tooltip: "Lock server",
      isFreeAction: true,
      onClick: (event: any) => handleLockButtonClick(event),
    });
  } else {
    actions.push({
      icon: () => <LockOpenIcon />,
      tooltip: "Unlock server",
      isFreeAction: true,
      onClick: (event: any) => handleUnlockButtonClick(event),
    });
  }

  actions.push({
    icon: () => <MessageIcon />,
    tooltip: "Send message to all users",
    isFreeAction: true,
    onClick: (event: any) => handleSendMessageButtonClick(event, null),
  });

  actions.push({
    icon: () => <MessageIcon />,
    tooltip: "Send message to selected users",
    isFreeAction: false,
    onClick: (event: any, row: any) => handleSendMessageButtonClick(event, row),
  });

  actions.push({
    icon: () => <DisconnectIcon />,
    tooltip: "Disconnect all users",
    isFreeAction: true,
    onClick: (event: any) => handleDisconnectUserButtonClick(event, null),
  });

  actions.push({
    icon: () => <DisconnectIcon />,
    tooltip: "Disconnect selectd users",
    isFreeAction: false,
    onClick: (event: any) => handleDisconnectUserButtonClick(event, rows),
  });

  actions.push({
    icon: () => <StopIcon />,
    tooltip: "Stop server",
    isFreeAction: true,
    onClick: (event: any) => handleStopButtonClick(event),
  });

  actions.push({
    icon: () => <WriteLogIcon />,
    tooltip: "Write log",
    isFreeAction: true,
    onClick: () => handleWriteLogButtonClick(),
  });

  actions.push({
    icon: () => <GroupingIcon />,
    tooltip: "Grouping on/off",
    isFreeAction: true,
    onClick: () => setGrouping(!grouping),
  });

  actions.push({
    icon: () => <FilterList />,
    tooltip: "Filtering on/off",
    isFreeAction: true,
    onClick: () => setFiltering(!filtering),
  });

  actions.push({
    icon: () => <SpeedIcon />,
    tooltip: "Update speed",
    isFreeAction: true,
    onClick: () => handleSpeedButtonChange(),
  });

  actions.push({
    icon: () => <RefreshIcon />,
    tooltip: "Refresh data",
    isFreeAction: true,
    onClick: () => handleRefreshButtonChange(),
  });

  return (
    <ErrorBoundary>
      <MonitorTheme>
        <Paper variant="outlined">
          <MaterialTable
            icons={tableIcons}
            columns={headCells}
            data={rows}
            title={
              <Title title={"Monitor"} subtitle={subtitle} />
            }
            options={{
              selection: true,
              grouping: grouping,
              filtering: filtering,
              exportButton: false,
              exportCsv: () => {},
              padding: "dense",
              actionsColumnIndex: 0,
            }}
            onSelectionChange={(rows) => setSelected(rows)}
            onRowClick={(evt, selectedRow) => this.setState({ selectedRow })}
            actions={actions}
          />
        </Paper>

        <SendMessageDialog
          open={openDialog.sendMessage}
          recipients={
            selected.length > 0 ? selected : targetRow ? targetRow : rows
          }
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

        <SpeedUpdateDialogDialog
          speed={speed}
          open={openDialog.speedUpdate}
          onClose={doSpeedUpdate}
        />
      </MonitorTheme>
    </ErrorBoundary>
  );
}
