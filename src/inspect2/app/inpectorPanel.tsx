import * as React from "react";
import MaterialTable, { Column, MTableToolbar } from "material-table";
import Paper from "@material-ui/core/Paper";
import { GroupingIcon, inspectorIcons } from "../helper/inpectorIcons";
import { InspectorPanelAction, IInspectorPanelAction } from "../actions";
import FilterList from "@material-ui/icons/FilterList";
import { cellDefaultStyle } from "./inpectorInterface";
import { IMemento, useMemento } from "../helper/memento";
import {
  propPageSize,
  DEFAULT_TABLE,
  propColumnHidden,
  propObjectsColumns,
  propFunctionsColumns,
  propOrderBy,
  propOrderDirection,
  propGrouping,
  propColumnsOrder,
  propColumnGroup,
} from "./inpectorPanelMemento";
import { i18n } from "../helper";
import { useToolbarStyles } from "../helper/theme";
import SaveAlt from "@material-ui/icons/SaveAlt";
import InspectorTheme from "../helper/theme";
import { Checkbox, FormControlLabel, FormGroup } from "@material-ui/core";

interface IInspectorPanel {
  vscode: any;
  options: {
    stateKey: string;
    includeOutScope: boolean;
    objectsInspector: boolean;
  };
}

let listener = undefined;

function Title(props: { title: string; subtitle: string }) {
  const style = useToolbarStyles();

  return (
    <>
      <div className={style.title}>{props.title}</div>
      <div className={style.subtitle}>{props.subtitle}</div>
    </>
  );
}

function IncludeOutScope(props: {
  title: string;
  value: boolean;
  change: any;
}) {
  return (
    <FormGroup>
      <FormControlLabel
        control={<Checkbox checked={props.value} onChange={props.change} />}
        label={props.title}
      />
    </FormGroup>
  );
}

function buildColumns(objectInspector: boolean, memento: IMemento): [] {
  let columns = objectInspector
    ? propObjectsColumns({ ...cellDefaultStyle }).columns
    : propFunctionsColumns({ ...cellDefaultStyle }).columns;

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

export default function InspectorPanel(props: IInspectorPanel) {
  memento = useMemento(
    props.vscode,
    props.options.stateKey,
    InspectorPanelAction.DoUpdateState,
    DEFAULT_TABLE(props.options.objectsInspector),
    memento
  );

  const [rows, setRows] = React.useState([]);
  const [subtitle, setSubtitle] = React.useState<string>("");
  const [isIncludeOutScope, setIncludeOutScope] = React.useState<boolean>(
    props.options.objectsInspector
  );
  const [pageSize, setPageSize] = React.useState(memento.get(propPageSize()));
  const [filtering, setFiltering] = React.useState(false);
  const [columns] = React.useState(
    buildColumns(props.options.objectsInspector, memento)
  );
  const [grouping, setGrouping] = React.useState(memento.get(propGrouping()));

  if (listener === undefined) {
    listener = (event: MessageEvent) => {
      const message = event.data; // The JSON data our extension sent

      switch (message.command) {
        case InspectorPanelAction.UpdateInspectorInfo: {
          setSubtitle(
            `${message.data.serverName} / ${message.data.environment}`
          );
          setRows(message.data.dataRows);
          setIncludeOutScope(message.data.includeOutScope);
          break;
        }
        default:
          console.log("***** ATTENTION: inpectorPanel.tsx");
          console.log("\tCommand not recognized: " + message.command);
          break;
      }
    };

    window.addEventListener("message", listener);
  }

  const doOrderChange = (orderBy: number, direction: string) => {
    const columns = props.options.objectsInspector
      ? propObjectsColumns().columns
      : propFunctionsColumns().columns;

    memento.set(propOrderBy(columns[orderBy]["field"]));
    memento.set(propOrderDirection(direction));
  };

  const doChangeRowsPerPage = (value: number) => {
    setPageSize(value);
    memento.set(propPageSize(value));
  };

  const doColumnHidden = (column: Column<any>, hidden: boolean) => {
    memento.set(propColumnHidden(column.field as string, hidden));
  };

  const doGroupRemoved = (column: Column<any>, index: boolean) => {
    memento.set(propColumnGroup(column.field as string, index));
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

  const doChangeIncludeOutScope = (event: any, checked: boolean) => {
    let command: IInspectorPanelAction = {
      action: InspectorPanelAction.UpdateInspectorInfo,
      content: {
        includeOutScope: checked,
      },
    };

    props.vscode.postMessage(command);
  };

  const actions = [];

  actions.push({
    icon: () =>
      grouping ? (
        <GroupingIcon className={toolBarStyle.actionOn} />
      ) : (
        <GroupingIcon />
      ),
    tooltip: i18n.localize("GROUPING_ON_OFF", "Grouping on/off"),
    isFreeAction: true,
    onClick: () => {
      setGrouping(!grouping);
      memento.set(propGrouping(!grouping));
    },
  });

  actions.push({
    icon: () =>
      filtering ? (
        <FilterList className={toolBarStyle.actionOn} />
      ) : (
        <FilterList />
      ),
    tooltip: i18n.localize("FILTERING_ON_OFF", "Filtering on/off"),
    isFreeAction: true,
    onClick: () => {
      setFiltering(!filtering);
    },
  });

  actions.push({
    icon: () => <SaveAlt />,
    tooltip: i18n.localize("EXPORT", "Export as text file"),
    isFreeAction: true,
    onClick: () => {
      let command: IInspectorPanelAction = {
        action: InspectorPanelAction.ExportToTxt,
        content: {
          rows: rows,
        },
      };

      props.vscode.postMessage(command);
    },
  });

  const toolBarStyle = useToolbarStyles();
  const title: string = props.options.objectsInspector
    ? i18n.localize("INSPECTOR_OBJECTS", "Objects Inspector")
    : i18n.localize("INSPECTOR_FUNCTIONS", "Functions Inspector");
  const labelIncludeOutScope = props.options.objectsInspector
    ? i18n.localize("INCLUDE_TRES", "Include TRES Objects")
    : i18n.localize(
        "INCLUDE_NOT_PUBLIC",
        "Include sources without public elements"
      );

  return (
    <InspectorTheme>
      <Paper variant="outlined">
        <MaterialTable
          components={{
            Toolbar: (props) => (
              <div id="toolbarID">
                <Title
                  title={title}
                  subtitle={
                    subtitle
                      ? subtitle
                      : i18n.localize("INITIALIZING", "(initializing)")
                  }
                />
                <IncludeOutScope
                  title={labelIncludeOutScope}
                  value={isIncludeOutScope}
                  change={doChangeIncludeOutScope}
                />
                <MTableToolbar {...props} />
              </div>
            ),
          }}
          localization={i18n.materialTableLocalization}
          icons={inspectorIcons.table}
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
            selection: false,
            grouping: grouping,
            filtering: filtering,
            exportButton: false,
            padding: "dense",
            columnsButton: false,
            sorting: true,
            showTitle: false,
            toolbarButtonAlignment: "right",
            actionsColumnIndex: -1,
            tableLayout: "fixed",
          }}
          actions={actions}
          onChangeRowsPerPage={(value) => doChangeRowsPerPage(value)}
          //As versoes mais novas do @material/core usam as propriedades abaixo, porem por problemas de compatibilidade
          //entre a versao mais nova do "@material-ui/core" e do material-table: 1.69.3, é necesaario manter o "@material-ui/core" na versao 4.11.4,
          //onRowsPerPageChange={(value) => doChangeRowsPerPage(value)}
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
    </InspectorTheme>
  );
}
