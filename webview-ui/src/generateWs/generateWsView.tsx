
import "./generateWs.css";
import TdsPage from "../components/page";
import React from "react";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { CommonCommandFromPanelEnum, ReceiveMessage, sendReady, sendSaveAndClose } from "../utilities/common-command-webview";
import { IFormAction, TdsForm, TdsSelectionFileField, TdsSelectionFolderField, TdsSimpleCheckBoxField, TdsTextField, setDataModel, setErrorModel } from "../components/form";

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

    return () => {
      window.removeEventListener('message', listener);
    }
  }, []);

  return (
    <main>
      <TdsPage title="Generate Web Service Client" linkToDoc="[Geração de Web Service]servers.md#registro-de-servidores">
        <FormProvider {...methods} >
          <TdsForm
            methods={methods}
            onSubmit={onSubmit}
          >

            <section className="tds-group-container" >
              <TdsTextField
                name="urlOrWsdlFile"
                label="URL or Wsdl File"
                info="Informe a URL de acesso ao WSDL ou o arquivo com a definição do serviço"
                rules={{ required: true }}
              />

              <TdsSelectionFileField
                name="btn-urlOrWsdlFile"
                info={"Selecione o arquivo com a definição do serviço"}
                title={"Arquivo com a definição WSDL"}
                filters={{
                  "WSDL Files": ["wsdl"],
                  "All Files": ["*"]
                }} />
            </section>

            <section className="tds-group-container" >
              <TdsTextField
                name="outputPath"
                label="Output directory"
                readOnly={true}
                rules={{ required: true }}
                info={"Selecione a pasta de onde o fonte gerado será gravado"}
              />

              <TdsSelectionFolderField
                openLabel="Output Folder"
                name="btn-outputPath"
                info={"Selecione a pasta de onde o fonte gerado será gravado"}
                title="Select Output Directory"
              />
            </section>

            <section className="tds-group-container" >
              <TdsTextField
                name="outputFilename"
                label="Output Filename"
                rules={{ required: true }}
                info={"Informe nome do fonte a ser gravado"}
              />

              <TdsSelectionFileField
                name="btn-outputFilename"
                info={"Selecione o arquivo que receberá a definição do serviço"}
                title={"Arquivo Fonte AdvPL"}
                currentFolder={methods.getValues("outputPath")}
                filters={{
                  "AdvPL Source File": ["prx", "prw", "tlpp"]
                }} />
            </section>

            <TdsSimpleCheckBoxField
              info=""
              name="overwrite"
              label="&nbsp;"
              textLabel="If already exist, can overwrite"
            />
          </TdsForm>
        </FormProvider>
      </TdsPage>
    </main >
  );
}

