import { VSCodeButton, VSCodeDataGrid, VSCodeDataGridCell, VSCodeDataGridRow, VSCodeTextField } from "@vscode/webview-ui-toolkit/react";

import "./addServer.css";
import Page from "../components/page";
import ErrorBoundary from "../components/errorBoundary";
import React, { ChangeEvent } from "react";
import { TIncludeData } from "../model/addServerModel";
import { SubmitHandler, useFieldArray, useForm, useWatch } from "react-hook-form";
import TDSForm, { IFormAction, TDSCheckBoxField, TDSNumericField, TDSSelectionField, TDSSelectionFolderField, TDSSimpleTextField, TDSTextField, getDefaultActionsForm } from "../components/form";
import PopupMessage from "../components/popup-message";
import { CommonCommandFromPanelEnum, ReceiveMessage, sendReady, sendSaveAndClose } from "../utilities/common-command-webview";
import { sendCheckDir } from "./sendCommand";
import { object } from "prop-types";
import path from "path";


enum ReceiveCommandEnum {
}
type ReceiveCommand = ReceiveMessage<CommonCommandFromPanelEnum & ReceiveCommandEnum, TFields>;

type TFields = {
  serverType: string
  serverName: string;
  address: string;
  port: number;
  includePaths: TIncludeData[]
  immediateConnection: boolean
}

export default function AddServer() {
  const {
    control,
    handleSubmit,
    setValue,
    setError,
    getValues,
    formState: { errors, isDirty, isValid },
  } = useForm<TFields>({
    defaultValues: {
      serverName: "",
      address: "",
      port: 0,
      includePaths: [
        { path: "" },
        { path: "" },
        { path: "" },
        { path: "" },
        { path: "" }
      ],
      immediateConnection: true
    },
    mode: "all"
  })
  const { fields, remove, insert } = useFieldArray(
    {
      control,
      name: "includePaths"
    });

  const onSubmit: SubmitHandler<TFields> = (data) => {
    data.includePaths = data.includePaths.filter((includePath: TIncludeData) => includePath.path.length > 0);
    sendSaveAndClose(data);
  }

  React.useEffect(() => {
    let listener = (event: any) => {
      const command: ReceiveCommand = event.data as ReceiveCommand;
      const model: TFields = event.data.model;

      switch (command.command) {
        case CommonCommandFromPanelEnum.UpdateModel:
          setValue("serverName", model.serverName);
          setValue("address", model.address);
          setValue("port", model.port);
          setValue("includePaths", model.includePaths);

          break;
        case CommonCommandFromPanelEnum.ValidateResponse:
          Object.keys(command.data).forEach((fieldName: string) => {
            setError(fieldName as any, {
              message: command.data[fieldName].message,
              type: command.data[fieldName].type
            })
          })
          break;
        default:
          break;
      }
    };

    window.addEventListener('message', listener);

    sendReady();

    return () => {
      window.removeEventListener('message', listener);
    }
  }, []);

  function addIncludePath(event: ChangeEvent<HTMLInputElement>, index: number) {
    var input: any = event.target;

    if (input.files.length > 0) {
      const path: string = input.files[0].path;
      const pos: number = path.lastIndexOf("\\") == -1 ? path.lastIndexOf("/") : path.lastIndexOf("\\");
      var selectedDir: string = path.substring(0, pos + 1);
      remove(index);
      insert(index, { path: selectedDir });
    }
  }

  function removeIncludePath(index: number) {
    remove(index);
    insert(index, { path: "" });
  }

  const model: TFields = getValues();
  const indexFirstPathFree: number = model.includePaths.findIndex((row: TIncludeData) => row.path == "");
  const actions: IFormAction[] = getDefaultActionsForm();
  actions[0].enabled = isDirty && isValid;

  return (
    <main>
      <ErrorBoundary>
        <Page title="Add Server" linkToDoc="[Registro de Servidores]servers.md#registro-de-servidores">
          <TDSForm
            actions={actions}
            errors={errors}
            control={control}
            onSubmit={handleSubmit(onSubmit)}>

            <section className="tds-group-container" >
              <TDSSelectionField
                name="serverType"
                label="Server Type"
                info={"Selecione o tipo do servidor Protheus"}
                control={control}
                rules={{ required: true }}
                options={[
                  { value: "totvs_server_protheus", text: "Protheus (Adv/PL)" },
                  { value: "totvs_server_logix", text: "Logix (4GL)" },
                  { value: "totvs_server_totvstec", text: "TOTVS Tec (Adv/PL e 4GL)" }
                ]}
              />

              <TDSCheckBoxField
                name="immediateConnection"
                label="&nbsp;"
                textLabel="Connect immediately"
                control={control}
              />

            </section>

            <TDSTextField
              name="serverName"
              label="Server name"
              info="Informe um nome que o ajude a identificar o servidor"
              control={control}
              rules={{ required: true }}
            />

            <TDSTextField
              name="address"
              label="Address"
              info="Informe IP ou nome do servidor no qual esta o Protheus"
              control={control}
              rules={{ required: true }}
            />

            <TDSNumericField
              name="port"
              label="Port"
              info="Informe a porta de conexão do SC"
              control={control}
              rules={{
                required: true,
                min: { value: 1, message: "[Port] is not valid range. Min: 1 Max: 65535" },
                max: { value: 65535, message: "[Port] is not valid range. Min: 1 Max: 65535" }
              }} />

            <section className="tds-group-container" >
              <p className="tds-item-grow-group">Include directories
                <PopupMessage fieldName="include" message="Informe as pastas onde os arquivos de definição devem ser procurados" />
              </p>
            </section>

            <VSCodeDataGrid id="includeGrid" grid-template-columns="30px">
              {fields.map((row: TIncludeData, index: number) => (
                <VSCodeDataGridRow key={index}>
                  {row.path !== "" &&
                    <>
                      <VSCodeDataGridCell grid-column="1">
                        <VSCodeButton appearance="icon" onClick={() => removeIncludePath(index)} >
                          <span className="codicon codicon-close"></span>
                        </VSCodeButton>
                      </VSCodeDataGridCell>
                      <VSCodeDataGridCell grid-column="2">
                        <TDSSimpleTextField
                          name={`includePaths.${index}.path`}
                          control={control}
                          readOnly={true}
                        />
                      </VSCodeDataGridCell>
                    </>
                  }
                  {((row.path == "") && (index !== indexFirstPathFree)) &&
                    <>
                      <VSCodeDataGridCell grid-column="1">&nbsp;</VSCodeDataGridCell>
                      <VSCodeDataGridCell grid-column="2">&nbsp;</VSCodeDataGridCell>
                    </>
                  }
                  {index == indexFirstPathFree &&
                    <>
                      <VSCodeDataGridCell grid-column="2">
                        <TDSSelectionFolderField
                          control={control}
                          onSelect={(event) => addIncludePath(event, index)}
                          name={`btnSelectFolder.${index}`}
                          info={"Selecione uma pasta que contenha arquivos de definição"} />
                      </VSCodeDataGridCell>
                    </>
                  }
                </VSCodeDataGridRow>
              ))
              }
            </VSCodeDataGrid>
          </TDSForm>
        </Page>
      </ErrorBoundary>
    </main >
  );
}
