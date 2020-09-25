import * as React from "react";
import MaterialTable, { Column, MTableToolbar } from "material-table";
import {
  createStyles,
  lighten,
  makeStyles,
  Theme,
} from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import { rpoInfoIcons } from "../helper/rpoInfoIcons";
import { RpoInfoPanelAction, IRpoInfoPanelAction } from "../actions";
import FilterList from "@material-ui/icons/FilterList";
import { cellDefaultStyle } from "./rpoInfoInterface";
import { IMemento, useMemento } from "../helper/memento";

import {
  propPageSize,
  DEFAULT_TABLE,
  propColumnHidden,
  propColumns,
  propOrderBy,
  propOrderDirection,
  propColumnsOrder,
  propColumnGroup,
} from "./rpoInfoPanelMemento";
import { i18n } from "../helper";
import RpoInfoTheme from "../helper/theme";
import { IRpoInfoData } from "../rpoPath";

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

interface IRpoInfoPanel {
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
      //para mascarar erro devido a erro na implemtação anterior
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

export default function RpoLogPanel(props: IRpoInfoPanel) {
  memento = useMemento(
    props.vscode,
    "RPO_INFO_PANEL",
    RpoInfoPanelAction.DoUpdateState,
    DEFAULT_TABLE(),
    props.memento
  );

  const [selected, setSelected] = React.useState<IRpoInfoData[]>([]);
  const [rows, setRows] = React.useState([]);
  const [subtitle, setSubtitle] = React.useState();
  const [pageSize, setPageSize] = React.useState(memento.get(propPageSize()));
  const [filtering, setFiltering] = React.useState(false);
  const [columns] = React.useState(buildColumns(memento));
  const [reset, setReset] = React.useState(false);

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
        case RpoInfoPanelAction.UpdateRpoInfo: {
          const rpoPath = message.data.users as IRpoInfoData;
          const servers = message.data.servers as any[];

          setRows(rpoPath.rpoPatchs);
          setSubtitle(message.data.serverName);
          break;
        }
        default:
          console.log("***** ATTENTION: rpoInfoPanel.tsx");
          console.log("\tCommand not recognized: " + message.command);
          break;
      }
    };

    window.addEventListener("message", listener);
  }

  const handleResetButtonClick = () => {
    event.preventDefault();
    setReset(true);
  };

  const doColumnHidden = (column: Column<any>, hidden: boolean) => {
    memento.set(propColumnHidden(column.field as string, hidden));
  };

  const doGroupRemoved = (column: Column<any>, index: boolean) => {
    memento.set(propColumnGroup(column.field as string, index));
  };

  const doOrderChange = (orderBy: number, direction: string) => {
    const columns = propColumns().columns;

    memento.set(propOrderBy(columns[orderBy]["field"]));
    memento.set(propOrderDirection(direction));
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

  const actions = [];

  actions.push({
    icon: () =>
      filtering ? <FilterList className={style.actionOn} /> : <FilterList />,
    tooltip: i18n.localize("FILTERING_ON_OFF", "Filtering on/off"),
    isFreeAction: true,
    onClick: () => {
      setFiltering(!filtering);
    },
  });

  const style = useToolbarStyles();

  return (
    <RpoInfoTheme>
      <Paper variant="outlined">
        <MaterialTable
          components={{
            Toolbar: (props) => (
              <div>
                <Title
                  title={i18n.localize("RPO_LOG", "Log de Repositórios")}
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
          icons={rpoInfoIcons.table}
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
            grouping: false,
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
          onChangeColumnHidden={(column, hidden) =>
            doColumnHidden(column, hidden)
          }
          onGroupRemoved={(column, index) => doGroupRemoved(column, index)}
          onOrderChange={(orderBy, direction) =>
            doOrderChange(orderBy, direction)
          }
          onColumnDragged={(sourceIndex, destinationIndex) =>
            doColumnDragged(sourceIndex, destinationIndex)
          }
        />
      </Paper>
    </RpoInfoTheme>
  );
}
