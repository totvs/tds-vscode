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
import "./patchGenerate.css";
import React from "react";
import { TTdsDataGridAction, TTdsDataGridColumnDef, TdsDataGrid, TdsLabelField, TdsPage, TdsProgressRing, tdsVscode } from "@totvs/tds-webtoolkit";
import { SubmitHandler, useForm } from "react-hook-form";
import { CommonCommandEnum, ReceiveMessage, sendSaveAndClose } from "@totvs/tds-webtoolkit";
import { TdsForm, TdsTextField, setDataModel, setErrorModel, TdsSelectionFolderField } from "@totvs/tds-webtoolkit";
import { TGeneratePatchFromRpoModel, TInspectorObject, PatchGenerateCommandEnum, EMPTY_GENERATE_PATCH_FROM_RPO_MODEL } from "@tds-shared/index";
import { useFieldArray } from 'react-hook-form';

enum ReceiveCommandEnum {
}

type ReceiveCommand = ReceiveMessage<CommonCommandEnum & ReceiveCommandEnum, TGeneratePatchFromRpoModel>;

interface IPatchGenerateViewProps {
  isServerP20OrGreater: boolean;
}

//FIX: REVISAR PROCESSO. MUITO RUIM.
let selectedObjects: Record<string, string[]> = {
  "objectsLeft": [],
  "objectsRight": []
};

export default function PatchGenerateView(props: IPatchGenerateViewProps) {
  const methods = useForm<TGeneratePatchFromRpoModel>({
    defaultValues: EMPTY_GENERATE_PATCH_FROM_RPO_MODEL(),
    mode: "all",
  })
  //const watchObjectsLeft: any = methods.watch("objectsLeft");
  //const watchObjectsRight: any = methods.watch("objectsRight");
  // const [objectsLeft, setObjectsLeft]: any = React.useState<TInspectorObject[]>([]);
  // const [objectsRight, setObjectsRight]: any = React.useState<TInspectorObject[]>([]);
  const { fields: fieldsLeft, insert: insertLeft, remove: removeLeft } = useFieldArray(
    {
      control: methods.control,
      name: "objectsLeft"
    });

  const { fields: fieldsRight, append: appendRight, remove: removeRight } = useFieldArray(
    {
      control: methods.control,
      name: "objectsRight"
    });

  const onSubmit: SubmitHandler<TGeneratePatchFromRpoModel> = (data) => {
    data.objectsRight = data.objectsRight.filter((object: TInspectorObject) => object.source.length > 0);
    data.objectsLeft = data.objectsLeft.filter((object: TInspectorObject) => object.source.length > 0);

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
          console.log(">>>>>>>>>>>> selectedObjects");

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

    const listener = (event: any) => {
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

  const sendIncludeTRes = (model: any, includeTRes: boolean) => {
    tdsVscode.postMessage({
      command: PatchGenerateCommandEnum.IncludeTRes,
      data: {
        model: model,
        includeTRes: includeTRes
      }
    });
  }

  const sendImportTXT = (model: any) => {
    tdsVscode.postMessage({
      command: PatchGenerateCommandEnum.ImportTxt,
      data: {
        model: model
      }
    });
  }

  const topActionsLeft: TTdsDataGridAction[] = [
    {
      id: "btnIncludeTRes",
      caption: methods.getValues("includeTRes") ? tdsVscode.l10n.t("Exclude TRES") : tdsVscode.l10n.t("Include TRES"),
      type: "button",
      onClick: () => {
        sendIncludeTRes(methods.getValues(), !methods.getValues("includeTRes"));
      }
    }
  ];

  const topActionsRight: TTdsDataGridAction[] = [
    {
      id: "btnImportTxt",
      caption: tdsVscode.l10n.t("Import (TXT)"),
      type: "button",
      onClick: () => {
        sendImportTXT({
          ...methods.getValues()
        });
      }
    }
  ];

  const selectResource = (id: string, label: string, dataSource: any[], topActions: TTdsDataGridAction[]) => {
    const forceRefresh: number = Date.now();
    console.log(">>> selectResource", id)

    return (
      <section className="tds-grid-container select-resource-component">
        <TdsLabelField
          key={`resource_name_${id}`}
          name="resource_name"
          className="tds-bold" label={label} />
        <TdsDataGrid
          key={`data_grid_${id}_${forceRefresh}`}
          id={id}
          columnsDef={columnsDef(props.isServerP20OrGreater)}
          dataSource={dataSource}
          options={{
            topActions: topActions,
            grouping: false
          }}>
        </TdsDataGrid>
      </section>
    )
  }

  const model: TGeneratePatchFromRpoModel = methods.getValues();

  return (
    <TdsPage id="patchGenerateView">
      <TdsForm
        name="frmPatchGenerate"
        onSubmit={methods.handleSubmit(onSubmit)}>
        {(!model.isReady) && <TdsProgressRing size="full" />}
        {(model.isReady) &&
          <>
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
              {selectResource("objectsLeft", tdsVscode.l10n.t("RPO Objects"),
                model.objectsLeft, topActionsLeft)}

              <section className="tds-row-container-column" id="directionButtons" >
                {/* <VSCodeButton appearance="icon" onClick={() => {
                  console.log(">> filtered",
                    methods.getValues("objectsLeft").filter((value: TInspectorObject) => value.checked)
                  );

                  const objects: TInspectorObject[] = methods.getValues("objectsLeft").filter((value: TInspectorObject) =>
                    selectedObjects["objectsLeft"].indexOf(value.source) > -1)
                    .map((value: TInspectorObject) => {
                      value.checked = false;
                      return value;
                    });

                  console.log(">>>> toRight", objects)

                  appendRight(objects);

                  const indexes: number[] = methods.getValues("objectsLeft").map((value: TInspectorObject, index: number) => {
                    if (selectedObjects["objectsLeft"].indexOf(value.source) > -1) {
                      return index;
                    }

                    return -1;
                  }).filter((value: number) => value !== -1);

                  console.log(">> to Del", indexes);
                  removeLeft(indexes);

                  selectedObjects["objectsLeft"] = [];

                }} >
                  <span className="codicon codicon-arrow-right"></span>
                </VSCodeButton>
                <VSCodeButton appearance="icon" onClick={() => {
                  const objects = methods.getValues("objectsRight").filter((value) =>
                    selectedObjects["objectsRight"].indexOf(value.source) > -1);
                  console.log(">>>> toLeft", objects)

                  // sendToLeft({
                  //   ...methods.getValues()
                  // }, objects);
                }} >
                  <span className="codicon codicon-arrow-left"></span>
                </VSCodeButton> */}
              </section>

              {selectResource("objectsRight", tdsVscode.l10n.t("To patch"),
                model.objectsRight, topActionsRight)}
            </section>
          </>
        }
      </TdsForm>
    </TdsPage>
  );
}
