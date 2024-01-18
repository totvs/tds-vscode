
import "./generateWs.css";
import Page from "../components/page";
import React from "react";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { CommonCommandFromPanelEnum, ReceiveMessage, sendReady, sendSaveAndClose } from "../utilities/common-command-webview";
import { IFormAction, TdsCheckBoxField, TdsForm, TdsSelectionFileField, TdsSelectionFolderField, TdsTextField, setDataModel, setErrorModel } from "../components/form";
import { getDefaultActionsForm } from "../components/fields/numericField";

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
  const methods = useForm<TFields>({
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

      switch (command.command) {
        case CommonCommandFromPanelEnum.UpdateModel:
          const model: TFields = command.data.model;
          const errors: TFields = command.data.errors;

          setDataModel(methods.setValue, model);
          setErrorModel(methods.setError, errors as any);

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
  //actions[0].enabled = isDirty && isValid;

  return (
    <main>
      <Page title="Generate Web Service Client" linkToDoc="[Geração de Web Service]servers.md#registro-de-servidores">
        <FormProvider {...methods} >
          <TdsForm
            methods={methods}
            actions={actions}
            onSubmit={onSubmit}
          >

            <section className="tds-group-container" >
              <TdsTextField
                className="tds-item-grow"
                name="urlOrWsdlFile"
                label="URL or Wsdl File"
                info="Informe a URL de acesso ao WSDL ou o arquivo com a definição do serviço"
                rules={{ required: true }}
              />

              <TdsSelectionFileField
                label={""}
                name="btn-urlOrWsdlFile"
                info={"Selecione o arquivo com a definição do serviço"}
                onSelect={function (file: string[]) {
                  throw new Error("Function not implemented.");
                }} />
            </section>

            <section className="tds-group-container" >
              <TdsTextField
                className="tds-item-grow"
                name="outputPath"
                label="Output directory"
                readOnly={true}
                rules={{ required: true }}
                info={"Selecione a pasta de onde o fonte gerado será gravado"}
              />

              <TdsSelectionFolderField
                label="Output Folder"
                name="btn-outputPath"
                info={"Selecione a pasta de onde o fonte gerado será gravado"}
                dialogTitle="Select Output Directory"
              />
            </section>

            <section className="tds-group-container" >
              <TdsTextField
                name="outputFilename"
                label="Output Filename"
                readOnly={true}
                rules={{ required: true }}
                info={"Selecione nome do fonte a ser  gravado"}
              />

              <TdsCheckBoxField
                info=""
                className="tds-item-grow"
                name="overwrite"
                label="&nbsp;"
                textLabel="If already exist, can overwrite"
              />
            </section>
          </TdsForm>
        </FormProvider>
      </Page>
    </main >
  );
}

