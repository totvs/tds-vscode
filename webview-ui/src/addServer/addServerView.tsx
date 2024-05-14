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

import "./addServer.css";
import { TdsPage } from "@totvs/tds-webtoolkit";
import React from "react";
import { TIncludeData } from "../model/addServerModel";
import { SubmitHandler, useFieldArray, useForm } from "react-hook-form";
import { CommonCommandEnum, ReceiveMessage, sendSaveAndClose } from "@totvs/tds-webtoolkit";
import { TdsCheckBoxField, TdsForm, TdsLabelField, TdsNumericField, TdsSelectionField, TdsSelectionFolderField, TdsSimpleTextField, TdsTextField, setDataModel, setErrorModel } from "@totvs/tds-webtoolkit";
import { VSCodeButton, VSCodeDataGrid, VSCodeDataGridCell, VSCodeDataGridRow } from "@vscode/webview-ui-toolkit/react";
import { tdsVscode } from '@totvs/tds-webtoolkit';


enum ReceiveCommandEnum {
}
type ReceiveCommand = ReceiveMessage<CommonCommandEnum & ReceiveCommandEnum, TFields>;

type TFields = {
  serverType: string
  serverName: string;
  address: string;
  port: number | string;
  includePaths: TIncludeData[]
  immediateConnection: boolean,
  globalIncludeDirectories: string
}

const ROWS_LIMIT: number = 5;

export default function AddServerView() {
  const methods = useForm<TFields>({
    defaultValues: {
      serverName: "",
      address: "",
      port: "",
      includePaths: Array(ROWS_LIMIT).map(() => {
        return { path: "" };
      }),
      immediateConnection: true
    },
    mode: "all"
  })

  const { fields, remove, insert } = useFieldArray(
    {
      control: methods.control,
      name: "includePaths"
    });

  const onSubmit: SubmitHandler<TFields> = (data) => {
    data.includePaths = data.includePaths.filter((includePath: TIncludeData) => includePath.path.length > 0);

    sendSaveAndClose(data);
  }

  React.useEffect(() => {
    let listener = (event: any) => {
      const command: ReceiveCommand = event.data as ReceiveCommand;

      switch (command.command) {
        case CommonCommandEnum.UpdateModel:
          const model: TFields = command.data.model;
          const errors: any = command.data.errors;

          while (model.includePaths.length < ROWS_LIMIT) {
            model.includePaths.push({ path: "" });
          }

          if (model.port == 0) {
            model.port = "";
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

  function addIncludePath(folder: string, index: number) {

    if (methods.getValues().includePaths.findIndex((includePath: TIncludeData) => includePath.path.toLowerCase() == folder.toLowerCase()) == -1) {
      remove(index);
      insert(index, { path: folder });
    };
  }

  function removeIncludePath(index: number) {
    remove(index);
    insert(index, { path: "" });
  }

  const model: TFields = methods.getValues();
  const indexFirstPathFree: number = model.includePaths.findIndex((row: TIncludeData) => row.path == "");

  return (
    <TdsPage title={tdsVscode.l10n.t("Add Server")} linkToDoc="[Server Registration]servers.md#registro-de-servidores">
      <TdsForm<TFields>
        onSubmit={onSubmit}
        methods={methods}
        description={tdsVscode.l10n.t("Enter the connection parameters to the Protheus server.")}>

        <section className="tds-row-container" >
          <TdsSelectionField
            methods={methods}
            name="serverType"
            label="Server Type"
            info={tdsVscode.l10n.t("Select the Protheus server type")}
            rules={{ required: true }}
            options={[
              { value: "totvs_server_protheus", text: "Protheus (Adv/PL)" },
              { value: "totvs_server_logix", text: "Logix (4GL)" },
              { value: "totvs_server_totvstec", text: "TOTVS Tec (Adv/PL e 4GL)" }
            ]}
          />

          <TdsCheckBoxField
            methods={methods}
            info=""
            name="immediateConnection"
            label="&nbsp;"
            textLabel={tdsVscode.l10n.t("Connect immediately")}
          />

        </section>

        <section className="tds-row-container" >
          <TdsTextField
            methods={methods}
            name="serverName"
            label={tdsVscode.l10n.t("Server name")}
            info={tdsVscode.l10n.t("Enter a name that helps you identify the server")}
            rules={{ required: true }}
          />
        </section>

        <section className="tds-row-container" >
          <TdsTextField
            methods={methods}
            name="address"
            label={tdsVscode.l10n.t("Address")}
            info={tdsVscode.l10n.t("Enter the IP or name of the server where Protheus is located")}
            rules={{ required: true }}
          />

          <TdsNumericField
            methods={methods}
            name="port"
            label={tdsVscode.l10n.t("Port")}
            info={tdsVscode.l10n.t("Enter the SC connection port")}
            rules={{
              required: true,
              min: { value: 1, message: tdsVscode.l10n.t("[Port] is not valid range. Min: 1 Max: 65535") },
              max: { value: 65535, message: tdsVscode.l10n.t("[Port] is not valid range. Min: 1 Max: 65535") }
            }} />
        </section>

        <TdsLabelField
          methods={methods}
          name={"includeDirectoriesLabel"}
          label={tdsVscode.l10n.t("Include directories")}
          info={tdsVscode.l10n.t("Enter the folders where the definition files should be searched")} />

        <TdsLabelField
          methods={methods}
          name={"warningIncludeDirectoriesLabel"}
          label={tdsVscode.l10n.t("May be informed later. If you do not inform, the global configuration will be used.")}
          info={methods.getValues("globalIncludeDirectories")} />

        <VSCodeDataGrid id="includeGrid" grid-template-columns="30px">
          {model && model.includePaths.map((row: TIncludeData, index: number) => (
            <VSCodeDataGridRow key={index}>
              {row.path !== "" &&
                <>
                  <VSCodeDataGridCell grid-column="1">
                    <VSCodeButton appearance="icon"
                      onClick={() => removeIncludePath(index)} >
                      <span className="codicon codicon-close"></span>
                    </VSCodeButton>
                  </VSCodeDataGridCell>
                  <VSCodeDataGridCell grid-column="2">
                    <TdsSimpleTextField
                      methods={methods}
                      name={`includePaths.${index}.path`}
                      readOnly={true}
                    />
                  </VSCodeDataGridCell>
                </>
              }
              {((row.path == "") && (index !== indexFirstPathFree)) &&
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
                    <TdsSelectionFolderField
                      methods={methods}
                      name={`btnSelectFolder.${index}`}
                      info={"Selecione uma pasta que contenha arquivos de definição"}
                      title="Select folder with define files"
                    />
                  </VSCodeDataGridCell>
                </>
              }
            </VSCodeDataGridRow>
          ))}
        </VSCodeDataGrid>
      </TdsForm>
    </TdsPage>
  );
}

