/*
Copyright 2021 TOTVS S.A

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

  http: //www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

import "./inspectObject.css";
import React from "react";
import { TTdsDataGridAction, TTdsDataGridColumnDef, TdsDataGrid, TdsForm, TdsPage, tdsVscode } from "@totvs/tds-webtoolkit";
import { useForm } from "react-hook-form";
import { CommonCommandEnum, ReceiveMessage } from "@totvs/tds-webtoolkit";
import { setDataModel, setErrorModel } from "@totvs/tds-webtoolkit";
import { sendExport, sendIncludeOutScope } from "./sendCommand";
import { Key } from 'vscode-extension-tester';

enum ReceiveCommandEnum {
}

type ReceiveCommand = ReceiveMessage<CommonCommandEnum & ReceiveCommandEnum, TFields>;

type TInspectorObject = {
  source: string;
  date: Date;
  rpo_status: string | number;
  source_status: string | number;
  function: string;
  line: number;
}

type TInspectorObjectModel = {
  includeOutScope: boolean;
  filter: string;
  objects: TInspectorObject[];
  rowsLimit: number | 100 | 250 | 500;
}

type TFields = TInspectorObjectModel;

function objectColumns(isServerP20OrGreater: boolean): TTdsDataGridColumnDef[] {
  const result: TTdsDataGridColumnDef[] = [
    {
      type: "string",
      name: "source",
      label: tdsVscode.l10n.t("Object Name"),
      width: "8fr",
      sortable: true,
      sortDirection: "asc",
    },
    {
      type: "datetime",
      name: "date",
      label: tdsVscode.l10n.t("Compile Date"),
      width: "8fr",
      sortable: true,
      sortDirection: "",
    }
  ];

  if (isServerP20OrGreater) {
    result.push({
      type: "string",
      name: "source_status",
      label: tdsVscode.l10n.t("Status"),
      width: "3fr",
      lookup: {
        N: "NoAuth",
        P: "Prod",
        D: "Dev"
      },
      sortable: false,
      grouping: true,
    });

    result.push({
      type: "string",
      name: "rpo_status",
      label: tdsVscode.l10n.t("Status RPO"),
      width: "4fr",
      lookup: {
        N: "None",
        D: "Default",
        T: "Tlpp",
        C: "Custom",
      },
      sortable: false,
      grouping: true,
    });
  }

  return result;
}

function functionColumns(isServerP20OrGreater: boolean): TTdsDataGridColumnDef[] {
  const result: TTdsDataGridColumnDef[] = [
    {
      type: "string",
      name: "function",
      label: tdsVscode.l10n.t("Function"),
      width: "12fr",
      sortable: true,
      sortDirection: "asc",
    },
    {
      type: "number",
      name: "line",
      label: tdsVscode.l10n.t("Line"),
      width: "3fr",
      sortable: true,
      sortDirection: "",
    },
    {
      type: "string",
      name: "source",
      label: tdsVscode.l10n.t("Source"),
      width: "8fr",
      sortable: true,
      sortDirection: "",
    },
    {
      type: "datetime",
      name: "date",
      label: tdsVscode.l10n.t("Compile Date"),
      width: "8fr",
      sortable: true,
      sortDirection: "",
    }
  ];

  if (isServerP20OrGreater) {
    result.push({
      type: "string",
      name: "source_status",
      label: tdsVscode.l10n.t("Status"),
      width: "3fr",
      lookup: {
        N: "NoAuth",
        P: "Prod",
        D: "Dev"
      },
      sortable: false,
      grouping: true,
    });
    result.push({
      type: "string",
      name: "rpo_status",
      label: tdsVscode.l10n.t("Status RPO"),
      width: "4fr",
      lookup: {
        N: "None",
        D: "Default",
        T: "Tlpp",
        C: "Custom",
      },
      sortable: false,
      grouping: true,
    });
  }

  return result;
}

const EMPTY_MODEL: TFields = {
  includeOutScope: false,
  filter: "",
  objects: [],
  rowsLimit: 100
}

export type TInspectorObjectComponentProps = {
  inspector: "objects" | "functions";
  isServerP20OrGreater: boolean
}

export default function InspectObjectView(props: TInspectorObjectComponentProps) {
  const methods = useForm<TFields>({
    defaultValues: EMPTY_MODEL,
    mode: "all"
  })

  const [dataSource, setDataSource] = React.useState<TInspectorObject[]>([]);

  React.useEffect(() => {

    let listener = (event: any) => {
      const command: ReceiveCommand = event.data as ReceiveCommand;

      switch (command.command) {
        case CommonCommandEnum.UpdateModel:
          const model: TFields = command.data.model;
          const errors: TFields = command.data.errors;

          model.objects.forEach((row: TInspectorObject, index: number, array: TInspectorObject[]) => {
            array[index].date = new Date(array[index].date);
          });

          setDataModel(methods.setValue, model);
          setErrorModel(methods.setError, errors as any);
          console.log("UpdateModel", model);
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

  const bottomActions: TTdsDataGridAction[] = [{
    id: "btnExportTxt",
    caption: tdsVscode.l10n.t("Export (TXT)"),
    isProcessRing: true,
    enabled: methods.formState.isValid,
    type: "button",
    onClick: () => {
      sendExport(methods.getValues(), "TXT");
    }
  }, {
    id: "btnExportCsv",
    caption: tdsVscode.l10n.t("Export (CSV)"),
    isProcessRing: true,
    enabled: methods.formState.isValid,
    type: "button",
    onClick: () => {
      sendExport(methods.getValues(), "CSV");
    }
  }];

  const topActions: TTdsDataGridAction[] = [{
    id: "btnIncludeOutScope",
    caption:
      props.inspector == "objects"
        ? methods.getValues("includeOutScope") ? tdsVscode.l10n.t("Exclude TRES") : tdsVscode.l10n.t("Include TRES")
        : methods.getValues("includeOutScope") ? tdsVscode.l10n.t("Exclude sources without public elements") : tdsVscode.l10n.t("Include sources without public elements"),
    type: "button",
    onClick: () => {
      sendIncludeOutScope(methods.getValues(), !methods.getValues("includeOutScope"));
    }
  }];

  let columnDef: TTdsDataGridColumnDef[] = props.inspector == "objects"
    ? objectColumns(props.isServerP20OrGreater)
    : functionColumns(props.isServerP20OrGreater);

  return (
    <TdsPage title={
      props.inspector == "objects"
        ? tdsVscode.l10n.t("Objects Inspector")
        : tdsVscode.l10n.t("Functions Inspector")
    } linkToDoc="">
      <TdsForm
        onSubmit={methods.handleSubmit(() => { })}
        methods={methods}
      >
        <TdsDataGrid
          id="inspectorObjectGrid"
          columnDef={columnDef}
          dataSource={dataSource}
          options={{
            bottomActions: bottomActions,
            topActions: topActions
          }}
        />
      </TdsForm>
    </TdsPage>
  );
}
