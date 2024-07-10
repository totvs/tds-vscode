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

import "./applyPatch.css";
import React from "react";
import { TdsPage, tdsVscode } from "@totvs/tds-webtoolkit";
import { SubmitHandler, useFieldArray, useForm } from "react-hook-form";
import { CommonCommandEnum, ReceiveMessage, sendSaveAndClose } from "@totvs/tds-webtoolkit";
import {
  TdsForm, TdsLabelField, TdsSelectionFileField, TdsSimpleCheckBoxField, TdsSimpleTextField,
  TdsTextField, TdsProgressRing,
  setDataModel, setErrorModel
} from "@totvs/tds-webtoolkit";
import { VSCodeButton, VSCodeDataGrid, VSCodeDataGridCell, VSCodeDataGridRow } from "@vscode/webview-ui-toolkit/react";
import { ApplyPatchCommand, TApplyPatchModel, TPatchFileData } from "tds-shared/lib";
import { ApplyPatchCommandEnum, EMPTY_APPLY_PATCH_MODEL, EMPTY_PATCH_FILE } from "tds-shared/lib/models/applyPatchModel";

enum ReceiveCommandEnum {
}

type ReceiveCommand = ReceiveMessage<CommonCommandEnum & ReceiveCommandEnum, TApplyPatchModel>;

const ROWS_LIMIT: number = 5;

export default function ApplyPatchView() {
  const methods = useForm<TApplyPatchModel>({
    defaultValues: EMPTY_APPLY_PATCH_MODEL && {
      patchFiles: Array(ROWS_LIMIT).map(() => {
        return EMPTY_PATCH_FILE;
      })
    },
    mode: "all"
  })

  const { fields, remove, insert } = useFieldArray(
    {
      control: methods.control,
      name: "patchFiles"
    });

  const onSubmit: SubmitHandler<TApplyPatchModel> = (data) => {
    data.patchFiles = data.patchFiles.filter((patchFile: TPatchFileData) => patchFile.uri !== undefined);

    sendSaveAndClose(data);
  }

  React.useEffect(() => {
    let listener = (event: any) => {
      const command: ReceiveCommand = event.data as ReceiveCommand;

      switch (command.command) {
        case CommonCommandEnum.UpdateModel:
          const model: TApplyPatchModel = command.data.model;
          const errors: any = command.data.errors;

          while (model.patchFiles.length < ROWS_LIMIT) {
            model.patchFiles.push(EMPTY_PATCH_FILE);
          }

          setDataModel<TApplyPatchModel>(methods.setValue, model);
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

  function removePatchFile(index: number) {
    remove(index);
    insert(index, EMPTY_PATCH_FILE);
  }

  function infoPatchFile(index: number) {
    sendGetInfo(methods.getValues(), index);
  }

  function sendGetInfo(model: any, index: number) {
    tdsVscode.postMessage({
      command: ApplyPatchCommandEnum.GET_INFO_PATCH,
      data: {
        model: model,
        index: index,
      }
    });
  }

  const model: TApplyPatchModel = methods.getValues();
  const indexFirstPathFree: number = model.patchFiles.findIndex((row: TPatchFileData) => row.uri == undefined);
  const isProcessing: boolean = model.patchFiles.filter((row: TPatchFileData) => row.isProcessing).length > 0;

  return (
    <TdsPage title={tdsVscode.l10n.t("Apply Patch")} linkToDoc="[Apply Patch]servers.md#registro-de-servidores">
      <TdsForm<TApplyPatchModel> methods={methods}
        onSubmit={onSubmit}
      >

        <section className="tds-row-container" >
          <TdsTextField
            name="serverName"
            label={tdsVscode.l10n.t("Server name")}
            info={tdsVscode.l10n.t("Target Server Identifier")}
            readOnly={true}
          />

          <TdsTextField
            name="address"
            label={tdsVscode.l10n.t("Address")}
            info={tdsVscode.l10n.t("Target server address")}
            readOnly={true}
          />

          <TdsTextField
            name="environment"
            label={tdsVscode.l10n.t("Environment")}
            info={tdsVscode.l10n.t("Target environment")}
            readOnly={true}
          />
        </section>

        <TdsLabelField
          name="patchFilesLabel"
          label={tdsVscode.l10n.t("Patch Files")}
        />

        <section className="tds-row-container" >
          <VSCodeDataGrid id="patchGrid" grid-template-columns="60px 1fr 2fr">
            {model && model.patchFiles.map((row: TPatchFileData, index: number) => (
              <VSCodeDataGridRow key={index}>
                {row.uri !== undefined &&
                  <>
                    <VSCodeDataGridCell grid-column="1">
                      {row.isProcessing
                        ? <TdsProgressRing size="small" />
                        : <>
                          <VSCodeButton appearance="icon"
                            onClick={() => removePatchFile(index)} >
                            <span className="codicon codicon-close"></span>
                          </VSCodeButton>
                          <VSCodeButton appearance="icon"
                            onClick={() => infoPatchFile(index)} >
                            <span className="codicon codicon-info"></span>
                          </VSCodeButton>
                        </>
                      }
                      {row.validation == "OK" &&
                        <VSCodeButton appearance="icon" >
                          <span className="codicon codicon-check"></span>
                        </VSCodeButton>
                      }
                    </VSCodeDataGridCell>
                    <VSCodeDataGridCell grid-column="2">
                      <TdsSimpleTextField
                        name={`patchFiles.${index}.name`}
                        readOnly={true}
                        info={row.name}
                      />
                    </VSCodeDataGridCell>
                    <VSCodeDataGridCell grid-column="3">
                      <TdsSimpleTextField
                        name={`patchFiles.${index}.uri`}
                        readOnly={true}
                        info={row.uri}
                      />
                    </VSCodeDataGridCell>
                  </>
                }
                {((row.uri == undefined) && (index !== indexFirstPathFree)) &&
                  <>
                    <VSCodeDataGridCell grid-column="1">
                      &nbsp;
                    </VSCodeDataGridCell>
                    <VSCodeDataGridCell grid-column="2">
                      &nbsp;
                    </VSCodeDataGridCell>
                  </>
                }
                {(index === indexFirstPathFree) &&
                  <>
                    <VSCodeDataGridCell grid-column="1">
                      &nbsp;
                    </VSCodeDataGridCell>
                    <VSCodeDataGridCell grid-column="2">
                      <TdsSelectionFileField
                        name={`btnSelectFile.${index}`}
                        canSelectMany={true}
                        title={tdsVscode.l10n.t("Select the update package(s)")}
                        filters={
                          {
                            "Patch file": ["PTM", "ZIP", "UPD"]
                          }
                        }
                        readOnly={isProcessing}
                      />
                    </VSCodeDataGridCell>
                  </>
                }
              </VSCodeDataGridRow>
            ))}
          </VSCodeDataGrid>
        </section>

        <TdsSimpleCheckBoxField
          name="applyOldFiles"
          label={tdsVscode.l10n.t("Apply old files")}
          textLabel={tdsVscode.l10n.t("Apply old files")} />
      </TdsForm>
    </TdsPage >
  );
}


