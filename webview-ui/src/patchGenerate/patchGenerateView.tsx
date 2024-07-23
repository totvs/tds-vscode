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

import { VSCodeButton } from "@vscode/webview-ui-toolkit/react";

import "./patchGenerate.css";
import React from "react";
import { TTdsDataGridAction, TTdsDataGridColumnDef, TdsDataGrid, TdsLabelField, TdsPage, tdsVscode } from "@totvs/tds-webtoolkit";
import { SubmitHandler, useForm } from "react-hook-form";
import { CommonCommandEnum, ReceiveMessage, sendSaveAndClose } from "@totvs/tds-webtoolkit";
import { TdsForm, TdsTextField, setDataModel, setErrorModel, TdsSelectionFolderField } from "@totvs/tds-webtoolkit";
import { TGeneratePatchFromRpoModel, TInspectorObject, PatchGenerateCommandEnum, EMPTY_GENERATE_PATCH_FROM_RPO_MODEL } from "tds-shared/lib";

enum ReceiveCommandEnum {
  MOVE_TO_LEFT = "moveToLeft",
  MOVE_TO_RIGHT = "moveToRight"
}

type ReceiveCommand = ReceiveMessage<CommonCommandEnum & ReceiveCommandEnum, TGeneratePatchFromRpoModel>;

function sendToRight(model: any, selectedObject: TInspectorObject[]) {
  tdsVscode.postMessage({
    command: PatchGenerateCommandEnum.MoveElements,
    data: {
      model: model,
      selectedObject: selectedObject,
      direction: "right"
    }
  });
}

function sendToLeft(model: any, selectedObject: TInspectorObject[]) {
  tdsVscode.postMessage({
    command: PatchGenerateCommandEnum.MoveElements,
    data: {
      model: model,
      selectedObject: selectedObject,
      direction: "left"
    }
  });
}

interface IPatchGenerateViewProps {
  isServerP20OrGreater: boolean;
}
//FIX: REVISAR PROCESSO. MUITO RUIM.
let selectedObjects: Record<string, string[]> = {};

export default function PatchGenerateView(props: IPatchGenerateViewProps) {
  const methods = useForm<TGeneratePatchFromRpoModel>({
    defaultValues: EMPTY_GENERATE_PATCH_FROM_RPO_MODEL(),
    mode: "all",
    // values: props.
  })
  const watchObjectsLeft: any = methods.watch("objectsLeft");
  const watchObjectsRight: any = methods.watch("objectsRight");

  const onSubmit: SubmitHandler<TGeneratePatchFromRpoModel> = (data) => {
    data.objectsRight = data.objectsRight.filter((object: TInspectorObject) => object.source.length > 0);

    sendSaveAndClose(data);
  }

  const columnsDef = (isServerP20OrGreater: boolean): TTdsDataGridColumnDef[] => {
    const columnDef: TTdsDataGridColumnDef[] = [
      {
        type: "boolean",
        name: "checked",
        label: " ",
        width: "2fr",
        sortable: false,
        readOnly: false,
        onChange: (e: any, fieldName: string, row: any) => {
          e.preventDefault();
          const target = e.target as HTMLInputElement;
          const targetField: string = fieldName.split(".")[0];

          if (selectedObjects[targetField]) {
            const i: number = selectedObjects[targetField].indexOf(row.source);
            if (i > -1) {
              delete selectedObjects[targetField][i];
            } else {
              selectedObjects[targetField].push(row.source);
            }
          } else {
            selectedObjects[targetField] = [];
            selectedObjects[targetField].push(row.source);
          }

          return target.checked;

        }
      },
      {
        type: "string",
        name: "source",
        label: "Object",
        width: "3fr",
        sortable: true,
        sortDirection: "asc",
      },
      {
        type: "datetime",
        name: "date",
        label: "Date",
        width: "3fr",
        sortable: true,
        sortDirection: ""
      }
    ];

    if (isServerP20OrGreater) {
      columnDef.push({
        type: "string",
        name: "source_status",
        label: tdsVscode.l10n.t("Status"),
        width: "2fr",
        lookup: {
          N: "NoAuth",
          P: "Prod",
          D: "Dev"
        },
        sortable: false,
        grouping: true,
      });

      columnDef.push({
        type: "string",
        name: "rpo_status",
        label: tdsVscode.l10n.t("RPO"),
        width: "2fr",
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

    return columnDef;
  }

  React.useEffect(() => {

    let listener = (event: any) => {
      const command: ReceiveCommand = event.data as ReceiveCommand;

      switch (command.command) {
        case CommonCommandEnum.UpdateModel:
          const model: TGeneratePatchFromRpoModel = command.data.model;
          const errors: TGeneratePatchFromRpoModel = command.data.errors;

          model.objectsLeft.forEach((row: TInspectorObject, index: number, array: TInspectorObject[]) => {
            array[index].date = new Date(array[index].date);
            array[index].checked = false;
          });
          model.objectsRight.forEach((row: TInspectorObject, index: number, array: TInspectorObject[]) => {
            array[index].date = new Date(array[index].date);
            array[index].checked = false;
          });

          setDataModel(methods.setValue, model);
          setErrorModel(methods.setError, errors as any);
          selectedObjects = {}
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

  const sendIncludeTRes = (model: any, includeTRes: boolean) => {
    tdsVscode.postMessage({
      command: PatchGenerateCommandEnum.IncludeTRes,
      data: {
        model: model,
        includeTRes: includeTRes
      }
    });
  }

  const topActions: TTdsDataGridAction[] = [{
    id: "btnIncludeTRes",
    caption: methods.getValues("includeTRes") ? tdsVscode.l10n.t("Exclude TRES") : tdsVscode.l10n.t("Include TRES"),
    type: "button",
    onClick: () => {
      sendIncludeTRes(methods.getValues(), !methods.getValues("includeTRes"));
    }
  }];

  const selectResource = (id: string, label: string, dataSource: any[], showIncludeTRes: boolean, modelField: string) => {

    return (
      <section className="tds-grid-container select-resource-component">
        <TdsLabelField
          key={`resource_name_${id}`}
          name="resource_name"
          className="tds-bold" label={label} />
        <TdsDataGrid
          key={`data_grid_${id}`}
          id={id}
          columnDef={columnsDef(props.isServerP20OrGreater)}
          dataSource={dataSource}
          options={{
            topActions: showIncludeTRes ? topActions : [],
            grouping: false
          }}>
        </TdsDataGrid>
      </section>
    )
  }

  return (
    <TdsPage title={tdsVscode.l10n.t("Patch Generation from RPO")}>
      <TdsForm methods={methods}
        onSubmit={onSubmit}>
        <section className="tds-row-container">
          <TdsTextField
            name="patchDest"
            label={tdsVscode.l10n.t("Output Folder")}
            info={tdsVscode.l10n.t("Enter the destination folder of the generated update package")}
            readOnly={true}
            rules={{ required: true }}
          />

          <TdsSelectionFolderField
            openLabel={tdsVscode.l10n.t("Output Folder")}
            info={tdsVscode.l10n.t("Select the destination folder of the generated update package")}
            name="btn-patchDest"
            title={tdsVscode.l10n.t("Select Output Directory")}
          />

          <TdsTextField
            name="patchName"
            label={tdsVscode.l10n.t("Output Patch Filename")}
            info={tdsVscode.l10n.t("Enter update package name.")}
          />

        </section>

        <section className="tds-row-container" id="selectGrid" >
          {watchObjectsLeft && selectResource("objects_left", tdsVscode.l10n.t("RPO Objects"),
            methods.getValues("objectsLeft"), true, "objectsLeft")}

          <section className="tds-row-container-column" id="directionButtons" >
            <VSCodeButton appearance="icon" onClick={() => {
              const objects = methods.getValues("objectsLeft").filter((value) =>
                selectedObjects["objects_left"].indexOf(value.source) > -1);

              sendToRight(methods.getValues(), objects);
            }} >
              <span className="codicon codicon-arrow-right"></span>
            </VSCodeButton>
            <VSCodeButton appearance="icon" onClick={() => {
              const objects = methods.getValues("objectsRight").filter((value) =>
                selectedObjects["objects_right"].indexOf(value.source) > -1);

              sendToLeft(methods.getValues(), objects);
            }} >
              <span className="codicon codicon-arrow-left"></span>
            </VSCodeButton>
          </section>

          {watchObjectsRight && selectResource("objects_right", tdsVscode.l10n.t("To patch"),
            methods.getValues("objectsRight"), false, "objectsRight")}
        </section>
      </TdsForm>
    </TdsPage>
  );
}
