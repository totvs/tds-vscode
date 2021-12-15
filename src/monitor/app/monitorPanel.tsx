import * as React from "react";
import MaterialTable, { Column, MTableToolbar } from "material-table";
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
import SendMessageDialog from "./sendMessageDialog";
import FilterList from "@material-ui/icons/FilterList";
import SpeedIcon from "@material-ui/icons/Speed";
import RefreshIcon from "@material-ui/icons/Refresh";
import StorageIcon from "@material-ui/icons/Storage";
import FormatClearIcon from "@material-ui/icons/FormatClear";
import LockIcon from "@material-ui/icons/Lock";
import LockOpenIcon from "@material-ui/icons/LockOpen";
import MessageIcon from "@material-ui/icons/Message";
import StopIcon from "@material-ui/icons/Stop";
import { IConnectionData, cellDefaultStyle } from "./monitorInterface";
import StopServerDialog from "./stopServerDialog";
import LockServerDialog from "./lockServerDialog";
import UnlockServerDialog from "./unlockServerDialog";
import DisconnectUserDialog from "./disconnectUserDialog";
import SpeedUpdateDialog from "./speedUpdateDialog";
import MonitorTheme from "../helper/theme";
import { useMemento, IMemento } from "../helper";
import {
  propPageSize,
  DEFAULT_TABLE,
  propColumnHidden,
  propColumns,
  propSpeedText,
  propOrderBy,
  propOrderDirection,
  propColumnsOrder,
  propSpeed,
  propTreeServer,
  propGrouping,
  propColumnGroup,
} from "./monitorPanelMemento";
import { i18n } from "../helper";
import RemarkDialog from "./remarkDialog";
import ConfirmDialog from "./confirmDialog";

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
      display: "inline",
      fontSize: "180%",
      fontWeight: "bold",
      marginLeft: "16px",
    },
    subtitle: {
      color: "silver",
      display: "inline",
      marginLeft: "20px",
    },
    actions: {
      display: "inline",
      marginRight: "8px",
      float: "right",
    },
    actionOn: {
      borderRadius: "25px",
      border: "2px solid silver",
      boxShadow: "0 0 3px #FF0000, 0 0 5px #0000FF",
    },
  })
);

interface IMonitorPanel {
  vscode: any;
  memento: any;
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

function buildColumns(memento: IMemento): [] {
  let columns = propColumns({ ...cellDefaultStyle }).columns;
  const orderBy = memento.get(propOrderBy()) || "";
  const defaultSort =
    orderBy === -1 ? "" : memento.get(propOrderDirection()) || "asc";
  let columnsOrder: any[] = memento.get(propColumnsOrder()) || [];

  for (let index = 0; index < columns.length; index++) {
    const value = memento.get(propColumnHidden(columns[index].field));

    if (value !== undefined) {
      columns[index]["hiddenByColumnsButton"] = value;
      columns[index]["hidden"] = value;
    }

    if (orderBy === columns[index]["field"]) {
      columns[index]["defaultSort"] = defaultSort;
    }

    try {
      const orderColumn: any = columnsOrder.find((column: any) => {
        return column.field === columns[index]["field"];
      });

      if (orderColumn) {
        columns[index]["columnOrder"] = orderColumn.columnOrder;
      }
    } catch (error) {
      columnsOrder = [];
    }
  }

  if (columnsOrder.length > 0) {
    columns = columns.sort(function (a: any, b: any): any {
      return a.columnOrder - b.columnOrder;
    });
  }

  return columns;
}

let memento: IMemento = undefined;

const isAnyDialogOpen = (openDialog: any): boolean => {
  return (
    openDialog.lockServer ||
    openDialog.unlockServer ||
    openDialog.stopServer ||
    openDialog.sendMessage ||
    openDialog.disconnectUser ||
    openDialog.speedUpdate ||
    openDialog.remark
  );
};

export default function MonitorPanel(props: IMonitorPanel) {
  memento = useMemento(
    props.vscode,
    "MONITOR_PANEL",
    MonitorPanelAction.DoUpdateState,
    DEFAULT_TABLE(),
    props.memento
  );

  const [selected, setSelected] = React.useState<IConnectionData[]>([]);
  const [speed, setSpeed] = React.useState(memento.get(propSpeed()));
  const [rows, setRows] = React.useState([]);
  const [subtitle, setSubtitle] = React.useState();
  const [locked, setLocked] = React.useState(true);
  const [pageSize, setPageSize] = React.useState(memento.get(propPageSize()));
  const [grouping, setGrouping] = React.useState(memento.get(propGrouping()));
  const [treeServer, setTreeServer] = React.useState(
    memento.get(propTreeServer())
  );
  const [filtering, setFiltering] = React.useState(false);
  const [openDialog, setOpenDialog] = React.useState({
    lockServer: false,
    unlockServer: false,
    stopServer: false,
    sendMessage: false,
    disconnectUser: false,
    speedUpdate: false,
    remark: false,
    remarkToShow: "",
    confirmReset: false,
  });
  const [columns] = React.useState(buildColumns(memento));
  const [reset, setReset] = React.useState(false);

  React.useEffect(() => {
    const enableUpdateUsers: boolean =
      !isAnyDialogOpen(openDialog) && selected.length === 0;

    let command: IMonitorPanelAction = {
      action: MonitorPanelAction.EnableUpdateUsers,
      content: {
        state: enableUpdateUsers,
        reason: !enableUpdateUsers ? (selected.length === 0 ? 1 : 2) : 0, //1 dialog open, 2 selected row
      },
    };

    props.vscode.postMessage(command);
  }, [openDialog, selected]);

  React.useEffect(() => {
    if (reset) {
      memento.save(true);
    }
  }, [reset]);

  const [targetRow, setTargetRow] = React.useState(null);

  if (listener === undefined) {
    listener = (event: MessageEvent) => {
      const message = event.data; // The JSON data our extension sent

      switch (message.command) {
        case MonitorPanelAction.LockServer: {
          setLocked(message.data);

          break;
        }
        case MonitorPanelAction.UpdateUsers: {
          //const users = message.data.users as IMonitorUser[];
          //const servers = message.data.servers as any[];

          setRows((rows) => {
            if (event !== undefined) {
              event.preventDefault();
            }
            return message.data.users;
          });
          setSubtitle(message.data.serverName);

          ////setServers(servers);
          break;
        }
        default:
          console.log("***** ATTENTION: monitorPanel.tsx");
          console.log("\tCommand not recognized: " + message.command);
          break;
      }
    };

    window.addEventListener("message", listener);
  }

  const handleSpeedButtonClick = () => {
    event.preventDefault();

    setOpenDialog({ ...openDialog, speedUpdate: true });
  };

  const handleRefreshButtonClick = () => {
    event.preventDefault();

    let command: IMonitorPanelAction = {
      action: MonitorPanelAction.UpdateUsers,
      content: {},
    };

    props.vscode.postMessage(command);
  };

  const handleResetButtonClick = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    event.preventDefault();

    setOpenDialog({ ...openDialog, confirmReset: true });
  };

  const doResetConfiguration = (confirm: boolean) => {
    setOpenDialog({ ...openDialog, confirmReset: false });

    if (confirm) {
      setReset(true);
    }
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

  const doRemarkClose = () => {
    setOpenDialog({ ...openDialog, remark: false, remarkToShow: "" });
  };

  const doSpeedUpdate = (confirm: boolean, speed: number) => {
    setOpenDialog({ ...openDialog, speedUpdate: false });
    console.log(speedDialog);

    if (confirm) {
      setSpeed(speed);

      let command: IMonitorPanelAction = {
        action: MonitorPanelAction.SetSpeedUpdate,
        content: { speed: speed },
      };

      props.vscode.postMessage(command);

      memento.set(propSpeed(speed));
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

  const doStopServer = (confirm: boolean) => {
    setTargetRow(null);
    setOpenDialog({ ...openDialog, stopServer: false });

    if (confirm) {
      let command: IMonitorPanelAction = {
        action: MonitorPanelAction.StopServer,
        content: {},
      };

      props.vscode.postMessage(command);
    }
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

    setSelected([]);
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
    memento.set(propColumnHidden(column.field as string, hidden));
  };

  const doGroupRemoved = (column: Column<any>, index: boolean) => {
    memento.set(propColumnGroup(column.field as string, index));
  };

  const doOrderChange = (orderBy: number, direction: string) => {
    const columns = propColumns().columns;

    if (columns[orderBy] === null || columns[orderBy] === undefined) {
      memento.set(propOrderBy(0));
    } else {
      memento.set(propOrderBy(columns[orderBy]["field"]));
      memento.set(propOrderDirection(direction));
    }
  };

  const doColumnDragged = (sourceIndex: number, destinationIndex: number) => {
    const newOrder = columns
      .filter((column: any) => {
        return column.tableData.groupOrder === undefined;
      })
      .map((column: any) => {
        return {
          field: column.field,
          columnOrder: column.tableData.columnOrder,
        };
      });

    memento.set(propColumnsOrder(newOrder));
  };

  const doChangeRowsPerPage = (value: number) => {
    setPageSize(value);
    memento.set(propPageSize(value));
  };

  const doClickRow = (event: React.MouseEvent, rowData: any) => {
    event.preventDefault();

    if (event.target["innerText"].startsWith("Emp")) {
      setOpenDialog({
        ...openDialog,
        remark: true,
        remarkToShow: rowData["remark"],
      });
    }
  };

  const actions = [];

  if (!locked) {
    actions.push({
      icon: () => <LockOpenIcon />,
      tooltip: i18n.localize("LOCK_SERVER", "Lock server"),
      isFreeAction: true,
      onClick: (event: any) => handleLockButtonClick(event),
    });
  } else {
    actions.push({
      icon: () => <LockIcon />,
      tooltip: i18n.localize("UNLOCK_SERVER", "Unlock server"),
      isFreeAction: true,
      onClick: (event: any) => handleUnlockButtonClick(event),
    });
  }

  actions.push({
    icon: () => <MessageIcon />,
    tooltip: i18n.localize(
      "SEND_MESSAGE_ALL_USERS",
      "Send message to all users"
    ),
    isFreeAction: true,
    onClick: (event: any) => handleSendMessageButtonClick(event, null),
  });

  actions.push({
    icon: () => <MessageIcon />,
    tooltip: i18n.localize(
      "SEND_MESSAGE_SELECTED_USERS",
      "Send message to selected users"
    ),
    isFreeAction: false,
    onClick: (event: any, row: any) => handleSendMessageButtonClick(event, row),
  });

  actions.push({
    icon: () => <DisconnectIcon />,
    tooltip: i18n.localize("DISCONNECT_ALL_USERS", "Disconnect all users"),
    isFreeAction: true,
    onClick: (event: any) => handleDisconnectUserButtonClick(event, null),
  });

  actions.push({
    icon: () => <DisconnectIcon />,
    tooltip: i18n.localize(
      "DISCONNECT_SELECTED_USERS",
      "Disconnect selected users"
    ),
    isFreeAction: false,
    onClick: (event: any) => handleDisconnectUserButtonClick(event, rows),
  });

  actions.push({
    icon: () => <StopIcon />,
    tooltip: i18n.localize("STOP_SERVER", "Stop server"),
    isFreeAction: true,
    onClick: (event: any) => handleStopButtonClick(event),
  });

  actions.push({
    icon: () =>
      treeServer ? <StorageIcon className={style.actionOn} /> : <StorageIcon />,
    tooltip: i18n.localize("TREE_SERVER_ON_OFF", "Tree server on/off"),
    isFreeAction: true,
    onClick: () => {
      setTreeServer(!treeServer);
      memento.set(propTreeServer(!treeServer));
    },
    hidden: true,
  });

  actions.push({
    icon: () =>
      grouping ? <GroupingIcon className={style.actionOn} /> : <GroupingIcon />,
    tooltip: i18n.localize("GROUPING_ON_OFF", "Grouping on/off"),
    isFreeAction: true,
    onClick: () => {
      setGrouping(!grouping);
      memento.set(propGrouping(!grouping));
    },
  });

  actions.push({
    icon: () =>
      filtering ? <FilterList className={style.actionOn} /> : <FilterList />,
    tooltip: i18n.localize("FILTERING_ON_OFF", "Filtering on/off"),
    isFreeAction: true,
    onClick: () => {
      setFiltering(!filtering);
    },
  });

  actions.push({
    icon: () => <SpeedIcon />,
    tooltip: i18n.localize(
      "UPDATE_SPEED",
      "Update speed {0}",
      propSpeedText(speed)
    ),
    isFreeAction: true,
    onClick: () => handleSpeedButtonClick(),
  });

  actions.push({
    icon: () =>
      speed === 0 ? (
        <RefreshIcon className={style.actionOn} />
      ) : (
        <RefreshIcon />
      ),
    tooltip: i18n.localize("REFRESH_DATA", "Refresh data"),
    isFreeAction: true,
    onClick: () => handleRefreshButtonClick(),
  });

  actions.push({
    icon: () => <FormatClearIcon />,
    tooltip: i18n.localize("RESET_CONFIGURATIONS", "Reset configurations"),
    isFreeAction: true,
    onClick: (event: any) => handleResetButtonClick(event),
  });

  const style = useToolbarStyles();
  const speedDialog = React.useRef();

  return (
    <MonitorTheme>
      <Paper variant="outlined">
        <MaterialTable
          components={{
            Toolbar: (props) => (
              <div>
                <Title
                  title={i18n.localize("MONITOR", "Monitor")}
                  subtitle={
                    subtitle
                      ? subtitle
                      : i18n.localize("INITIALIZING", "(initializing)")
                  }
                />

                <MTableToolbar {...props} />
              </div>
            ),
          }}
          localization={i18n.materialTableLocalization}
          icons={monitorIcons.table}
          columns={rows.length ? columns : []}
          data={rows}
          options={{
            searchFieldAlignment: "left",
            searchFieldStyle: { marginLeft: "-16px" },
            showTextRowsSelected: false,
            emptyRowsWhenPaging: false,
            pageSize: pageSize,
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
            sorting: true,
            showTitle: false,
            toolbarButtonAlignment: "right",
          }}
          actions={actions}
          onSelectionChange={(rows) => setSelected(rows)}
          onChangeRowsPerPage={(value) => doChangeRowsPerPage(value)}
          //As versoes mais novas do @material/core usam as propriedades abaixo, porem por problemas de compatibilidade
          //entre a versai mais nova do "@material-ui/core" e do material-table: 1.69.3, é necesaario manter o "@material-ui/core" na versao 4.11.4,
          //onRowsPerPageChange={(value) => doChangeRowsPerPage(value)}
          onChangeColumnHidden={(column, hidden) =>
            doColumnHidden(column, hidden)
          }
          onRowClick={(event, rowData) => doClickRow(event, rowData)}
          onGroupRemoved={(column, index) => doGroupRemoved(column, index)}
          onOrderChange={(orderBy, direction) =>
            doOrderChange(orderBy, direction)
          }
          onColumnDragged={(sourceIndex, destinationIndex) =>
            doColumnDragged(sourceIndex, destinationIndex)
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
      <RemarkDialog
        open={openDialog.remark}
        onClose={doRemarkClose}
        remark={openDialog.remarkToShow}
      />
      <SpeedUpdateDialog
        speed={speed}
        open={openDialog.speedUpdate}
        onClose={doSpeedUpdate}
      />

      <ConfirmDialog
        open={openDialog.confirmReset}
        operation={i18n.localize(
          "RESET_CONFIGURATIONS",
          "Reset configurations"
        )}
        message={i18n.localize(
          "RESET_MESSAGE",
          "The settings made will be reset to default. Unable to recover."
        )}
        onClose={doResetConfiguration}
      />
    </MonitorTheme>
  );
}
