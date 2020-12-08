import * as React from "react";
import MaterialTable, { Column, MTableToolbar } from "material-table";
import {
  createStyles,
  lighten,
  makeStyles,
  Theme,
} from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import { ApplyPatchPanelAction, IApplyPatchPanelAction } from "../actions";
import FilterList from "@material-ui/icons/FilterList";
import CloudUploadIcon from "@material-ui/icons/CloudUpload";
import { cellDefaultStyle } from "./applyPatchInterface";
import ApplyPatchTheme from "../helper/theme";
import { useMemento, IMemento } from "../helper";
import {
  DEFAULT_TABLE,
  propColumnHidden,
  propColumns,
  propColumnsOrder,
  propOrderBy,
  propOrderDirection,
  propPageSize,
} from "./applyPatchPanelMemento";
import { i18n } from "../helper";
import { applyPatchIcons } from "../helper/applyPatchIcons";
import {
  Button,
  Checkbox,
  FormControl,
  IconButton,
  Input,
  InputAdornment,
  InputLabel,
  Link,
  Radio,
  Snackbar,
  TextField,
  Typography,
} from "@material-ui/core";
import { ApplyDetailPanel } from "./applyDetailPanel";
import { PATCH_ERROR_CODE } from "../applyPatchData";
import ShowResourcesDialog from "./showResourcesDialog";
import Alert from "@material-ui/lab/Alert";

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

interface IApplyPatchPanel {
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

function solutionProposal(rowData: any, clickAction: any): any {
  let body: any = "";

  if (rowData.data) {

    switch (rowData.data.error_number) {
      case PATCH_ERROR_CODE.OK:
        break;
      case PATCH_ERROR_CODE.OLD_RESOURCES:
        body =
          <>
            <Typography>
              Aplicar<Radio
                checked={rowData.applyScope == "only_new"}
                onChange={() => clickAction(rowData, "apply_resource", "only_new")}
              />somente mais novos ou<Radio
                checked={rowData.applyScope == "all"}
                onChange={() => clickAction(rowData, "apply_resource", "all")}
              />todos.
            </Typography>
            <Typography>
              Ver
          <Link onClick={() => clickAction(rowData, "apply_resource", "show")}> recursos </Link>
          do pacote.
        </Typography>
          </>
        break;
      case PATCH_ERROR_CODE.APPLY_DENIED:
        body = <Typography>
          <Link onClick={() => clickAction(rowData, "apply_resource", "remove")}>Remover</Link>.
        </Typography>;
        break;
      default:
        body = ""
        break;
    }
    return (
      <div color="secondary">
        {body}
      </div>
    )
  }

  return <></>
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

interface IEnableActions {
  validate: boolean;
  apply: boolean;
  deleteAll: boolean;
}

const initEnableActions: IEnableActions = {
  validate: false,
  apply: false,
  deleteAll: false,
}

export default function ApplyPatchPanel(props: IApplyPatchPanel) {
  memento = useMemento(
    props.vscode,
    "APPLY_PATCH_PANEL",
    ApplyPatchPanelAction.DoUpdateState,
    DEFAULT_TABLE(),
    props.memento
  );

  const [rows, setRows] = React.useState([]);
  const [subtitle, setSubtitle] = React.useState("");
  const [enableActions, setEnableActions] = React.useState<IEnableActions>(initEnableActions);
  const [pageSize, setPageSize] = React.useState(memento.get(propPageSize()));
  const [filtering, setFiltering] = React.useState(false);
  const [openDialog, setOpenDialog] = React.useState({
    showResources: false,
    resources: [],
  });

  const clickEvent = (rowData: any, id: string, action: string) => {
    if (action == "show") {
      setOpenDialog({ ...openDialog, showResources: true, resources: rowData.data.data });
    } else if (action == "remove") {
      doRemovePatch(rowData);
    } else {
      props.vscode.postMessage({
        action: ApplyPatchPanelAction.UpdateData,
        content: { file: rowData.fullpath, id: id, value: action }
      });
    }
  };

  if (listener === undefined) {
    listener = (event: MessageEvent) => {
      const message = event.data; // The JSON data our extension sent

      switch (message.command) {
        case ApplyPatchPanelAction.InformationFile: {
          //setLocked(message.data);

          break;
        }
        case ApplyPatchPanelAction.UpdatePage: {
          const rows: any[] = [];

          message.data.applyPatchData.patchFiles.forEach((row) => {
            rows.push({ ...row, soluction: solutionProposal(row, clickEvent) })
          });

          setRows(rows);
          setSubtitle(message.data.serverName);
          setEnableActions({
            validate: message.data.validate,
            apply: message.data.apply,
            deleteAll: message.data.deleteAll
          });
          break;
        }
        default:
          console.log("***** ATTENTION: applyPatchPanel.tsx");
          console.log("\tCommand not recognized: " + message.command);
          break;
      }
    };

    window.addEventListener("message", listener);
  }

  const doOrderChange = (orderBy: number, direction: string) => {
    const columns = propColumns().columns;

    memento.set(propOrderBy(columns[orderBy]["field"]));
    memento.set(propOrderDirection(direction));
  };

  const handleSelectFileButtonClick = (e: any) => {
    const target: any = event.target;
    const files: any[] = [];

    for (let index = 0; index < target.files.length; index++) {
      const element = { name: target.files[index].name, fullpath: target.files[index].path };
      files.push(element);
    }

    props.vscode.postMessage({
      action: ApplyPatchPanelAction.SelectFile,
      content: { files: files }
    });
  };

  const doChangeRowsPerPage = (value: number) => {
    setPageSize(value);
    memento.set(propPageSize(value));
  };

  const doRemovePatch = (rowData: any) => {
    props.vscode.postMessage({
      action: ApplyPatchPanelAction.RemoveFile,
      content: { processAll: false, file: rowData.fullpath }
    });
  }
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

  actions.push({
    icon: applyPatchIcons.table.Delete,
    tooltip: i18n.localize("REMOVE_PATCH", "Remove patch"),
    disabled: !enableActions.deleteAll,
    onClick: (event, rowData) => {
      doRemovePatch(rowData);
    },
  });

  actions.push({
    icon: applyPatchIcons.table.Check,
    tooltip: i18n.localize("VALIDATE_PATCH", "Validate patch"),
    isFreeAction: true,
    disabled: !enableActions.validate,
    onClick: (event, rowData) => {
      props.vscode.postMessage({
        action: ApplyPatchPanelAction.ValidateFile,
        content: { processAll: true, file: "" }
      });
    },
  });

  actions.push({
    icon: applyPatchIcons.apply,
    tooltip: i18n.localize("APPLY_PATCH", "Apply patch"),
    isFreeAction: true,
    disabled: !enableActions.apply,
    onClick: (event, rowData) => {
      props.vscode.postMessage({
        action: ApplyPatchPanelAction.Apply,
        content: { processAll: true, file: "" }
      });
    },
  });

  actions.push((rowData) => ({
    icon: applyPatchIcons.table.Check,
    tooltip: i18n.localize("VALIDATE_PATCH", "Validate patch"),
    disabled: !enableActions.validate,
    onClick: (event, rowData) => {
      props.vscode.postMessage({
        action: ApplyPatchPanelAction.ValidateFile,
        content: { processAll: false, file: rowData.fullpath }
      });
    },
  }));

  actions.push((rowData) => ({
    icon: applyPatchIcons.apply,
    tooltip: i18n.localize("APPLY_PATCH", "Apply patch"),
    disabled: !(enableActions.apply && rowData.status == "valid"),
    onClick: (event, rowData) => {
      props.vscode.postMessage({
        action: ApplyPatchPanelAction.Apply,
        content: { processAll: false, file: rowData.fullpath }
      });
    },
  }));

  actions.push({
    icon: applyPatchIcons.table.Delete,
    tooltip: i18n.localize("REMOVE_PATCH_ALL", "Remove all patch"),
    isFreeAction: true,
    disabled: !enableActions.deleteAll,
    onClick: () => {
      props.vscode.postMessage({
        action: ApplyPatchPanelAction.RemoveFile,
        content: { processAll: true, file: "" }
      });
    },
  });

  const style = useToolbarStyles();
  const btnFile = React.createRef<any>();
  const targetUploadFile = React.createRef<any>();

  return (
    <ApplyPatchTheme>
      <Paper variant="outlined">
        <MaterialTable
          components={{
            Toolbar: (props) => (
              <div>
                <Title
                  title={
                    props.validate
                      ? i18n.localize("VALIDATE_PATCH", "Validate Patch")
                      : i18n.localize("APPLY_PATCH", "Apply Patch")
                  }
                  subtitle={subtitle}
                />

                <FormControl fullWidth>
                  <Input
                    ref={targetUploadFile}
                    value={""}
                    placeholder={"Select patch files to apply"}
                    onChange={() => { }}
                    endAdornment={
                      <InputAdornment position="end">
                        <IconButton onClick={() => { btnFile.current.click() }}>
                          <CloudUploadIcon />
                        </IconButton>
                      </InputAdornment>
                    }
                  />
                  <input
                    hidden={true}
                    type="file"
                    accept=".ptm,.zip,.upd"
                    multiple
                    onChange={(e) => handleSelectFileButtonClick(e)}
                    ref={btnFile}
                  />
                </FormControl>

                <MTableToolbar {...props} />
              </div>
            ),
          }}
          localization={i18n.materialTableLocalization}
          icons={applyPatchIcons.table}
          columns={rows.length ? buildColumns(memento) : []}
          data={rows}
          parentChildData={(row, rows) => rows.find((a) => {
            return row.zipFile === a.fullpath
          })}
          options={{
            searchFieldAlignment: "left",
            searchFieldStyle: { marginLeft: "-16px" },
            showTextRowsSelected: false,
            emptyRowsWhenPaging: false,
            pageSize: pageSize,
            pageSizeOptions: [10, 50, 100],
            paginationType: "normal",
            thirdSortClick: false,
            selection: false,
            showSelectAllCheckbox: true,
            grouping: false,
            filtering: filtering,
            exportButton: false,
            padding: "dense",
            actionsColumnIndex: 0,
            columnsButton: false,
            sorting: false,
            showTitle: false,
            toolbarButtonAlignment: "right",
            defaultExpanded: false,

          }}
          actions={actions}
          onChangeRowsPerPage={(value) => doChangeRowsPerPage(value)}
          onOrderChange={(orderBy, direction) =>
            doOrderChange(orderBy, direction)
          }
          detailPanel={[
            {
              icon: applyPatchIcons.info,
              tooltip: 'Show pack details',
              render: (rowData) => <ApplyDetailPanel vscode={props.vscode} patchFileInfo={rowData} />
            },
          ]}
        />
      </Paper>

      <Alert severity="warning">
          It is recommended to back up the RPO before applying updates.
      </Alert>

      <ShowResourcesDialog
        open={openDialog.showResources}
        resources={openDialog.resources}
        onClose={() => { setOpenDialog({ ...openDialog, showResources: false, resources: [] }) }}
      />

    </ApplyPatchTheme>
  );
}
