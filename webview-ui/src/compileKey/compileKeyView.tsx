
import TdsPage from "../components/page";
import React from "react";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { CommonCommandFromPanelEnum, ReceiveMessage, sendReady, sendSaveAndClose } from "../utilities/common-command-webview";
import { TInspectorObject } from "../model/inspectorObjectModel";
import { TdsSimpleCheckBoxField, IFormAction, TdsForm, TdsTextField, TdsLabelField, setDataModel, setErrorModel, TdsSelectionFileField } from "../components/form";

import "./CompileKey.css";

enum ReceiveCommandEnum {
}
type ReceiveCommand = ReceiveMessage<CommonCommandFromPanelEnum & ReceiveCommandEnum, TFields>;

type TCompileKey = {
  path: string;
  machineId: string;
  issued: string;
  expire: string;
  buildType: string;
  tokenKey: string;
  authorizationToken: string;
  userId: string;
}

type TAuthorization = {
  id: string;
  generation: string;
  validation: string;
  permission: string;
  key: string;
  canOverride: boolean;
}

type TFields = TCompileKey & TAuthorization;

const EMPTY_COMPILE_KEY: TCompileKey = {
  path: "",
  machineId: "",
  issued: "",
  expire: "",
  buildType: "",
  tokenKey: "",
  authorizationToken: "",
  userId: ""
}

const EMPTY_AUTHORIZATION_KEY: TAuthorization = {
  id: "",
  generation: "",
  validation: "",
  permission: "",
  key: "",
  canOverride: false
}

const EMPTY_MODEL: TFields = {
  ...EMPTY_COMPILE_KEY,
  ...EMPTY_AUTHORIZATION_KEY
}

export default function CompileKeyView() {
  const methods = useForm<TFields>({
    defaultValues: EMPTY_MODEL,
    mode: "all"
  })

  const onSubmit: SubmitHandler<TFields> = (data) => {

    sendSaveAndClose(data);
  }

  React.useEffect(() => {
    let listener = (event: any) => {
      const command: ReceiveCommand = event.data as ReceiveCommand;

      console.log("listener " + command.command);
      console.dir(command.data);

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
      <TdsPage title="Compile Key" linkToDoc="[Chave de Compilação]servers.md#registro-de-servidores"
        footerContent={<>Apenas um teste de compilação é permitido por usuário.</>}>
        <FormProvider {...methods} >
          <TdsForm
            methods={methods}
            onSubmit={onSubmit}>

            <section className="tds-group-container">
              <TdsTextField
                name="machineId"
                label="Machine ID"
                info="Identificador único da estação. Obtido automaticamente"
                readOnly={true}
              />
            </section>

            <section className="tds-group-container">
              <TdsTextField
                name="path"
                label="Compile Key File"
                readOnly={true}
                info="Arquivo de chave de compilação gerado (.AUT)"
                rules={{ required: true }}
              />

              <TdsSelectionFileField
                title={"Arquivo de Chave de Compilação"}
                canSelectFiles={true}
                filters={
                  {
                    "Compile Key File": ["AUT"]
                  }
                }
              />
            </section>

            <section className="tds-group-container">
              <TdsTextField
                name="issued"
                label="Generated"
                info="Data da geração da chave"
                rules={{ required: true }}
              />

              <TdsTextField
                name="expire"
                label="Expire"
                info="Data da expiração da chave"
                rules={{ required: true }}
              />
            </section>

            <section className="tds-group-container">

              <TdsTextField
                name="key"
                label="Token"
                info="Token gerado"
                rules={{ required: true }}
              />
            </section>

            <section className="tds-group-container">
              <TdsSimpleCheckBoxField
                name={"canOverride"}
                label={""}
                textLabel={"Allow override default"} />
            </section>

            <section className="tds-group-container">
              <TdsLabelField
                name={"warningCompatibility"}
                label={"From 05/17/2019 all keys will have to be regenerated using the Machine ID shown above. This will allow compatibility with Linux and macOS."}
              />
            </section>
          </TdsForm>
        </FormProvider>
      </TdsPage>
    </main >
  );
}
