import * as React from "react";
import MaterialTable, { Column } from "material-table";
import {
  createStyles,
  lighten,
  makeStyles,
  Theme,
} from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import {
  DisconnectIcon,
  GroupingIcon,
  monitorIcons,
} from "../helper/monitorIcons";
import { MonitorPanelAction, IMonitorPanelAction } from "../actions";
import IMonitorUser from "../monitorUser";
import SendMessageDialog from "./sendMessageDialog";
import FilterList from "@material-ui/icons/FilterList";
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

function isHidden(propColumns: any, field: string): boolean {
  return propColumns[field].hidden;
}

function fieldDef(field: string, title: string): any {
  return { field: field, title: title, ...cellDefaultStyle };
}

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
  memento: Memento,
  speed: any;
  vscode: any;
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

const propPageSize = (value: number = undefined) => {
  return {
    props: {
      options: {
        pageSize: value,
      },
    },
  };
};

const propGrouping = (value: boolean = undefined) => {
  return {
    props: {
      options: {
        grouping: value,
      },
    },
  };
};

const propColumnHidden = (name: string, value: boolean = undefined) => {
  return {
    columns: {
      [name]: {
        hidden: value,
      },
    },
  };
};

const propColumns = (): any => {
  return {
    columns: [
      fieldDef("server", "Servidor"),
      fieldDef("environment", "Ambiente"),
      fieldDef("username", "Usuário"),
      fieldDef("computerName", "Estação"),
      fieldDef("threadId", "Thread"),
      fieldDef("mainName", "Programa"),
      fieldDef("loginTime", "Conexão"),
      fieldDef("elapsedTime", "Tempo Decorrido"),
      fieldDef("inactiveTime", "Tempo Inatividade"),
      fieldDef("totalInstrCount", "Total Instruções"),
      fieldDef("instrCountPerSec", "Instruções/seg"),
      fieldDef("remark", "Comentário"),
      fieldDef("memUsed", "Memória em Uso"),
      fieldDef("sid", "SID"),
      fieldDef("ctreeTaskId", "CTree ID"),
      fieldDef("clientType", "Tipo Conexão"),
    ],
  };
};

const DEFAULT_TABLE = mergeProperties([
  propColumns(),
  propPageSize(10),
  propGrouping(false)
]);

export default function MonitorPanel(props: IMonitorPanel) {
  const memento = props.memento.get("monitorTable");
  const [grouping, setGrouping] = React.useState(false);
  const [filtering, setFiltering] = React.useState(false);
  const [selected, setSelected] = React.useState<IConnectionData[]>([]);
  const [speed, setSpeed] = React.useState(props.speed);
  const [rows, setRows] = React.useState([]);
  const [subtitle, setSubtitle] = React.useState("(inicializando)");
  const [showServerCol, setShowServerCol] = React.useState(true);
  const [locked, setLocked] = React.useState(true);

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
        case MonitorPanelAction.LockServer: {
          setLocked(message.data);

          break;
        }
        case MonitorPanelAction.UpdateUsers: {
          const result = message.data.users as IMonitorUser[];

          setShowServerCol(message.data.showServerCol);
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
      content: {},
    };

    props.vscode.postMessage(command);
  };

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
        content: { lock: true },
      };
      props.vscode.postMessage(command);
    }
  };

  const doUnlockServer = (confirm: boolean) => {
    setOpenDialog({ ...openDialog, unlockServer: false });

    if (confirm) {
      let command: IMonitorPanelAction = {
        action: MonitorPanelAction.LockServer,
        content: { lock: false },
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
    setOpenDialog({ ...openDialog, unlockServer: true });
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
      content: { killNow: killNow },
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
          recipients: recipients,
          killNow: killNow,
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
          recipients: recipients,
          message: message,
        },
      };

      props.vscode.postMessage(command);
    }
  };

  const doColumnHidden = (column: Column<any>, hidden: boolean) => {
    console.log("doColumnHidden");

    memento.save(propColumnHidden(column.field as string, hidden));
  };

  const actions = [];

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
    icon: () => <GroupingIcon />,
    tooltip: "Grouping on/off",
    isFreeAction: true,
    onClick: () => {
      memento.save(propGrouping(!grouping));
      setGrouping(!grouping);
    },
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
            icons={monitorIcons.table}
            columns={memento.load(propColumns())}
            data={rows}
            title={<Title title={"Monitor"} subtitle={subtitle} />}
            options={{
              emptyRowsWhenPaging: false,
              pageSize: memento.load(propPageSize()),
              pageSizeOptions: [10, 50, 100],
              paginationType: "normal",
              thirdSortClick: true,
              selection: true,
              grouping: grouping,
              filtering: filtering,
              exportButton: false,
              padding: "dense",
              actionsColumnIndex: 0,
              columnsButton: true,
            }}
            actions={actions}
            onSelectionChange={(rows) => setSelected(rows)}
            onRowClick={(evt, selectedRow) => this.setState({ selectedRow })}
            onChangeRowsPerPage={(value) => memento.save(propPageSize(value))}
            onChangeColumnHidden={(column, hidden) =>
              doColumnHidden(column, hidden)
            }
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
