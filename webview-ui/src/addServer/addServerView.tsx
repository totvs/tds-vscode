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
import { SubmitHandler, useFieldArray, useForm } from "react-hook-form";
import { CommonCommandEnum, ReceiveMessage, sendSaveAndClose } from "@totvs/tds-webtoolkit";
import { TdsCheckBoxField, TdsForm, TdsLabelField, TdsNumericField, TdsSelectionField, TdsSelectionFolderField, TdsSimpleTextField, TdsTextField, setDataModel, setErrorModel } from "@totvs/tds-webtoolkit";
import { VSCodeButton, VSCodeDataGrid, VSCodeDataGridCell, VSCodeDataGridRow } from "@vscode/webview-ui-toolkit/react";
import { tdsVscode } from '@totvs/tds-webtoolkit';
import { EMPTY_SERVER_MODEL, TIncludePath, TServerModel } from "@tds-shared/index";

enum ReceiveCommandEnum {
}
type ReceiveCommand = ReceiveMessage<CommonCommandEnum & ReceiveCommandEnum, TServerModel>

export default function AddServerView() {
  const methods = useForm<TServerModel>({
    defaultValues: {
      ...EMPTY_SERVER_MODEL(),
      includePaths: []
    },
    mode: "all"
  })

  const { fields, remove } = useFieldArray(
    {
      control: methods.control,
      name: "includePaths"
    });

  const onSubmit: SubmitHandler<TServerModel> = (data) => {

    data.includePaths = data.includePaths.filter((includePath: TIncludePath) => includePath.path.length > 0);

    sendSaveAndClose(data);
  }

  React.useEffect(() => {
    const listener = (event: any) => {
      const command: ReceiveCommand = event.data as ReceiveCommand;

      switch (command.command) {
        case CommonCommandEnum.UpdateModel:
          const model: TServerModel = command.data.model;
          const errors: any = command.data.errors;

          setDataModel<TServerModel>(methods.setValue, model);
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

  function removeIncludePath(index: number) {
    remove(index);
    //insert(index + 1, { path: "" });
  }

  const model: TServerModel = methods.getValues();

  return (
    <TdsPage>
      <TdsForm<TServerModel> methods={methods}
        onSubmit={onSubmit}
        description={tdsVscode.l10n.t("Enter the connection parameters to the Protheus server.")}>

        <section className="tds-row-container" >
          <TdsSelectionField
            name="serverType"
            label={tdsVscode.l10n.t("Server Type")}
            info={tdsVscode.l10n.t("Select the Protheus server type")}
            options={[
              { value: "totvs_server_protheus", text: "Protheus (Adv/PL)" },
              { value: "totvs_server_logix", text: "Logix (4GL)" },
              { value: "totvs_server_totvstec", text: "TOTVS Tec (Adv/PL e 4GL)" }
            ]}
            rules={{ required: true }}
          />

          <TdsCheckBoxField
            info=""
            name="immediateConnection"
            label={tdsVscode.l10n.t("Connect immediately")}
          />

        </section>

        <section className="tds-row-container" >
          <TdsTextField
            name="serverName"
            label={tdsVscode.l10n.t("Server name")}
            info={tdsVscode.l10n.t("Enter a name that helps you identify the server")}
            rules={{ required: true }}
          />
        </section>

        <section className="tds-row-container" >
          <TdsTextField
            name="address"
            label={tdsVscode.l10n.t("Address")}
            info={tdsVscode.l10n.t("Enter the IP or name of the server where Protheus is located")}
            rules={{ required: true }}
          />

          <TdsNumericField
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
          name={"includeDirectoriesLabel"}
          label={tdsVscode.l10n.t("Include directories")}
          info={tdsVscode.l10n.t("Enter the folders where the definition files should be searched")} />

        <TdsLabelField
          name={"warningIncludeDirectoriesLabel"}
          label={tdsVscode.l10n.t("May be informed later. If you do not inform, the global configuration will be used.")}
          info={methods.getValues("globalIncludeDirectories")} />

        <VSCodeDataGrid id="includeGrid" grid-template-columns="30px">
          {fields.map((row, index: number) => (
            <VSCodeDataGridRow
              key={row.id}
            >
              <VSCodeDataGridCell grid-column="1">
                <VSCodeButton appearance="icon"
                  onClick={() => removeIncludePath(index)} >
                  <span className="codicon codicon-close"></span>
                </VSCodeButton>
              </VSCodeDataGridCell>
              <VSCodeDataGridCell grid-column="2">
                <TdsSimpleTextField
                  name={`includePaths.${index}.path`}
                  readOnly={true}
                />
              </VSCodeDataGridCell>
            </VSCodeDataGridRow>
          ))}

          <VSCodeDataGridRow>
            <VSCodeDataGridCell grid-column="1">
              &nbsp;
            </VSCodeDataGridCell>
            <VSCodeDataGridCell grid-column="2">
              <TdsSelectionFolderField
                name={`btnSelectFolder`}
                info={tdsVscode.l10n.t("Select folder with definition files")}
                title={tdsVscode.l10n.t("Select folder with definition files")}
              />
            </VSCodeDataGridCell>
          </VSCodeDataGridRow>

        </VSCodeDataGrid>
      </TdsForm>
    </TdsPage>
  );
}

