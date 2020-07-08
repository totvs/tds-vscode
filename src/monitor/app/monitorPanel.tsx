import * as React from "react";
import MaterialTable, { Column, Filter, Query } from "material-table";
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
import ErrorBoundary from "../helper/errorBoundary";
import { useMemento, mergeProperties, IMemento } from "../helper";
import {
  propGrouping,
  propPageSize,
  propFiltering,
  DEFAULT_TABLE,
  propColumnHidden,
  propColumns,
} from "./monitorPanelMemento";

function fieldDef(
  field: string,
  title: string,
  extraProps: any = { hidden: false, ...cellDefaultStyle }
): any {
  return { field: field, title: title, ...extraProps };
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
  speed: any;
  vscode: any;
  memento?: any;
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

let _memento: IMemento;

export default function MonitorPanel(props: IMonitorPanel) {
  if (!_memento) {
    _memento = useMemento(
      "monitorTable",
      DEFAULT_TABLE,
      props.memento,
    );
  }

  React.useEffect(() => {
    console.log("mount component");
    // onChangeRowsPerPage={(value) => doChangeRowsPerPage(value)}
    // onChangeColumnHidden={(column, hidden) =>
    //   doColumnHidden(column, hidden)
    // }
    // onGroupRemoved={(column, index) => doGroupRemoved(column, index)}
    // onOrderChange={(orderBy, direction) =>
    //   doOrderChange(orderBy, direction)
    // }
    // onFilterChange={(filters) => doFilterChange(filters)}
    // onQueryChange={(query) => doQueryChange(query)}
    // onSearchChange={(searchText) => doSearchChange(searchText)}
    // onChangePage={(page) => console.log(page)}
    // onColumnDragged={(sourceIndex, destinationIndex) =>
    //   doColumnDragged(sourceIndex, destinationIndex)
    // }

    return () => {
      console.log("unmount component");
      _memento.set(propGrouping(grouping));
      _memento.set(propPageSize(pageSize));
      _memento.set(propFiltering(filtering));
      _memento.save(props.vscode, MonitorPanelAction.DoUpdateState);
    };
  });

  const [pageSize, setPageSize] = React.useState(_memento.get(propPageSize()));
  const [grouping, setGrouping] = React.useState(_memento.get(propGrouping()));
  const [filtering, setFiltering] = React.useState(
    _memento.get(propFiltering())
  );
  const [selected, setSelected] = React.useState<IConnectionData[]>([]);
  const [speed, setSpeed] = React.useState(props.speed);
  const [rows, setRows] = React.useState([]);
  const [subtitle, setSubtitle] = React.useState("(inicializando)");
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
        case MonitorPanelAction.DoUpdateState: {
          _memento.reset();
          break;
        }
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

  const handleResetButtonChange = () => {
    event.preventDefault();

    _memento.reset();
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

      //_memento.set(propSpeed(speed));
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
    _memento.set(propColumnHidden(column.field as string, hidden));
  };

  const doGroupRemoved = (column: Column<any>, index: boolean) => {
    console.log(column);

    //_memento.set(propColumnHidden(column.field as string, index));
  };

  const doOrderChange = (orderBy: number, direction: string) => {
    console.log(orderBy);

    //_memento.set(propColumnHidden(column.field as string, index));
  };

  const doFilterChange = (filters: Filter<any>[]) => {
    console.log(filters);

    //_memento.set(propColumnHidden(column.field as string, index));
  };

  const doQueryChange = (query: Query<any>) => {
    console.log(query);

    //_memento.set(propColumnHidden(column.field as string, index));
  };

  const doSearchChange = (textSearch: string) => {
    console.log(textSearch);

    //_memento.set(propColumnHidden(column.field as string, index));
  };

  const doColumnDragged = (sourceIndex: number, destinationIndex: number) => {
    console.log(sourceIndex);

    //_memento.set(propColumnHidden(column.field as string, index));
  };

  const doChangeRowsPerPage = (value: number) => {
    _memento.set(propPageSize(value));
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
      setGrouping(!grouping);
    },
  });

  actions.push({
    icon: () => <FilterList />,
    tooltip: "Filtering on/off",
    isFreeAction: true,
    onClick: () => {
      _memento.set(propFiltering(!filtering));
      setFiltering(!filtering);
    },
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

  actions.push({
    icon: () => <FormatClearIcon />,
    tooltip: "Reset default configurations",
    isFreeAction: true,
    onClick: () => handleResetButtonChange(),
  });

  return (
    <ErrorBoundary>
      <MonitorTheme>
        <Paper variant="outlined">
          <MaterialTable
            localization={{
              pagination: {
                labelDisplayedRows: "{from}-{to} de {count}",
                labelRowsSelect: "conexões",
                labelRowsPerPage: "linhas/pág.",
                firstAriaLabel: "Primeira",
                firstTooltip: "Primeira página",
                previousAriaLabel: "Anterior",
                previousTooltip: "Página anterior",
                nextAriaLabel: "Próxima",
                nextTooltip: "Próxima página",
                lastAriaLabel: "Última",
                lastTooltip: "Última página",
              },
              toolbar: {
                nRowsSelected: "{0} conexões selecionadas",
                showColumnsTitle: "Apresenta/esconde colunas",
                searchTooltip: "Busca em todas as colunas",
                searchPlaceholder: "Busca",
              },
              header: {
                actions: "Ações",
              },
              body: {
                emptyDataSourceMessage:
                  "Não há conexões ou estas não são visíveis ao monitor.",
                filterRow: {
                  filterTooltip: "Filtro",
                },
              },
              grouping: {
                placeholder: "Arrastar cabeçalhos...",
                groupedBy: "Agrupado por:",
              },
            }}
            icons={monitorIcons.table}
            columns={_memento.get(propColumns({ ...cellDefaultStyle })).columns}
            data={rows}
            title={<Title title={"Monitor"} subtitle={subtitle} />}
            options={{
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
            }}
            actions={actions}
            onSelectionChange={(rows) => setSelected(rows)}
            onRowClick={(evt, selectedRow) => this.setState({ selectedRow })}
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
