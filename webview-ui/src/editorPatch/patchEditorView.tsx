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

import "./patchEditor.css";
import React from "react";
import { TTdsDataGridColumnDef, TdsDataGrid, TdsForm, TdsPage, tdsVscode } from "@totvs/tds-webtoolkit";
import { useForm } from "react-hook-form";
import { CommonCommandEnum, ReceiveMessage } from "@totvs/tds-webtoolkit";
import { setDataModel, setErrorModel } from "@totvs/tds-webtoolkit";
import { TPatchEditorModel } from "tds-shared/lib";
import { EMPTY_PATCH_EDITOR_MODEL, TPatchInfo } from "tds-shared/lib/models/patchEditorModel";

enum ReceiveCommandEnum {
}

type ReceiveCommand = ReceiveMessage<CommonCommandEnum & ReceiveCommandEnum, TPatchEditorModel>;

function objectColumns(): TTdsDataGridColumnDef[] {

  const result: TTdsDataGridColumnDef[] = [
    {
      type: "string",
      name: "name",
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
    },
    {
      type: "string",
      name: "type",
      label: tdsVscode.l10n.t("Type"),
      width: "4fr",
      sortable: true,
      sortDirection: "",
    },
    {
      type: "number",
      displayType: "int",
      name: "size",
      label: tdsVscode.l10n.t("Size"),
      width: "4fr",
      sortable: true,
      sortDirection: "",
    },
    {
      type: "string",
      name: "buildType",
      label: tdsVscode.l10n.t("Build Type"),
      width: "4fr",
      sortable: true,
      sortDirection: "",
    }
  ];

  return result;
}

export default function PatchEditorView() {
  const methods = useForm<TPatchEditorModel>({
    defaultValues: EMPTY_PATCH_EDITOR_MODEL,
    mode: "all"
  })
  const [dataSource, setDataSource] = React.useState<TPatchInfo[]>([]);

  React.useEffect(() => {

    let listener = (event: any) => {
      const command: ReceiveCommand = event.data as ReceiveCommand;

      switch (command.command) {
        case CommonCommandEnum.UpdateModel:
          const model: TPatchEditorModel = command.data.model;
          const errors: TPatchEditorModel = command.data.errors;

          model.patchInfo.forEach((row: TPatchInfo, index: number, array: TPatchInfo[]) => {
            array[index].date = new Date(array[index].date);
          });

          setDataModel(methods.setValue, model);
          setErrorModel(methods.setError, errors as any);
          setDataSource(model.patchInfo);
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

  return (
    <TdsPage title={tdsVscode.l10n.t("Patch Objects")} >
      <TdsForm
        onSubmit={methods.handleSubmit(() => { })}
        methods={methods}
        description={tdsVscode.l10n.t("**File:** `{0}` **Size:** `{1} bytes (~{2} KBytes)`", methods.getValues("filename"),
          tdsVscode.l10n.formatNumber(methods.getValues("lengthFile"), "int"),
          tdsVscode.l10n.formatNumber(methods.getValues("lengthFile") / 1024, "float", 1))
        }
      >
        <TdsDataGrid
          id="patchEditorGrid"
          columnDef={objectColumns()}
          dataSource={dataSource}
          options={{
            // sortable: true,
            // grouping:
          }}
        />
      </TdsForm>
    </TdsPage >
  );
}