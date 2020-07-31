import * as React from "react";
import MaterialTable, { Column } from "material-table";
import {
  createStyles,
  lighten,
  makeStyles,
  Theme,
  ServerStyleSheets,
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
import SpeedUpdateDialogDialog from "./speedUpdateDialog";
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
  propColumnMove,
  propColumnsOrder,
  propSpeed,
} from "./monitorPanelMemento";
import { i18n } from "../helper";
import RemarkDialog from "./remarkDialog";

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
  const columns = propColumns({ ...cellDefaultStyle }).columns;
  const orderBy = memento.get(propOrderBy()) || -1;

  for (let index = 0; index < columns.length; index++) {
    const value = memento.get(propColumnHidden(columns[index].field));

    if (value !== undefined) {
      columns[index]["hiddenByColumnsButton"] = value;
      columns[index]["hidden"] = value;
    }

    if (orderBy === index) {
      columns[index]["sorting"] = true;
      columns[index]["defaultSort"] = memento.get(propOrderDirection());
    }
  }

  const columnsOrder: string[] = memento.get(propColumnsOrder());
  if (columnsOrder) {
    console.log(columnsOrder);
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

  // const [grouping, setGrouping] = React.useState(memento.get(propGrouping()));
  // const [filtering, setFiltering] = React.useState(
  //   memento.get(propFiltering())
  // );
  const [selected, setSelected] = React.useState<IConnectionData[]>([]);
  const [speed, setSpeed] = React.useState(memento.get(propSpeed()));
  const [rows, setRows] = React.useState([]);
  const [subtitle, setSubtitle] = React.useState();
  const [locked, setLocked] = React.useState(true);
  const [pageSize, setPageSize] = React.useState(memento.get(propPageSize()));
  const [grouping, setGrouping] = React.useState(false);
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
  });
  const [columns] = React.useState(buildColumns(memento));
  const [reset, setReset] = React.useState(false);

  React.useEffect(() => {
    let command: IMonitorPanelAction = {
      action: MonitorPanelAction.EnableUpdateUsers,
      content: { state: !isAnyDialogOpen(openDialog) },
    };

    props.vscode.postMessage(command);
  }, [openDialog]);

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
        case MonitorPanelAction.SetSpeedUpdate: {
          const speed = message.data;

          memento.set(propSpeed(speed));
          memento.save();
          setSpeed(speed);

          break;
        }
        case MonitorPanelAction.LockServer: {
          setLocked(message.data);

          break;
        }
        case MonitorPanelAction.UpdateUsers: {
          const result = message.data.users as IMonitorUser[];
          setRows(result);
          setSubtitle(message.data.serverName);
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

  const handleResetButtonClick = () => {
    event.preventDefault();
    setReset(true);
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

    if (confirm) {
      setSpeed(speed);

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
    memento.set(propColumnHidden(column.field as string, hidden));
    memento.save();
  };

  const doGroupRemoved = (column: Column<any>, index: boolean) => {
    //console.log(column);
    //_memento.set(propColumnHidden(column.field as string, index));
  };

  const doOrderChange = (orderBy: number, direction: string) => {
    const count = 0; //columns.filter((element: any) => element.hidden).length;

    memento.set(propOrderBy(orderBy + count));
    memento.set(propOrderDirection(direction));

    //memento.save(MonitorPanelAction.DoUpdateState);
  };

  const doColumnDragged = (sourceIndex: number, destinationIndex: number) => {
    const count = 0; //columns.filter((element: any) => element.hidden).length;
    memento.set(propColumnMove(sourceIndex + count, destinationIndex + count));

    //memento.save(MonitorPanelAction.DoUpdateState);
  };

  const doChangeRowsPerPage = (value: number) => {
    setPageSize(value);
    memento.set(propPageSize(value));
    memento.save();
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
      icon: () => <LockIcon />,
      tooltip: i18n.localize("LOCK_SERVER", "Lock server"),
      isFreeAction: true,
      onClick: (event: any) => handleLockButtonClick(event),
    });
  } else {
    actions.push({
      icon: () => <LockOpenIcon />,
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
      "DISCONNECT_SELECTD_USERS",
      "Disconnect selectd users"
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
    icon: () => <GroupingIcon />,
    tooltip: i18n.localize("GROUPING_ON_OFF", "Grouping on/off"),
    isFreeAction: true,
    onClick: () => {
      setGrouping(!grouping);
    },
  });

  actions.push({
    icon: () => <FilterList />,
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
    icon: () => <RefreshIcon />,
    tooltip: i18n.localize("REFRESH_DATA", "Refresh data"),
    isFreeAction: true,
    onClick: () => handleRefreshButtonClick(),
  });

  actions.push({
    icon: () => <FormatClearIcon />,
    tooltip: i18n.localize("RESET_CONFIGURATIONS", "Reset configurations"),
    isFreeAction: true,
    onClick: () => handleResetButtonClick(),
  });

  // // other props
  // components={{
  //   Toolbar: (props) => (
  //     <div style={{ backgroundColor: "#e8eaf5" }}>
  //       <MTableToolbar {...props} />
  //     </div>
  //   ),
  // }}

  return (
    <MonitorTheme>
      <Paper variant="outlined">
        <MaterialTable
          localization={{
            pagination: {
              labelDisplayedRows: "{from}-{to}/{count}",
              labelRowsSelect: i18n.localize("CONNECTIONS", "connections"),
              labelRowsPerPage: i18n.localize("LINES_PAGE.", "lines/p."),
              firstAriaLabel: i18n.localize("FIRST", "First"),
              firstTooltip: i18n.localize("FIRST_PAGE", "First page"),
              previousAriaLabel: i18n.localize("PREVIOUS", "Previous"),
              previousTooltip: i18n.localize("PREVIOUS_PAGE", "Previous page"),
              nextAriaLabel: i18n.localize("NEXT", "Next"),
              nextTooltip: i18n.localize("NEXT_PAGE", "Next page"),
              lastAriaLabel: i18n.localize("LAST", "Last"),
              lastTooltip: i18n.localize("LAST_PAGE", "Last page"),
            },
            toolbar: {
              nRowsSelected: i18n.localize(
                "CONNECTIONS_SELECTED",
                "{0} connections selected"
              ),
              showColumnsTitle: i18n.localize(
                "SHOW_HIDE_COLUMNS",
                "Show/hide columns"
              ),
              searchTooltip: i18n.localize(
                "SEARCH_ALL_COLUMNS",
                "Search in all columns"
              ),
              searchPlaceholder: i18n.localize("SEARCH", "Search"),
            },
            header: {
              actions: i18n.localize("ACTIONS", "Actions"),
            },
            body: {
              emptyDataSourceMessage: i18n.localize(
                "NO_CONNECTIONS",
                "There are no connections or they are not visible to the monitor."
              ),
              filterRow: {
                filterTooltip: i18n.localize("FILTER", "Filter"),
              },
            },
            grouping: {
              placeholder: i18n.localize("DRAG_HEADERS", "Drag headers ..."),
              groupedBy: i18n.localize("GROUPED_BY", "Grouped by:"),
            },
          }}
          icons={monitorIcons.table}
          columns={rows.length ? columns : []}
          data={rows}
          title={
            <Title
              title={i18n.localize("MONITOR", "Monitor")}
              subtitle={
                subtitle
                  ? subtitle
                  : i18n.localize("INITIALIZING", "(inicializando)")
              }
            />
          }
          options={{
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
          }}
          actions={actions}
          onSelectionChange={(rows) => setSelected(rows)}
          onChangeRowsPerPage={(value) => doChangeRowsPerPage(value)}
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

      <SpeedUpdateDialogDialog
        speed={speed}
        open={openDialog.speedUpdate}
        onClose={doSpeedUpdate}
      />
    </MonitorTheme>
  );
}
