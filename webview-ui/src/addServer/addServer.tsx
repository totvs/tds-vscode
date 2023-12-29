import { ICommandFromPanel } from "../utilities/vscodeWrapper";
import { VSCodeDataGrid, VSCodeDataGridCell, VSCodeDataGridRow, VSCodeDropdown, VSCodeOption } from "@vscode/webview-ui-toolkit/react";

import "./addServer.css";
import Page from "../components/page";
import ErrorBoundary from "../components/errorBoundary";
import { ChangeEvent, FormEvent } from "react";
import React from "react";
import { TIncludeData } from "../model/addServerModel";
import { CommandFromPanelEnum } from "../utilities/command-panel";
import { sendReady } from "./sendCommand";
import { TextField } from "@vscode/webview-ui-toolkit";
import { SubmitHandler, useForm } from "react-hook-form";
import TDSForm, { TDSNumericField, TDSSelectionField, TDSTextField } from "../components/form";
import PopupMessage from "../components/popup-message";

enum ACTIONS {
  ACT_SAVE,
  ACT_SAVE_CLOSE
}

declare module "react" {
  interface InputHTMLAttributes<T> extends HTMLAttributes<T> {
    webkitdirectory?: string;
    directory?: string;
  }
}

type TFields = {
  serverName: string;
  address: string;
  port: number;
  includePatches: TIncludeData[]
}

export default function AddServer() {
  console.log(">>> AddServer: initialize")
  const {
    control,
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<TFields>({
    defaultValues: {
      serverName: "",
      address: "",
      port: 0,
      includePatches: []
    },
    //mode: "onChange"
  })

  const onSubmit: SubmitHandler<TFields> = (data) => console.log(data);

  React.useEffect(() => {
    let listener = (event: any) => {
      const command: ICommandFromPanel<any> = event.data as ICommandFromPanel<any>;

      switch (command.command) {
        case CommandFromPanelEnum.UpdateModel:
          //setModel({ ...model, ...command.model as TAddServerModel });

          break;
        case CommandFromPanelEnum.ValidateResponse:
          console.log(">>> validade response")
          console.dir(command.data);

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

  function checkDir(event: ChangeEvent<HTMLInputElement>) {
    var input: any = event.target;

    if (input.files.length > 0) {
      var selectedDir = input.files[0].path;
      //sendCheckDir(model, selectedDir);
    }
  }

  function setModelAttr(event: FormEvent<HTMLElement> | Event, attrName: string) {
    var input: any = event.target as TextField;

    //setModel({ ...model, [attrName]: input.value });
  }

  let model: any = undefined;

  return (
    <main>
      <ErrorBoundary>
        <Page title="Add Server"
          linkToDoc="[Registro de Servidores]servers.md#registro-de-servidores"
        >
          <TDSForm
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
              rules={{ required: true, min: { value: 1, message: "[Port] is not valid range. Min: 1 Max: 65535" } }}
            />

            <section className="tds-group-container" >
              <p className="tds-item-grow-group">Include directories
                <PopupMessage fieldName="include" message="Informe as pastas onde os arquivos de definição devem ser procurados" />
              </p>
              {/* ts-expect-error */}
              <input type="file" name="btn-FileInclude"
                onChange={(event) => checkDir(event)}
                webkitdirectory="" directory="" />
            </section>

            <VSCodeDataGrid id="includeGrid" grid-template-columns="30px">
              {model && model.includePatches.map((row: TIncludeData) => (
                <VSCodeDataGridRow key={row.id}>
                  <VSCodeDataGridCell grid-column="1">
                    <span className="codicon codicon-close"></span>
                  </VSCodeDataGridCell>
                  <VSCodeDataGridCell grid-column="2">{row.path}</VSCodeDataGridCell>
                </VSCodeDataGridRow>
              ))}
            </VSCodeDataGrid>
          </TDSForm>
        </Page>
      </ErrorBoundary>
    </main >
  );
}
