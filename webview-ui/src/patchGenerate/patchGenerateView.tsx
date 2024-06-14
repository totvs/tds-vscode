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
import { TTdsDataGridAction, TTdsDataGridColumnDef, TdsDataGrid, TdsPage, tdsVscode } from "@totvs/tds-webtoolkit";
import { SubmitHandler, UseFormReturn, useFieldArray, useForm, useFormContext } from "react-hook-form";
import { CommonCommandEnum, ReceiveMessage, sendSaveAndClose } from "@totvs/tds-webtoolkit";
import { TdsForm, TdsTextField, TdsLabelField, setDataModel, setErrorModel, TdsSelectionFolderField } from "@totvs/tds-webtoolkit";
import { TGeneratePatchFromRpoModel, TInspectorObject, PatchGenerateCommandEnum, TFieldError } from "tds-shared/lib";

enum ReceiveCommandEnum {
  MOVE_TO_LEFT = "moveToLeft",
  MOVE_TO_RIGHT = "moveToRight"
}

type ReceiveCommand = ReceiveMessage<CommonCommandEnum & ReceiveCommandEnum, TGeneratePatchFromRpoModel>;

const EMPTY_MODEL: TGeneratePatchFromRpoModel = {
  patchDest: "", //(vscode.getState() | {})["patchDest"],
  patchName: "", //(vscode.getState() | {})["patchName"],
  includeTRes: false,
  objectsLeft: [],
  objectsRight: [],
}

type TSelectObjectComponentProps = {
  id?: string;
  label: string;
  fieldName: string;
  showIncludeTRes: boolean;
  isServerP20OrGreater: boolean;
}

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

function sendIncludeTRes(model: any, includeTRes: boolean) {
  tdsVscode.postMessage({
    command: PatchGenerateCommandEnum.IncludeTRes,
    data: {
      model: model,
      includeTRes: includeTRes
    }
  });
}

function SelectResourceComponent(props: TSelectObjectComponentProps) {
  const { control, getValues } = useForm();
  const columnDef: TTdsDataGridColumnDef[] = [
    {
      type: "boolean",
      name: "checked",
      label: " ",
      width: "0.5fr",
      sortable: false,
      readOnly: false
    },
    {
      type: "string",
      name: "source",
      label: "Object",
      width: "3fr",
      sortable: true,
      sortDirection: "",
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

  if (props.isServerP20OrGreater) {
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

  const topActions: TTdsDataGridAction[] = [{
    id: "btnIncludeTRes",
    caption: getValues("includeTRes") ? tdsVscode.l10n.t("Exclude TRES") : tdsVscode.l10n.t("Include TRES"),
    type: "button",
    onClick: () => {
      sendIncludeTRes(getValues(), !getValues("includeTRes"));
    }
  }];

  return (
    <section className="tds-grid-container select-resource-component">
      {props.label && <TdsLabelField name={props.fieldName} label={props.label} />}
      <TdsDataGrid
        id={props.id ? props.id : props.fieldName}
        columnDef={columnDef}
        dataSource={(getValues(props.fieldName) || []) as TInspectorObject[]}
        options={{
          bottomActions: [],
          topActions: props.showIncludeTRes ? topActions : [],
          filter: true,
          pageSize: 50,
          pageSizeOptions: [50, 100, 250, 500],
          grouping: false
        }}>

      </TdsDataGrid>
    </section>
  );
}

interface IPatchGenerateViewProps {
  isServerP20OrGreater: boolean;
}

export default function PatchGenerateView(props: IPatchGenerateViewProps) {
  const methods = useForm<TGeneratePatchFromRpoModel>({
    defaultValues: EMPTY_MODEL,
    mode: "all"
  })
  const watchObjectsLeft: any = methods.watch("objectsLeft");
  const watchObjectsRight: any = methods.watch("objectsRight");

  const onSubmit: SubmitHandler<TGeneratePatchFromRpoModel> = (data) => {
    data.objectsRight = data.objectsRight.filter((object: TInspectorObject) => object.source.length > 0);

    sendSaveAndClose(data);
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
    <TdsPage title={tdsVscode.l10n.t("Patch Generation from RPO")} linkToDoc="[Geração de pacote de atualização]servers.md#registro-de-servidores">
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
          {watchObjectsLeft && <SelectResourceComponent
            isServerP20OrGreater={props.isServerP20OrGreater}
            fieldName="objectsLeft"
            label={tdsVscode.l10n.t("RPO Objects")}
            showIncludeTRes={true}
          />
          }
          <section className="tds-row-container-column" id="directionButtons" >
            <VSCodeButton appearance="icon" onClick={() => {
              const selectedObjects = methods.getValues("objectsLeft").filter((value) =>
                (typeof value.checked == "string") ? value.checked == "true" : value.checked);
              sendToRight(methods.getValues(), selectedObjects);
            }} >
              <span className="codicon codicon-arrow-right"></span>
            </VSCodeButton>
            <VSCodeButton appearance="icon" onClick={() => {
              const selectedObjects = methods.getValues("objectsRight").filter((value) =>
                (typeof value.checked == "string") ? value.checked == "true" : value.checked);

              sendToLeft(methods.getValues(), selectedObjects);
            }} >
              <span className="codicon codicon-arrow-left"></span>
            </VSCodeButton>
          </section>

          {watchObjectsRight && <SelectResourceComponent
            isServerP20OrGreater={props.isServerP20OrGreater}
            label={tdsVscode.l10n.t("To patch")}
            fieldName="objectsRight"
            showIncludeTRes={false}
          />
          }
        </section>
      </TdsForm>
    </TdsPage>
  );
}
