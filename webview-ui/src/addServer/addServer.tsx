import { VSCodeDataGrid, VSCodeDataGridCell, VSCodeDataGridRow } from "@vscode/webview-ui-toolkit/react";

import "./addServer.css";
import Page from "../components/page";
import ErrorBoundary from "../components/errorBoundary";
import React from "react";
import { TIncludeData } from "../model/addServerModel";
import { SubmitHandler, useForm } from "react-hook-form";
import TDSForm, { TDSNumericField, TDSSelectionField, TDSSelectionFolder, TDSTextField } from "../components/form";
import PopupMessage from "../components/popup-message";
import { CommonCommandFromPanelEnum, ReceiveMessage, sendReady, sendSaveAndClose } from "../utilities/common-command-webview";


enum ReceiveCommandEnum {
}
type _AddServerCommand = CommonCommandToPanel & AddServerCommand;
type ReceiveCommand = ReceiveMessage<CommonCommandFromPanelEnum & ReceiveCommandEnum, TFields>;

type TFields = {
  serverType: string
  serverName: string;
  address: string;
  port: number;
  includePaths: TIncludeData[]
}

export default function AddServer() {
  console.log(">>> AddServer: initialize")
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
      includePaths: ["", "", "", "", ""]
    },
    mode: "all"
  })

  const onSubmit: SubmitHandler<TFields> = (data) => {
    sendSaveAndClose(data);
  }

  React.useEffect(() => {
    let listener = (event: any) => {
      const command: ReceiveCommand = event.data as ReceiveCommand;
      const model: TFields = command.data.model;

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

  // React.useEffect(() => {
  //   console.log("React.useEffect model");
  //   //sendValidateModel(model);
  //   return () => {
  //   }
  // }, [model]);

  const model: TFields = getValues();
  const indexFirstPathFree: number = model.includePaths.findIndex((path: TIncludeData) => path == "");

  return (
    <main>
      <ErrorBoundary>
        <Page title="Add Server" linkToDoc="[Registro de Servidores]servers.md#registro-de-servidores">
          <TDSForm
            isDirty={isDirty}
            isValid={isValid}
            errors={errors}
            control={control}
            onSubmit={handleSubmit(onSubmit)}>
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
              {model && model.includePaths.map((path: TIncludeData, index: number) => (
                <VSCodeDataGridRow key={index}>
                  {path !== "" &&
                    <>
                      <VSCodeDataGridCell grid-column="1">
                        <span className="codicon codicon-close"></span>
                      </VSCodeDataGridCell>
                      <VSCodeDataGridCell grid-column="2">{path}</VSCodeDataGridCell>
                    </>
                  }
                  {index == indexFirstPathFree &&
                    <>
                      <VSCodeDataGridCell grid-column="1">
                      <TDSSelectionFolder
                        info={"Selecione uma pasta que contenha arquivos de definição"} />
                      </VSCodeDataGridCell>
                    </>
                  }
                  {path == "" &&
                    <>
                      <VSCodeDataGridCell grid-column="1">&nbsp;</VSCodeDataGridCell>
                      <VSCodeDataGridCell grid-column="2">&nbsp;</VSCodeDataGridCell>
                    </>
                  }
                </VSCodeDataGridRow>
              ))}
            </VSCodeDataGrid>
          </TDSForm>
        </Page>
      </ErrorBoundary>
    </main >
  );
}
