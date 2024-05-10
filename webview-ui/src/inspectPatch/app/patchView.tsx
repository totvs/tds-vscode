import * as React from "react";
//import MaterialTable from "material-table";
import { i18n, PatchTheme, patchViewIcons } from "../helper";
import Paper from "@material-ui/core/Paper";
import { ApplyViewAction } from "../actions";
import { EmptyPatchData, IPatchData } from "../patchData";

interface IPatchViewPanel {
  vscode: any;
}

let listener: any = undefined;

const cellDefaultStyle = {
  cellStyle: {
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
    //maxWidth: "30em",
    minWidth: "8em",
    padding: "0px",
    paddingLeft: "5px",
    paddingRight: "5px"
  },
  headerStyle: {
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
    maxWidth: "30em",
    minWidth: "8em",
    padding: "0px",
    paddingLeft: "5px",
    paddingRight: "5px"
  }
};

function headCells(): any[] {
  return [
    {
      field: "name",
      title: i18n.localize("NAME", "Name"),
      ...cellDefaultStyle,
    }, {
      field: "date",
      title: i18n.localize("DATE", "Date"),
      ...cellDefaultStyle,
    }, {
      field: "size",
      title: i18n.localize("SIZE", "Size"),
      type: "numeric",
      ...cellDefaultStyle,
    },
    //  {
    //   field: "buildType",
    //   title: i18n.localize("BUILD_TYPE", "Build Type"),
    //   ...cellDefaultStyle,
    // },
    {
      field: "type",
      title: i18n.localize("TYPE", "Type"),
      ...cellDefaultStyle,
    }
  ];
}

export function PatchView(props: IPatchViewPanel) {
  const [patchData, setPatchData] = React.useState<IPatchData>(EmptyPatchData);

  if (listener === undefined) {
    listener = (event: MessageEvent) => {
      const { action, content } = event.data;
      switch (action) {
        case ApplyViewAction.Init: {
          setPatchData(content);
          break;
        }
      }
    };

    window.addEventListener("message", listener);
    props.vscode.postMessage({ action: ApplyViewAction.Ready });
  }

  /*
          <MaterialTable
          title={patchData.filename}
          localization={i18n.materialTableLocalization}
          icons={patchViewIcons.table}
          columns={headCells()}
          data={patchData.patchInfo}
          options={{
            filtering: false,
            showTitle: true,
            pageSize: 10,
            pageSizeOptions: [10, 50, 100],
            paginationType: "normal",
            thirdSortClick: true,
            grouping: true
          }}
        />
          */
  return (
    <PatchTheme>
      <Paper variant="outlined">
      </Paper>
    </PatchTheme>
  );
}
