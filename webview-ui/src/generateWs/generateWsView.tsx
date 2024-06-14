
import "./generateWs.css";
import { TdsPage, tdsVscode } from "@totvs/tds-webtoolkit";
import React from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { CommonCommandEnum, ReceiveMessage, sendSaveAndClose } from "@totvs/tds-webtoolkit";
import { TdsForm, TdsSelectionFileField, TdsSelectionFolderField, TdsSimpleCheckBoxField, TdsTextField, setDataModel, setErrorModel } from "@totvs/tds-webtoolkit";

enum ReceiveCommandEnum {
}
type ReceiveCommand = ReceiveMessage<CommonCommandEnum & ReceiveCommandEnum, TFields>;

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
        case CommonCommandEnum.UpdateModel:
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
    <TdsPage title="Generate Web Service Client" linkToDoc="[Geração de Web Service]servers.md#registro-de-servidores">
      <TdsForm<TFields> methods={methods}
        onSubmit={onSubmit}
      >

        <section className="tds-row-container" >
          <TdsTextField
            name="urlOrWsdlFile"
            label={tdsVscode.l10n.t("URL or Wsdl File")}
            info={tdsVscode.l10n.t("Enter the WSDL access URL or the file with the service definition")}
            rules={{ required: true }}
          />

          <TdsSelectionFileField
            name="btn-urlOrWsdlFile"
            info={tdsVscode.l10n.t("Select the file with the service definition")}
            title={tdsVscode.l10n.t("File with WSDL definition")}
            filters={{
              "WSDL Files": ["wsdl"]
            }} />
        </section>

        <section className="tds-row-container" >
          <TdsTextField
            name="outputPath"
            label={tdsVscode.l10n.t("Output Folder")}
            info={tdsVscode.l10n.t("Select the folder from where the generated source will be recorded")}
            readOnly={true}
            rules={{ required: true }}
          />

          <TdsSelectionFolderField
            openLabel="Output Folder"
            name="btn-outputPath"
            info={tdsVscode.l10n.t("Select the folder from where the generated source will be recorded")}
            title={tdsVscode.l10n.t("Select Output Directory")}
          />
        </section>

        <section className="tds-row-container" >
          <TdsTextField
            name="outputFilename"
            label={tdsVscode.l10n.t("Output Filename")}
            info={tdsVscode.l10n.t("Source Name to be recorded")}
            rules={{ required: true }}
          />

          <TdsSelectionFileField
            name="btn-outputFilename"
            info={tdsVscode.l10n.t("Select the file that will receive the definition of the service")}
            title={tdsVscode.l10n.t("ADVPL Source File")}
            currentFolder={methods.getValues("outputPath")}
            filters={{
              "AdvPL Source File": ["prx", "prw", "tlpp"]
            }} />
        </section>

        <TdsSimpleCheckBoxField
          info=""
          name="overwrite"
          label="&nbsp;"
          textLabel={tdsVscode.l10n.t("If already exist, can overwrite")}
        />

      </TdsForm>
    </TdsPage>
  );
}

