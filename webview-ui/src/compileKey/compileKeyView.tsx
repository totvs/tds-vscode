/*
Copyright 2021-2024 TOTVS S.A

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

  http: //www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

import React from "react";
import { TdsPage, tdsVscode } from "@totvs/tds-webtoolkit";
import { SubmitHandler, useForm } from "react-hook-form";
import { CommonCommandEnum, ReceiveMessage, sendSaveAndClose } from "@totvs/tds-webtoolkit";
import { TdsSimpleCheckBoxField, TdsForm, TdsTextField, TdsLabelField, setDataModel, setErrorModel, TdsSelectionFileField } from "@totvs/tds-webtoolkit";

import "./CompileKey.css";
import { TAuthorization, TCompileKey } from "tds-shared/lib";

enum ReceiveCommandEnum {
}

type ReceiveCommand = ReceiveMessage<CommonCommandEnum & ReceiveCommandEnum, TFields>;

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
    <TdsPage>
      <TdsForm<TFields> methods={methods}
        onSubmit={onSubmit}>

        <TdsTextField
          name="machineId"
          label={tdsVscode.l10n.t("Machine ID")}
          info={tdsVscode.l10n.t("Single Identifier of the Station. Automatically obtained.")}
          readOnly={true}
        />

        <section className="tds-row-container">
          <TdsTextField
            name="path"
            label={tdsVscode.l10n.t("Compile Key File")}
            info={tdsVscode.l10n.t("Generated compilation key file (.AUT)")}
            readOnly={true}
            rules={{ required: true }}
          />

          <TdsSelectionFileField
            title={tdsVscode.l10n.t("Compilation key file")}
            filters={
              {
                "Compile Key File": ["AUT"]
              }
            }
          />
        </section>

        <section className="tds-row-container tds-same-width">
          <TdsTextField
            name="generation"
            label={tdsVscode.l10n.t("Generated")}
            info={tdsVscode.l10n.t("Date of key generation")}
            rules={{ required: true }}
          />

          <TdsTextField
            name="validation"
            label={tdsVscode.l10n.t("Expire")}
            info={tdsVscode.l10n.t("Date of Key Expiration")}
            rules={{ required: true }}
          />
        </section>

        <TdsTextField
          name="key"
          label={tdsVscode.l10n.t("Token")}
          info={tdsVscode.l10n.t("Token generated")}
          rules={{ required: true }}
        />

        <TdsSimpleCheckBoxField
          name={"canOverride"}
          label={tdsVscode.l10n.t("Allow override default")} />

        <TdsLabelField
          name={"warningCompatibility"}
          label={tdsVscode.l10n.t("From 05/17/2019 all keys will have to be regenerated using the Machine ID shown above. This will allow compatibility with Linux and MacOS.")}
        />
      </TdsForm>
    </TdsPage>
  );
}
