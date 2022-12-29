import * as React from "react";
import MaterialTable, { MTableToolbar } from "material-table";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import { rpoInfoIcons } from "../helper/rpoInfoIcons";
import { IRpoInfoPanelAction, RpoInfoPanelAction } from "../actions";
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
} from "./rpoInfoPanelMemento";
import { i18n } from "../helper";
import RpoInfoTheme, {
  inputTextStyles,
  useToolbarStyles,
} from "../helper/theme";
import { IRpoInfoData, IRpoPatch } from "../rpoPath";
import {
  FilledInput,
  FormControl,
  Grid,
  Input,
  InputLabel,
  SvgIconProps,
  Typography,
} from "@material-ui/core";
import TreeView from "@material-ui/lab/TreeView";
import TreeItem, { TreeItemProps } from "@material-ui/lab/TreeItem";
import TextField from "@material-ui/core/TextField";
import Label from "@material-ui/icons/Label";
import SaveAlt from "@material-ui/icons/SaveAlt";

interface RenderTree {
  id: string;
  name: string;
  children?: RenderTree[];
  rpoPatch?: IRpoPatch;
}

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

const useTreeItemStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      color: theme.palette.text.secondary,
      "&:hover > $content": {
        backgroundColor: theme.palette.action.hover,
      },
      "&:focus > $content, &$selected > $content": {
        backgroundColor: `var(--tree-view-bg-color, ${theme.palette.grey[400]})`,
        color: "var(--tree-view-color)",
      },
      "&:focus > $content $label, &:hover > $content $label, &$selected > $content $label":
        {
          backgroundColor: "transparent",
        },
    },
    content: {
      color: theme.palette.text.secondary,
      borderTopRightRadius: theme.spacing(2),
      borderBottomRightRadius: theme.spacing(2),
      paddingRight: theme.spacing(1),
      //fontWeight: theme.typography.fontWeightMedium,
      "$expanded > &": {
        fontWeight: theme.typography.fontWeightRegular,
      },
    },
    group: {
      marginLeft: 0,
      "& $content": {
        paddingLeft: theme.spacing(2),
      },
    },
    expanded: {},
    selected: {},
    label: {
      fontWeight: "inherit",
      color: "inherit",
    },
    labelRoot: {
      display: "flex",
      alignItems: "center",
      padding: theme.spacing(0.5, 0),
    },
    labelIcon: {
      marginRight: theme.spacing(1),
    },
    labelText: {
      fontWeight: "inherit",
      flexGrow: 1,
    },
  })
);

type StyledTreeItemProps = TreeItemProps & {
  bgColor?: string;
  color?: string;
  labelIcon: React.ElementType<SvgIconProps>;
  labelInfo?: string;
  labelText: string;
};

declare module "csstype" {
  interface Properties {
    "--tree-view-color"?: string;
    "--tree-view-bg-color"?: string;
  }
}

function StyledTreeItem(props: StyledTreeItemProps) {
  const classes = useTreeItemStyles();
  const {
    labelText,
    labelIcon: LabelIcon,
    labelInfo,
    color,
    bgColor,
    ...other
  } = props;

  return (
    <TreeItem
      label={
        <div className={classes.labelRoot}>
          <LabelIcon color="inherit" className={classes.labelIcon} />
          <Typography variant="body2" className={classes.labelText}>
            {labelText}
          </Typography>
          <Typography variant="caption" color="inherit">
            {labelInfo}
          </Typography>
        </div>
      }
      classes={{
        root: classes.root,
        content: classes.content,
        expanded: classes.expanded,
        selected: classes.selected,
        group: classes.group,
        label: classes.label,
      }}
      {...other}
    />
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

export default function RpoLogPanel(props: IRpoInfoPanel) {
  memento = useMemento(
    props.vscode,
    "RPO_INFO_PANEL",
    RpoInfoPanelAction.DoUpdateState,
    DEFAULT_TABLE(),
    props.memento
  );

  const [rows, setRows] = React.useState([]);
  const [currentNode, setCurrentNode] = React.useState<IRpoPatch>();
  const [data, setData] = React.useState<RenderTree>();
  const [subtitle, setSubtitle] = React.useState();
  const [rpoInfo, setRpoInfo] = React.useState<any>(null);
  const [pageSize, setPageSize] = React.useState(memento.get(propPageSize()));
  const [filtering, setFiltering] = React.useState(false);
  const [columns] = React.useState(buildColumns(memento));

  if (listener === undefined) {
    listener = (event: MessageEvent) => {
      const message = event.data; // The JSON data our extension sent

      switch (message.command) {
        case RpoInfoPanelAction.UpdateRpoInfo: {
          const rpoInfo: IRpoInfoData = message.data.rpoInfo;
          const treeNodes: any = message.data.treeNodes;

          setData(treeNodes);
          setSubtitle(message.data.serverName);
          setRpoInfo({
            version: rpoInfo.rpoVersion,
            date: rpoInfo.dateGeneration,
            environment: rpoInfo.environment,
          });
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

  const doOrderChange = (orderBy: number, direction: string) => {
    const columns = propColumns().columns;

    if (columns[orderBy] === null || columns[orderBy] === undefined) {
      memento.set(propOrderBy(0));
    } else {
      memento.set(propOrderBy(columns[orderBy]["field"]));
      memento.set(propOrderDirection(direction));
    }
  };

  const doChangeRowsPerPage = (value: number) => {
    setPageSize(value);
    memento.set(propPageSize(value));
  };

  const actions = [];

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
      let command: IRpoInfoPanelAction = {
        action: RpoInfoPanelAction.ExportToTxt,
        content: {
          rpoInfo: rpoInfo,
          rpoPath: currentNode,
        },
      };

      props.vscode.postMessage(command);
    },
  });

  const findNode = (id: string, children: RenderTree[]): RenderTree => {
    let result: RenderTree = null;

    children.forEach((element: RenderTree) => {
      if (element.id == id) {
        result = element;
      } else if (element.children && element.children.length != 0) {
        const result2 = findNode(id, element.children);
        if (result2) {
          result = result2;
        }
      }
    });

    return result;
  };

  const doClickNode = (
    event: React.MouseEvent<HTMLElement, MouseEvent>,
    id: string
  ) => {
    event.preventDefault();

    const currentNode: RenderTree = findNode(id, data.children);
    if (currentNode && currentNode.rpoPatch) {
      setRows(currentNode.rpoPatch.programsApp);
      setCurrentNode(currentNode.rpoPatch);
    } else {
      setRows([]);
      setCurrentNode(null);
    }
  };

  const renderTree = (nodes: RenderTree) => (
    <StyledTreeItem
      nodeId={"node_" + nodes.id}
      labelText={nodes.name}
      labelIcon={Label}
      onClick={(event) => doClickNode(event, nodes.id)}
    >
      {Array.isArray(nodes.children)
        ? nodes.children.map((node) => renderTree(node))
        : null}
    </StyledTreeItem>
  );

  const toolBarStyle = useToolbarStyles();
  const inputTextClasses = inputTextStyles();
  const rpo = rpoInfo || { version: "", date: "", environment: "" };

  return (
    <RpoInfoTheme>
      <Paper variant="outlined">
        <Grid container spacing={2}>
          <Grid item xs={2}>
            <Grid container>
              <Grid item container direction="column" className={inputTextClasses.root}>
                <Typography variant="overline" display="block" gutterBottom>
                  RPO
                </Typography>
                <TextField
                  margin="dense"
                  label="Date"
                  variant="outlined"
                  disabled
                  size="small"
                  value={rpo.date}
                  multiline={true}
                  rows={2}
                />
                <TextField
                  margin="dense"
                  label="Version"
                  variant="outlined"
                  disabled
                  size="small"
                  value={rpo.version}
                />
              </Grid>

              <Grid item>
                <TreeView
                  defaultExpanded={["node_" + rpo.environment]}
                  defaultCollapseIcon={rpoInfoIcons.arrowDropDown}
                  defaultExpandIcon={rpoInfoIcons.arrowRight}
                  defaultEndIcon={<div style={{ width: 24 }} />}
                >
                  {data && renderTree(data)}
                </TreeView>
              </Grid>
            </Grid>
          </Grid>

          <Grid item xs={10}>
            <MaterialTable
              components={{
                Toolbar: (props) => (
                  <div>
                    <Title
                      title={i18n.localize("RPO_LOG", "Repository Log")}
                      subtitle={
                        subtitle
                          ? subtitle
                          : i18n.localize("INITIALIZING", "(initializing)")
                      }
                    />

                    <Grid container>
                      <Grid item container xs={6}>
                        <Grid item xs={12}>
                          <Typography variant="overline" gutterBottom>
                            Generation
                          </Typography>
                        </Grid>
                        <Grid item xs>
                          <TextField
                            margin="dense"
                            label="Date"
                            variant="outlined"
                            disabled
                            size="small"
                            value={
                              currentNode && currentNode.dateFileGeneration
                            }
                          />
                        </Grid>
                        <Grid item xs>
                          <TextField
                            margin="dense"
                            label="Build"
                            variant="outlined"
                            disabled
                            size="small"
                            value={
                              currentNode && currentNode.buildFileGeneration
                            }
                          />
                        </Grid>
                      </Grid>

                      <Grid item container xs={6}>
                        <Grid item xs={12}>
                          <Typography variant="overline" gutterBottom>
                            Application
                          </Typography>
                        </Grid>
                        <Grid item xs>
                          <TextField
                            margin="dense"
                            label="Date"
                            variant="outlined"
                            disabled
                            size="small"
                            value={
                              currentNode && currentNode.dateFileApplication
                            }
                          />
                        </Grid>
                        <Grid item xs>
                          <TextField
                            margin="dense"
                            label="Build"
                            variant="outlined"
                            disabled
                            size="small"
                            value={
                              currentNode && currentNode.buildFileApplication
                            }
                          />
                        </Grid>
                      </Grid>

                      <Grid container item xs={12}>
                        <Typography
                          hidden={!currentNode || !currentNode.skipOld}
                          variant="h6"
                          color="secondary"
                        >
                          This file overwrote more recent resources.
                        </Typography>
                      </Grid>
                    </Grid>

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
                selection: false,
                grouping: false,
                filtering: filtering,
                exportButton: false,
                padding: "dense",
                actionsColumnIndex: 0,
                columnsButton: false,
                sorting: true,
                showTitle: false,
                toolbarButtonAlignment: "right",
              }}
              actions={actions}
              onChangeRowsPerPage={(value) => doChangeRowsPerPage(value)}
              onOrderChange={(orderBy, direction) =>
                doOrderChange(orderBy, direction)
              }
            />
          </Grid>
        </Grid>
      </Paper>
    </RpoInfoTheme>
  );
}
