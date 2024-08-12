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

import "./importSourcesOnlyResult.css";
import { getCloseActionForm, getDefaultActionsForm, IFormAction, TdsDataGrid, TdsFormActionsEnum, TdsPage, TdsProgressRing, tdsVscode, TTdsDataGridColumnDef } from "@totvs/tds-webtoolkit";
import React from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { CommonCommandEnum, ReceiveMessage } from "@totvs/tds-webtoolkit";
import { TdsForm, setDataModel } from "@totvs/tds-webtoolkit";
import { BuildResultCommandEnum, EMPTY_IMPORT_SOURCES_ONLY_RESULT_MODEL, ImportSourcesOnlyResultCommandEnum, TImportSourcesOnlyResultData, TImportSourcesOnlyResultModel } from "@tds-shared/index";

enum ReceiveCommandEnum {
}
type ReceiveCommand = ReceiveMessage<CommonCommandEnum & ReceiveCommandEnum, TImportSourcesOnlyResultModel>;

export default function ImportSourcesOnlyResultView() {
  const methods = useForm<TImportSourcesOnlyResultModel>({
    defaultValues: EMPTY_IMPORT_SOURCES_ONLY_RESULT_MODEL(),
    mode: "all"
  })
  const [dataSource, setDataSource] = React.useState<TImportSourcesOnlyResultData[]>([]);

  const onSubmit: SubmitHandler<TImportSourcesOnlyResultModel> = (data) => {
    //not applicable
  }

  React.useEffect(() => {
    const listener = (event: any) => {
      const command: ReceiveCommand = event.data as ReceiveCommand;

      switch (command.command) {
        case CommonCommandEnum.UpdateModel:
          const model: TImportSourcesOnlyResultModel = command.data.model;

          model.sourceObj.forEach((row: TImportSourcesOnlyResultData, index: number, array: TImportSourcesOnlyResultData[]) => {
            array[index].compileDate = new Date(row.compileDate);
          });

          setDataModel(methods.setValue, model);
          setDataSource(model.sourceObj);

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

  const columnsDef = (): TTdsDataGridColumnDef[] => {
    return [
      {
        type: "string",
        name: "name",
        label: "Source",
        width: "6fr",
        sortable: true,
        sortDirection: "asc",
      },
      {
        type: "datetime",
        name: "compileDate",
        label: "Compilation Date",
        width: "3fr",
        sortable: true,
        sortDirection: ""
      }
    ];
  }

  const sendExportTxt = (model: any) => {
    tdsVscode.postMessage({
      command: ImportSourcesOnlyResultCommandEnum.EXPORT,
      data: {
        type: "text",
        model: model
      }
    });
  }

  const sendExportCsv = (model: any) => {
    tdsVscode.postMessage({
      command: BuildResultCommandEnum.Export,
      data: {
        type: "csv",
        model: model
      }
    });
  }

  const formActions: IFormAction[] = [getCloseActionForm()];

  formActions.push({
    id: "btnExportTxt",
    caption: tdsVscode.l10n.t("Export (TXT)"),
    isProcessRing: true,
    type: "button",
    onClick: () => {
      sendExportTxt(methods.getValues());
    }
  });
  formActions.push({
    id: "btnExportCsv",
    caption: tdsVscode.l10n.t("Export (CSV)"),
    isProcessRing: true,
    type: "button",
    onClick: () => {
      sendExportCsv(methods.getValues());
    }
  });

  const model: TImportSourcesOnlyResultModel = methods.getValues();

  return (
    <TdsPage title="TDS-Replay Sources Result">
      <TdsForm<TImportSourcesOnlyResultModel>
        methods={methods}
        onSubmit={onSubmit}
        actions={formActions}
      >
        {model.sourceObj.length == 0
          ? <TdsProgressRing size="full" />
          : <TdsDataGrid id={"importSource"}
            columnsDef={columnsDef()}
            dataSource={model.sourceObj}
            options={{
            }}
          />
        }
      </TdsForm>
    </TdsPage>
  );
}
