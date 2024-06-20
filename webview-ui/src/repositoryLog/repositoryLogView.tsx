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

import "./repositoryLog.css";
import { IFormAction, TdsFormActionsEnum, TdsPage, TdsProgressRing, getDefaultActionsForm } from "@totvs/tds-webtoolkit";
import React from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { CommonCommandEnum, ReceiveMessage } from "@totvs/tds-webtoolkit";
import { TdsForm, TdsTextField, setDataModel, setErrorModel } from "@totvs/tds-webtoolkit";
import { tdsVscode } from '@totvs/tds-webtoolkit';
import { TRepositoryLogModel } from "tds-shared/lib";
import { EMPTY_REPOSITORY_MODEL } from "tds-shared/lib/models/repositoryLogModel";

enum ReceiveCommandEnum {
}
type ReceiveCommand = ReceiveMessage<CommonCommandEnum & ReceiveCommandEnum, TRepositoryLogModel>;

export default function RepositoryLogView() {
  const methods = useForm({
    defaultValues: EMPTY_REPOSITORY_MODEL,
    mode: "all"
  })
  const rpoInfoWatch = methods.watch("serverName");
  console.log("rpoInfoWatch ", rpoInfoWatch);

  const onSubmit: SubmitHandler<TRepositoryLogModel> = (data) => {
    // Não se aplica
  }

  React.useEffect(() => {
    let listener = (event: any) => {
      const command: ReceiveCommand = event.data as ReceiveCommand;

      switch (command.command) {
        case CommonCommandEnum.UpdateModel:
          const model: TRepositoryLogModel = command.data.model;
          const errors: any = command.data.errors;

          console.log(model);

          setDataModel<TRepositoryLogModel>(methods.setValue, model);
          setErrorModel(methods.setError, errors);

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

  const model: TRepositoryLogModel = methods.getValues();
  const formActions: IFormAction[] = getDefaultActionsForm().filter((action: IFormAction) => action.id == TdsFormActionsEnum.Close);

  return (
    <TdsPage title={tdsVscode.l10n.t("Repository Log")} linkToDoc="">
      <TdsForm<TRepositoryLogModel>
        onSubmit={onSubmit}
        methods={methods}
        actions={formActions}>

        <section className="tds-row-container" id="repositoryLog">
          <section className="tds-row-container" id="rpoTree">
            {rpoInfoWatch
              ? <>
                <TdsTextField
                  key={"serverName"}
                  name={"serverName"}
                  readOnly={true}
                  label={tdsVscode.l10n.t("Server")} />
                <TdsTextField
                  key={"environment"}
                  name={"environment"}
                  readOnly={true}
                  label={tdsVscode.l10n.t("Environment")} />
                <TdsTextField
                  key={"rpoVersion"}
                  name={"rpoVersion"}
                  readOnly={true}
                  label={tdsVscode.l10n.t("RPO Version")} />
                <TdsTextField
                  key={"dateGeneration"}
                  name={"dateGeneration"}
                  format={(value: string): string => {
                    console.log("value", value);
                    return tdsVscode.l10n.formatDate(new Date(value), "date");
                  }}
                  readOnly={true}
                  label={tdsVscode.l10n.t("Generation")}
                />
                {model.rpoVersion}model.rpoInfo
              </>
              :
              <TdsProgressRing />
            }
          </section>

          <section className="tds-row-container" id="rpoInfo">
            RpoInfo
          </section>

        </section>


      </TdsForm>
    </TdsPage>
  );
}
