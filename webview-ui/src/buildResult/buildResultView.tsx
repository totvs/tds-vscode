/*
Copyright 2021-2024 TOTVS S.A

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

import "./buildResult.css";
import { IFormAction, TTdsDataGridColumnDef, TdsDataGrid, TdsFormActionsEnum, TdsPage, getDefaultActionsForm } from "@totvs/tds-webtoolkit";
import React from "react";
import { SubmitHandler, useFieldArray, useForm } from "react-hook-form";
import { CommonCommandEnum, ReceiveMessage } from "@totvs/tds-webtoolkit";
import { TdsForm, TdsLabelField, setDataModel, setErrorModel } from "@totvs/tds-webtoolkit";
import { tdsVscode } from '@totvs/tds-webtoolkit';
import { BuildResultCommandEnum, EMPTY_BUILD_RESULT_MODEL, TBuildResultModel } from "tds-shared/lib";

enum ReceiveCommandEnum {
}
type ReceiveCommand = ReceiveMessage<CommonCommandEnum & ReceiveCommandEnum, TBuildResultModel>

function columnsDef(): TTdsDataGridColumnDef[] {

  const result: TTdsDataGridColumnDef[] = [
    {
      type: "string",
      name: "filename",
      label: tdsVscode.l10n.t("Filename"),
      width: "8fr",
      sortable: true,
      sortDirection: "asc",
      row: 0
    },
    {
      type: "string",
      name: "message",
      label: tdsVscode.l10n.t("Message"),
      width: "10fr",
      sortable: true,
      sortDirection: "",
      row: 0
    },
    {
      type: "string",
      name: "status",
      label: tdsVscode.l10n.t("Status"),
      width: "4fr",
      sortable: true,
      sortDirection: "",
      row: 0
    },
    {
      type: "string",
      name: "detail",
      label: tdsVscode.l10n.t("Detail"),
      width: "10fr",
      sortable: true,
      sortDirection: "",
      row: 1
    },
    {
      type: "string",
      name: "uri",
      label: tdsVscode.l10n.t("Path"),
      width: "10fr",
      sortable: true,
      sortDirection: "",
      row: 1
    }
  ];

  return result;
}

export default function BuildResultView() {
  const methods = useForm<TBuildResultModel>({
    defaultValues: EMPTY_BUILD_RESULT_MODEL(),
    mode: "all"
  })

  const { fields, remove, insert } = useFieldArray(
    {
      control: methods.control,
      name: "buildInfos"
    });

  const onSubmit: SubmitHandler<TBuildResultModel> = (data) => {
    // no applicable
  }

  React.useEffect(() => {
    let listener = (event: any) => {
      const command: ReceiveCommand = event.data as ReceiveCommand;

      switch (command.command) {
        case CommonCommandEnum.UpdateModel:
          const model: TBuildResultModel = command.data.model;
          const errors: any = command.data.errors;

          model.timeStamp = new Date(model.timeStamp);

          setDataModel<TBuildResultModel>(methods.setValue, model);
          setErrorModel(methods.setError, errors);

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

  const sendExport = (model: any) => {
    tdsVscode.postMessage({
      command: BuildResultCommandEnum.Export,
      data: {
        model: model
      }
    });
  }

  const model: TBuildResultModel = methods.getValues();
  const formActions: IFormAction[] = getDefaultActionsForm().filter((action: IFormAction) => action.id == TdsFormActionsEnum.Close);
  formActions.push({
    id: "btnExportTxt",
    caption: tdsVscode.l10n.t("Export"),
    isProcessRing: true,
    type: "button",
    onClick: () => {
      sendExport(methods.getValues());
    }
  });

  return (
    <TdsPage title={tdsVscode.l10n.t("Build Result")}>
      <TdsForm<TBuildResultModel>
        methods={methods}
        onSubmit={onSubmit}
        actions={formActions}
        description={
          tdsVscode.l10n.t("Compilation results made at [{0}]", tdsVscode.l10n.formatDate(model.timeStamp)) +
            (model.returnCode != -1)
            ? ""
            : `**${tdsVscode.l10n.t("Compilation aborted.")}**`
        }>

        <TdsDataGrid id={"result_dataGrid"}
          columnDef={columnsDef()}
          dataSource={model.buildInfos}
          options={{
            grouping: false,
            rowSeparator: true
          }} />
      </TdsForm>
    </TdsPage>
  );
}

