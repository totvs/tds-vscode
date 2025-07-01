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
import { TdsCheckBoxField, TdsPage, tdsVscode } from "@totvs/tds-webtoolkit";
import { SubmitHandler, useFieldArray, useForm } from "react-hook-form";
import { CommonCommandEnum, ReceiveMessage, sendSaveAndClose } from "@totvs/tds-webtoolkit";
import {
  TdsForm, TdsLabelField,
  TdsTextField,
  setDataModel, setErrorModel
} from "@totvs/tds-webtoolkit";
import { TApplyPatchModel, TPatchFileData } from "@tds-shared/index";
import { ApplyPatchCommandEnum, EMPTY_APPLY_PATCH_MODEL, EMPTY_PATCH_FILE } from "@tds-shared/index";

enum ReceiveCommandEnum {
}

type ReceiveCommand = ReceiveMessage<CommonCommandEnum & ReceiveCommandEnum, TApplyPatchModel>;

let serverData: {
  serverName: string;
  address: string;
  environment: string;
} = {
  serverName: "",
  address: "",
  environment: ""
};

export default function ApplyPatchView() {
  const methods = useForm<TApplyPatchModel>({
    defaultValues: EMPTY_APPLY_PATCH_MODEL(),
    mode: "all"
  })
  const [showOldFiles, setShowOldFiles] = React.useState<boolean>(false);
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
    const listener = (event: any) => {
      const command: ReceiveCommand = event.data as ReceiveCommand;

      switch (command.command) {
        case CommonCommandEnum.UpdateModel:
          const model: TApplyPatchModel = command.data.model;
          const errors: any = command.data.errors;
          let haveOldSourceError: boolean = false;

          setDataModel<TApplyPatchModel>(methods.setValue, model);
          setErrorModel(methods.setError, errors);

          serverData = {
            serverName: model.serverName,
            address: model.address,
            environment: model.environment
          }

          model.patchFiles.forEach((patchFileData: TPatchFileData) => {
            if (patchFileData.validation == tdsVscode.l10n.t("Source/resource files in patch older than RPO.")) {
              haveOldSourceError = true;
            }
          });

          setShowOldFiles(haveOldSourceError)

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

  React.useEffect(() => {

  }, [showOldFiles]);

  function removePatchFile(index: number) {
    remove(index);
    insert(index, EMPTY_PATCH_FILE());
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
  const isProcessing: boolean = model.patchFiles.filter((row: TPatchFileData) => row.isProcessing).length > 0;

  return (
    <TdsPage id="applyPatchView">
      <TdsForm<TApplyPatchModel>
        name="frmApplyPatch"
        onSubmit={methods.handleSubmit(onSubmit)}
        onManualReset={() => {
          methods.setValue("serverName", serverData.serverName);
          methods.setValue("address", serverData.address);
          methods.setValue("environment", serverData.environment);
          setShowOldFiles(false);
        }}
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
          {/* <VSCodeDataGrid id="patchGrid" grid-template-columns="90px 1fr 2fr">
            {model && model.patchFiles.map((row: TPatchFileData, index: number) => (
              <>
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
                            <VSCodeTag
                              onClick={() => infoPatchFile(index)} >
                              {tdsVscode.l10n.t("Info")}
                            </VSCodeTag>
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
                          key={`patchFiles.${index}.name`}
                          name={`patchFiles.${index}.name`}
                          readOnly={true}
                          info={row.name}
                        />
                      </VSCodeDataGridCell>
                      <VSCodeDataGridCell grid-column="3">
                        <TdsSimpleTextField
                          key={`patchFiles.${index}.uri`}
                          name={`patchFiles.${index}.uri`}
                          readOnly={true}
                          info={row.uri}
                        />
                      </VSCodeDataGridCell>
                    </>
                  }
                </VSCodeDataGridRow>

                {(row.validation.length > 0) &&
                  <VSCodeDataGridRow >
                    <VSCodeDataGridCell grid-column="1">
                      &nbsp;
                    </VSCodeDataGridCell>
                    <VSCodeDataGridCell grid-column="span 2">
                      {row.validation}
                    </VSCodeDataGridCell>
                  </VSCodeDataGridRow >
                }
              </>
            ))}

            <VSCodeDataGridRow >
              <VSCodeDataGridCell grid-column="1">
                &nbsp;
              </VSCodeDataGridCell>
              <VSCodeDataGridCell grid-column="2">
                <TdsSelectionFileField
                  name={`btnSelectFile.${model.patchFiles.length}`}
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
            </VSCodeDataGridRow>

          </VSCodeDataGrid> */}
        </section>

        {showOldFiles && <TdsCheckBoxField
          name="applyOldFiles"
          label={tdsVscode.l10n.t("Apply old files")}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            const patchFiles: TPatchFileData[] = methods.getValues("patchFiles");
            patchFiles.forEach((value: TPatchFileData, index: number) => {
              const error: string = methods.getFieldState(`patchFiles.${index}.name`).error.message;
              if (error == tdsVscode.l10n.t("Source/resource files in patch older than RPO.")) {
                methods.clearErrors(`patchFiles.${index}.name`);
              }
            });

          }}
          value={"applyOldFiles"}
          checked={false}
        />
        }
      </TdsForm>
    </TdsPage >
  );
}


