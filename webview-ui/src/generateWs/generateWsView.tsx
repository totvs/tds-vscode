import { VSCodeButton, VSCodeDataGrid, VSCodeDataGridCell, VSCodeDataGridRow, VSCodeProgressRing, VSCodeTextField } from "@vscode/webview-ui-toolkit/react";

import "./generateWs.css";
import Page from "../components/page";
import ErrorBoundary from "../components/errorBoundary";
import React, { ChangeEvent } from "react";
import { TIncludeData } from "../model/addServerModel";
import { SubmitHandler, useFieldArray, useForm, useWatch } from "react-hook-form";
import TDSForm, { IFormAction, TDSCheckBoxField, TDSNumericField, TDSSelectionField, TDSSelectionFileField, TDSSelectionFolderField, TDSSimpleTextField, TDSTextField, getDefaultActionsForm } from "../components/form";
import PopupMessage from "../components/popup-message";
import { CommonCommandFromPanelEnum, ReceiveMessage, sendReady, sendSaveAndClose } from "../utilities/common-command-webview";
import { sendCheckDir } from "./sendCommand";
import { object } from "prop-types";
import path from "path";


enum ReceiveCommandEnum {
}
type ReceiveCommand = ReceiveMessage<CommonCommandFromPanelEnum & ReceiveCommandEnum, TFields>;

type TFields = {
  urlOrWsdlFile: string;
  outputPath: string;
  outputFilename: string;
  overwrite: boolean
}

export default function GenerateWsView() {
  const {
    control,
    handleSubmit,
    setValue,
    setError,
    getValues,
    formState: { errors, isDirty, isValid },
  } = useForm<TFields>({
    defaultValues: {
      urlOrWsdlFile: "",
      outputPath: "",
      outputFilename: "",
      overwrite: false
    },
    mode: "all"
  })

  const onSubmit: SubmitHandler<TFields> = (data) => {
    console.log(">>>>>>>>>>>>>>>>>>>>>>>");
    console.dir(data);
    sendSaveAndClose(data);
  }

  React.useEffect(() => {
    let listener = (event: any) => {
      const command: ReceiveCommand = event.data as ReceiveCommand;
      const model: TFields = command.data.model;

      switch (command.command) {
        case CommonCommandFromPanelEnum.UpdateModel:
          setValue("urlOrWsdlFile", model.urlOrWsdlFile);
          setValue("outputPath", model.outputPath);
          setValue("outputFilename", model.outputFilename);
          setValue("overwrite", model.overwrite);

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

  const actions: IFormAction[] = getDefaultActionsForm();
  actions[0].enabled = isDirty && isValid;

  return (
    <main>
      <ErrorBoundary>
        <Page title="Generate Web Service Client" linkToDoc="[Geração de Web Service]servers.md#registro-de-servidores">
          <TDSForm
            actions={actions}
            errors={errors}
            control={control}
            onSubmit={handleSubmit(onSubmit)}>

            <section className="tds-group-container" >
              <TDSTextField
                className="tds-item-grow"
                name="urlOrWsdlFile"
                label="URL or Wsdl File"
                info="Informe a URL de acesso ao WSDL ou o arquivo com a definição do serviço"
                control={control}
                rules={{ required: true }}
              />

              <TDSSelectionFileField
                name="btn-urlOrWsdlFile"
                control={control}
                onSelect={(files) => setValue("urlOrWsdlFile", files[0])}
                info={"Selecione o arquivo com a definição do serviço"} />
            </section>

            <section className="tds-group-container" >

              <TDSTextField
                className="tds-item-grow"
                name="outputPath"
                label="Output directory"
                control={control}
                readOnly={true}
                rules={{ required: true }}
                info={"Selecione a pasta de onde o fonte gerado será gravado"}
              />

              <TDSSelectionFolderField
                name="btn-outputPath"
                control={control}
                onSelect={(folder) => setValue("outputPath", folder)}
                info={"Selecione a pasta de onde o fonte gerado será gravado"} />

            </section>

            <section className="tds-group-container" >
              <TDSTextField
                name="outputFilename"
                label="Output Filename"
                control={control}
                readOnly={true}
                rules={{ required: true }}
                info={"Selecione nome do fonte a ser  gravado"}
              />

              <TDSCheckBoxField
                className="tds-item-grow"
                name="overwrite"
                label="&nbsp;"
                textLabel="If already exist, can overwrite"
                control={control}
                onChecked={(checked: boolean) => setValue("overwrite", checked)}
              />

            </section>
          </TDSForm>
        </Page>
      </ErrorBoundary>
    </main >
  );
}
