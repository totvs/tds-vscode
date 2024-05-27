import "./applyPatch.css";
import React from "react";
import { TdsPage, tdsVscode } from "@totvs/tds-webtoolkit";
import { SubmitHandler, useFieldArray, useForm } from "react-hook-form";
import { CommonCommandEnum, ReceiveMessage, sendSaveAndClose } from "@totvs/tds-webtoolkit";
import { TdsForm, TdsLabelField, TdsSelectionFileField, TdsSimpleCheckBoxField, TdsSimpleTextField, TdsTextField, setDataModel, setErrorModel } from "@totvs/tds-webtoolkit";
import { VSCodeButton, VSCodeDataGrid, VSCodeDataGridCell, VSCodeDataGridRow, VSCodeProgressRing } from "@vscode/webview-ui-toolkit/react";
import { TPatchFileData } from "tds-shared/lib";

enum ReceiveCommandEnum {
}

type ReceiveCommand = ReceiveMessage<CommonCommandEnum & ReceiveCommandEnum, TFields>;

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
  isProcessing: false,
  fsPath: ""
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
        case CommonCommandEnum.UpdateModel:
          const model: TFields = command.data.model;
          const errors: any = command.data.errors;

          while (model.patchFiles.length < ROWS_LIMIT) {
            model.patchFiles.push(EMPTY_PATCH_FILE);
          }

          console.dir(model)

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
    sendGetInfo(methods.getValues(), index);
  }

  const model: TFields = methods.getValues();
  const indexFirstPathFree: number = model.patchFiles.findIndex((row: TPatchFileData) => row.uri == undefined);
  const isProcessing: boolean = model.patchFiles.filter((row: TPatchFileData) => row.isProcessing).length > 0;

  return (
    <TdsPage title={tdsVscode.l10n.t("Apply Patch")} linkToDoc="[Apply Patch]servers.md#registro-de-servidores">
      <TdsForm<TFields>
        onSubmit={onSubmit}
        methods={methods}>

        <section className="tds-row-container" >
          <TdsTextField
            methods={methods}
            name="serverName"
            label={tdsVscode.l10n.t("Server name")}
            info={tdsVscode.l10n.t("Target Server Identifier")}
            readOnly={true}
          />
          <TdsTextField
            methods={methods}
            name="address"
            label={tdsVscode.l10n.t("Address")}
            info={tdsVscode.l10n.t("Target server address")}
            readOnly={true}
          />
        </section>

        <TdsTextField
          methods={methods}
          name="environment"
          label={tdsVscode.l10n.t("Environment")}
          info={tdsVscode.l10n.t("Target environment")}
          readOnly={true}
        />

        <TdsLabelField
          methods={methods}
          name="patchFilesLabel"
          label={tdsVscode.l10n.t("Patch Files")}
        />

        <section className="tds-row-container" >
          <VSCodeDataGrid id="patchGrid" grid-template-columns="30px 60px 15rem 20rem">
            {model && model.patchFiles.map((row: TPatchFileData, index: number) => (
              <VSCodeDataGridRow key={index}>
                {row.uri !== undefined &&
                  <>
                    <VSCodeDataGridCell grid-column="1">
                      {row.isProcessing ?
                        <VSCodeProgressRing className="tds-progress-ring" />
                        :
                        <VSCodeButton appearance="icon"
                          onClick={() => removePatchFile(index)} >
                          <span className="codicon codicon-close"></span>
                        </VSCodeButton>
                      }
                    </VSCodeDataGridCell>
                    <VSCodeDataGridCell grid-column="2">
                      {!row.isProcessing &&
                        <VSCodeButton appearance="icon"
                          onClick={() => infoPatchFile(index)} >
                          <span className="codicon codicon-info"></span>
                        </VSCodeButton>
                      }
                      {row.validation == "OK" &&
                        <VSCodeButton appearance="icon" >
                          <span className="codicon codicon-check"></span>
                        </VSCodeButton>
                      }
                    </VSCodeDataGridCell>
                    <VSCodeDataGridCell grid-column="3">
                      <TdsSimpleTextField
                        methods={methods}
                        name={`patchFiles.${index}.name`}
                        readOnly={true}
                        info={row.name}
                      />
                    </VSCodeDataGridCell>
                    <VSCodeDataGridCell grid-column="4">
                      <TdsSimpleTextField
                        methods={methods}
                        name={`patchFiles.${index}.fsPath`}
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
                      &nbsp;
                    </VSCodeDataGridCell>
                    <VSCodeDataGridCell grid-column="2">
                      <TdsSelectionFileField
                        methods={methods}
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
          methods={methods}
          name="applyOldFiles"
          label={tdsVscode.l10n.t("Apply old files")}
          textLabel={tdsVscode.l10n.t("Apply old files")} />
      </TdsForm>
    </TdsPage >
  );
}

function sendGetInfo(arg0: TFields, index: number) {
  throw new Error("Function not implemented.");
}

