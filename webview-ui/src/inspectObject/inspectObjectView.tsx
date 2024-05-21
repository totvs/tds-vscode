
import "./inspectObject.css";
import React from "react";
import { TdsPage, tdsVscode } from "@totvs/tds-webtoolkit";
import { UseFormReturn, useForm } from "react-hook-form";
import { CommonCommandEnum, ReceiveMessage } from "@totvs/tds-webtoolkit";
import { setDataModel, setErrorModel } from "@totvs/tds-webtoolkit";
import { sendExport, sendIncludeTRes } from "./sendCommand";
import TdsDataGrid, { TdsDataGridColumnDef } from "../_component/dataGrid/dataGrid";
import { TdsDataGridAction } from "../_component/dataGrid/paginator";

enum ReceiveCommandEnum {
}

type ReceiveCommand = ReceiveMessage<CommonCommandEnum & ReceiveCommandEnum, TFields>;

type TInspectorObject = {
  [key: string]: string | Date | number | boolean | undefined
  program: string;
  date: Date;
  status: string;
  rpo: string;
}

type TInspectorObjectModel = {
  includeTRes: boolean;
  filter: string;
  objects: TInspectorObject[];
  rowsLimit: number | 100 | 250 | 500;
}

type TFields = TInspectorObjectModel;

const EMPTY_INSPECTOR_OBJECT: TInspectorObject = {
  program: "",
  date: new Date(0, 0, 0, 0, 0, 0, 0),
  status: "",
  rpo: ""
}

const EMPTY_MODEL: TFields = {
  includeTRes: false,
  filter: "",
  objects: Array(10).map(() => EMPTY_INSPECTOR_OBJECT),
  rowsLimit: 100
}

type TInspectorObjectComponentProps = {
  methods: UseFormReturn<any>;
  id?: string;
  label: string;
  fieldName: string;
  rowsLimit: number;
}

export default function InspectObjectView() {
  const methods = useForm<TFields>({
    defaultValues: EMPTY_MODEL,
    mode: "all"
  })

  // const onSubmit: SubmitHandler<TFields> = (data) => {
  //   data.objectsRight = data.objectsRight.filter((object: TInspectorObject) => object.name.length > 0);

  //   sendSaveAndClose(data);
  // }
  const [dataSource, setDataSource] = React.useState<TInspectorObject[]>([]);

  React.useEffect(() => {

    let listener = (event: any) => {
      const command: ReceiveCommand = event.data as ReceiveCommand;

      switch (command.command) {
        case CommonCommandEnum.UpdateModel:
          const model: TFields = command.data.model;
          const errors: TFields = command.data.errors;

          // model.objectsFiltered = applyFilter(methods.getValues("filter") || "", model.objectsLeft);
          // model.warningManyItens = model.objectsFiltered.length > rowsLimit;
          //console.log("model", model);
          setDataModel(methods.setValue, model);
          setErrorModel(methods.setError, errors as any);
          setDataSource(model.objects);
          break;
        default:
          break;
      }
    };

    window.addEventListener('message', listener);

    return () => {
      window.removeEventListener('message', listener);
    }
  }, []);

  const model: TFields = methods.getValues();

  const bottomActions: TdsDataGridAction[] = [{
    id: "btnExportTxt",
    caption: tdsVscode.l10n.t("Export (TXT)"),
    isProcessRing: true,
    enabled: methods.formState.isValid,
    type: "button",
    onClick: () => {
      sendExport("TXT", methods.getValues());
    }
  }, {
    id: "btnExportCsv",
    caption: tdsVscode.l10n.t("Export (CSV)"),
    isProcessRing: true,
    enabled: methods.formState.isValid,
    type: "button",
    onClick: () => {
      sendExport("CSV", methods.getValues());
    }
  }];

  const topActions: TdsDataGridAction[] = [{
    id: "btnIncludeTes",
    caption: methods.getValues("includeTRes") ? tdsVscode.l10n.t("Exclude TRES") : tdsVscode.l10n.t("Include TRES"),
    type: "button",
    onClick: () => {
      sendIncludeTRes(methods.getValues(), !methods.getValues("includeTRes"));
    }
  }];

  const columnDef: TdsDataGridColumnDef[] = [
    {
      name: "program",
      label: tdsVscode.l10n.t("Object Name"),
      width: "8fr",
      sortable: true,
      sortDirection: "asc",
    },
    {
      name: "date",
      label: tdsVscode.l10n.t("Compile Date"),
      width: "8fr",
      sortable: true,
      sortDirection: "",
    },
    {
      name: "status",
      label: tdsVscode.l10n.t("Status"),
      width: "3fr",
      lookup: {
        N: "NoAuth",
        P: "Prod",
        D: "Dev"
      },
      sortable: false,
      grouping: true,
    },
    {
      name: "rpo",
      label: tdsVscode.l10n.t("RPO"),
      width: "3fr",
      lookup: {
        N: "None",
        D: "Default",
        T: "Tlpp",
        C: "Custom",
      },
      sortable: false,
      grouping: true,
    },
  ];

  return (
    <TdsPage title={tdsVscode.l10n.t("Objects Inspector")} linkToDoc="">
      <TdsDataGrid
        id="inspectorObjectGrid"
        methods={methods}
        columnDef={columnDef}
        dataSource={dataSource}
        options={{
          grouping: true,
          filter: true,
          bottomActions: bottomActions,
          topActions: topActions,
          pageSize: 10,
          pageSizeOptions: [10, 50, 100, 500, 1000],
        }}
      />
    </TdsPage>
  );
}
