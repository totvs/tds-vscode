//import { VSCodeButton, VSCodeDataGrid, VSCodeDataGridCell, VSCodeDataGridRow } from "@vscode/webview-ui-toolkit/react";

import "./addServer.css";
import TdsPage from "../components/page";
import React from "react";
import { TIncludeData } from "../model/addServerModel";
import { FormProvider, SubmitHandler, useFieldArray, useForm } from "react-hook-form";
import { CommonCommandFromPanelEnum, ReceiveMessage, sendReady, sendSaveAndClose } from "../utilities/common-command-webview";
import { TdsCheckBoxField, TdsForm, TdsLabelField, TdsNumericField, TdsSelectionField, TdsSelectionFolderField, TdsSimpleTextField, TdsTextField, getDefaultActionsForm, setDataModel, setErrorModel } from "../components/form";
import { VSCodeButton, VSCodeDataGrid, VSCodeDataGridCell, VSCodeDataGridRow } from "@vscode/webview-ui-toolkit/react";


enum ReceiveCommandEnum {
}
type ReceiveCommand = ReceiveMessage<CommonCommandFromPanelEnum & ReceiveCommandEnum, TFields>;

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
        case CommonCommandFromPanelEnum.UpdateModel:
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
    <main>
      <TdsPage title="Add Server" linkToDoc="[Registro de Servidores]servers.md#registro-de-servidores">
        <FormProvider {...methods} >
          <TdsForm<TFields>
            onSubmit={onSubmit}
            methods={methods}>

            <section className="tds-row-container" >
              <TdsSelectionField
                name="serverType"
                label="Server Type"
                info={"Selecione o tipo do servidor Protheus"}
                rules={{ required: true }}
                options={[
                  { value: "totvs_server_protheus", text: "Protheus (Adv/PL)" },
                  { value: "totvs_server_logix", text: "Logix (4GL)" },
                  { value: "totvs_server_totvstec", text: "TOTVS Tec (Adv/PL e 4GL)" }
                ]}
              />

              <TdsCheckBoxField
                info=""
                name="immediateConnection"
                label="&nbsp;"
                textLabel="Connect immediately"
              />

            </section>

            <section className="tds-row-container" >
              <TdsTextField
                name="serverName"
                label="Server name"
                info="Informe um nome que o ajude a identificar o servidor"
                rules={{ required: true }}
              />
            </section>

            <section className="tds-row-container" >
              <TdsTextField
                name="address"
                label="Address"
                info="Informe IP ou nome do servidor no qual esta o Protheus"
                rules={{ required: true }}
              />

              <TdsNumericField
                name="port"
                label="Port"
                info="Informe a porta de conexão do SC"
                rules={{
                  required: true,
                  min: { value: 1, message: "[Port] is not valid range. Min: 1 Max: 65535" },
                  max: { value: 65535, message: "[Port] is not valid range. Min: 1 Max: 65535" }
                }} />
            </section>

            <TdsLabelField
              name={"includeDirectoriesLabel"}
              label={"Include directories"}
              info={"Enter the folders where the definition files should be searched"} />

            <TdsLabelField
              name={"warningIncludeDirectoriesLabel"}
              label={"May be informed later. If you do not inform, the global configuration will be used."}
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
        </FormProvider>
      </TdsPage>
    </main >
  );
}
