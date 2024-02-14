import "./applyPatch.css";
import TdsPage from "../components/page";
import React from "react";
import { FormProvider, SubmitHandler, useFieldArray, useForm } from "react-hook-form";
import { CommonCommandFromPanelEnum, ReceiveMessage, sendSaveAndClose } from "../utilities/common-command-webview";
import { TdsCheckBoxField, TdsForm, TdsLabelField, TdsSelectionFileField, TdsSelectionFolderField, TdsSimpleCheckBoxField, TdsSimpleTextField, TdsTextField, setDataModel, setErrorModel } from "../components/form";
import { VSCodeButton, VSCodeDataGrid, VSCodeDataGridCell, VSCodeDataGridRow, VSCodeProgressRing } from "@vscode/webview-ui-toolkit/react";
import { TPatchFileData } from "../model/applyPatchModel";
import { onCaptureLoggers } from './../../../src/loggerCapture/logger';

enum ReceiveCommandEnum {
}
type ReceiveCommand = ReceiveMessage<CommonCommandFromPanelEnum & ReceiveCommandEnum, TFields>;

type TFields = {
  serverName: string;
  address: string;
  environment: string;
  patchFiles: TPatchFileData[];
  applyOldFiles: boolean;
}

const EMPTY_PATCH_FILE: TPatchFileData = {
  name: "",
  uri: undefined,
  validation: "",
  tphInfo: {},
  isProcessing: false
}

const ROWS_LIMIT: number = 5;

export default function ApplyPatchView() {
  const methods = useForm<TFields>({
    defaultValues: {
      serverName: "",
      address: "",
      patchFiles: Array(ROWS_LIMIT).map(() => {
        return EMPTY_PATCH_FILE;
      }),
      applyOldFiles: false
    },
    mode: "all"
  })

  const { fields, remove, insert } = useFieldArray(
    {
      control: methods.control,
      name: "patchFiles"
    });

  const onSubmit: SubmitHandler<TFields> = (data) => {
    data.patchFiles = data.patchFiles.filter((patchFile: TPatchFileData) => patchFile.uri !== undefined);

    sendSaveAndClose(data);
  }

  React.useEffect(() => {
    let listener = (event: any) => {
      const command: ReceiveCommand = event.data as ReceiveCommand;

      switch (command.command) {
        case CommonCommandFromPanelEnum.UpdateModel:
          const model: TFields = command.data.model;
          const errors: any = command.data.errors;

          while (model.patchFiles.length < ROWS_LIMIT) {
            model.patchFiles.push(EMPTY_PATCH_FILE);
          }

          setDataModel<TFields>(methods.setValue, model);
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
    remove(index);
    //insert(index, { path: "" });
  }

  const model: TFields = methods.getValues();
  const indexFirstPathFree: number = model.patchFiles.findIndex((row: TPatchFileData) => row.uri == undefined);

  return (
    <main>
      <TdsPage title="Apply Patch" linkToDoc="[Apply Patch]servers.md#registro-de-servidores">
        <FormProvider {...methods} >
          <TdsForm<TFields>
            onSubmit={onSubmit}
            methods={methods}>

            <section className="tds-row-container" >
              <TdsTextField
                name="serverName"
                label="Server name"
                info="Identificador do servidor alvo"
                readOnly={true}
              />
              <TdsTextField
                name="address"
                label="Address"
                info="Endereço do servidor alvo"
                readOnly={true}
              />
            </section>

            <TdsTextField
              name="environment"
              label="Environment"
              info="Ambiente  alvo"
              readOnly={true}
            />

            <TdsLabelField
              name="patchFilesLabel"
              label={"Patch Files"}
            />

            <section className="tds-row-container" >
              <VSCodeDataGrid id="patchGrid" grid-template-columns="30px 30px 15rem 20rem">
                {model && model.patchFiles.map((row: TPatchFileData, index: number) => (
                  <VSCodeDataGridRow key={index}>
                    {row.uri !== undefined &&
                      <>
                        <VSCodeDataGridCell grid-column="1">
                          <VSCodeButton appearance="icon"
                            onClick={() => removePatchFile(index)} >
                            <span className="codicon codicon-close"></span>
                          </VSCodeButton>
                        </VSCodeDataGridCell>
                        <VSCodeDataGridCell grid-column="2">
                          <VSCodeButton appearance="icon"
                            onClick={() => infoPatchFile(index)} >
                            <span className="codicon codicon-info"></span>
                          </VSCodeButton>
                        </VSCodeDataGridCell>
                        <VSCodeDataGridCell grid-column="3">
                          <TdsSimpleTextField
                            name={`patchFiles.${index}.name`}
                            readOnly={true}
                            info={row.name}
                          />
                        </VSCodeDataGridCell>
                        <VSCodeDataGridCell grid-column="4">
                          <TdsSimpleTextField
                            name={`patchFiles.${index}.uri.fsPath`}
                            readOnly={true}
                            info={row.uri.fsPath}
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
                          {row.isProcessing &&
                            <VSCodeProgressRing className="tds-progress-ring" />
                          }
                        </VSCodeDataGridCell>
                        <VSCodeDataGridCell grid-column="2">
                        <TdsSelectionFileField
                            name={`btnSelectFile.${index}`}
                            canSelectMany={true}
                            title={"Selecione o(s) pacote(s) de atualização"}
                            filters={
                              {
                                "Patch file": ["PTM", "ZIP", "UPD"]
                              }
                            }
                          />
                        </VSCodeDataGridCell>
                      </>
                    }
                  </VSCodeDataGridRow>
                ))}
              </VSCodeDataGrid>
              <div id="patchInfo" className="tds-field-container">
                Painel de informação

              </div>
            </section>

            <TdsSimpleCheckBoxField
              name="applyOldFiles"
              label="Apply old files"
              textLabel={"Apply old files"} />
          </TdsForm>
        </FormProvider>
      </TdsPage >
    </main >
  );
}
