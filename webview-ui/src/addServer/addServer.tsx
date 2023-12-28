import { ICommandFromPanel, vscode } from "../utilities/vscodeWrapper";
import { VSCodeButton, VSCodeDataGrid, VSCodeDataGridCell, VSCodeDataGridRow, VSCodeDropdown, VSCodeOption, VSCodeTextField } from "@vscode/webview-ui-toolkit/react";

import "./AddServer.css";
import Page, { IPageAction } from "../components/page";
import ErrorBoundary from "../components/errorBoundary";
import { ChangeEvent, FormEvent } from "react";
import React from "react";
import { TIncludeData } from "../model/addServerModel";
import { CommandFromPanelEnum, CommandToPanelEnum } from "../utilities/command-panel";
import { sendCheckDir, sendReady, sendSave, sendSaveAndClose, sendValidateModel } from "./sendCommand";
import { TextField } from "@vscode/webview-ui-toolkit";
import { Controller, SubmitHandler, UseControllerProps, useController, useForm } from "react-hook-form";
import { PopupError, PopupInfo } from "../components/popup-message";
import TDSForm, { IFormAction } from "../components/form";

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

type TDSFieldProps =
  {
    label: string;
    info: string;
  }

function TDSTextField(props: UseControllerProps<TFields> & TDSFieldProps) {
  const { field, fieldState } = useController(props)

  let message: string = "";
  if (fieldState.error) {
    if (fieldState.error.type == "required") {
      message = `[${props.label}] is required`;
    } else {
      message = fieldState.error.message || "<Unknown>"
    }
  } else {
    message = props.info || "";
  }

  return (
    <section className="tds-text-field-container">
      <label htmlFor={props.name}>{props.label} {props.rules!.required && <span className="tds-required" />}</label>
      <VSCodeTextField {...field} >
        {fieldState.invalid ?
          <PopupError fieldName={props.name} message={message} />
          : <PopupInfo fieldName={props.name} message={message} />
        }
      </VSCodeTextField>
      <span>{fieldState.isDirty && "Dirty "}</span>
      <span>{fieldState.invalid ? "invalid " : "valid"}</span>
      <span>{fieldState.error?.type}</span>
    </section>
  )
}

function TDSNumericField(props: UseControllerProps<TFields> & TDSFieldProps) {
  const { field, fieldState } = useController(props)

  let message: string = "";
  if (fieldState.error) {
    if (fieldState.error.type == "required") {
      message = `[${props.label}] is required`;
    } else {
      message = fieldState.error.message || "<Unknown>"
    }
  } else {
    message = props.info || "";
  }

  return (
    <section className="tds-numeric-field-container">
      <label htmlFor={props.name}>{props.label}</label>
      <VSCodeTextField {...field} >
        {fieldState.error ?
          <PopupError fieldName={props.name} message={message} />
          : <PopupInfo fieldName={props.name} message={message} />
        }
      </VSCodeTextField>
      <span>{fieldState.isDirty && "Dirty "}</span>
      <span>{fieldState.invalid ? "invalid " : "valid"}</span>
      <span>{fieldState.error?.type}</span>
    </section>
  )
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
    mode: "onChange"
  })

  const onSubmit: SubmitHandler<TFields> = (data) => console.log(data)

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
        <Page title={`Add Server`}
          linkToDoc="[Registro de Servidores]servers.md#registro-de-servidores"
        >
          <TDSForm onSubmit={handleSubmit(onSubmit)}>
            <section className="tds-dropdown-container">
              <label htmlFor="serverType">Server Type</label>

              <VSCodeDropdown name="serverType"
                onChange={(event) => setModelAttr(event, "serverType")}
              >
                <VSCodeOption value="totvs_server_protheus">Protheus (Adv/PL)</VSCodeOption>
                <VSCodeOption value="totvs_server_logix">Logix (4GL)</VSCodeOption>
                <VSCodeOption value="totvs_server_totvstec">TOTVS Tec (Adv/PL e 4GL)</VSCodeOption>
                <PopupInfo fieldName="serverType" message="Selecione o tipo do servidor Protheus" />
              </VSCodeDropdown>
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
              rules={{ required: true, min: { value: 1, message: "[Port] is not valid range. Min: 1 Max: 65535" } }}
            />

            <section className="tds-group-container" >
              <p className="tds-item-grow-group">Include directories
                <PopupInfo fieldName="include" message="Informe as pastas onde os arquivos de definição devem ser procurados" />
              </p>
              {/* ts-expect-error */}
              <input type="file" name="btn-FileInclude"
                onChange={(event) => checkDir(event)}
                webkitdirectory="" directory="" />
            </section>

            <VSCodeButton type="submit" appearance="primary">Save</VSCodeButton>

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
