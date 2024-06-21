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
import { IFormAction, TdsFormActionsEnum, TdsLabelField, TdsPage, TdsProgressRing, getDefaultActionsForm } from "@totvs/tds-webtoolkit";
import React from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { CommonCommandEnum, ReceiveMessage } from "@totvs/tds-webtoolkit";
import { TdsForm, TdsTextField, setDataModel, setErrorModel } from "@totvs/tds-webtoolkit";
import { tdsVscode } from '@totvs/tds-webtoolkit';
import { TRepositoryLogModel } from "tds-shared/lib";
import { EMPTY_REPOSITORY_MODEL, TPatchInfoModel, TProgramAppModel } from "tds-shared/lib/models/repositoryLogModel";
import { VSCodeButton } from "@vscode/webview-ui-toolkit/react";

enum ReceiveCommandEnum {
}
type ReceiveCommand = ReceiveMessage<CommonCommandEnum & ReceiveCommandEnum, TRepositoryLogModel>;

function getMonthly(rpoInfos: TPatchInfoModel[]): string[] {
  const monthly: string[] = [];

  console.log("rpoInfos ", rpoInfos);

  rpoInfos.forEach((rpoInfo: TPatchInfoModel) => {
    const dateFileApplicationMonth: string = rpoInfo.dateFileApplication.toLocaleString(tdsVscode.l10n.formatLocale, { month: "numeric", year: "numeric" });

    if (!monthly.includes(dateFileApplicationMonth)) {
      monthly.push(dateFileApplicationMonth);
    }
  })

  return monthly;
}

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

          model.dateGeneration = new Date(model.dateGeneration);
          model.rpoPatches = model.rpoPatches.map((patch: TPatchInfoModel) => {
            patch.dateFileApplication = new Date(patch.dateFileApplication);
            patch.dateFileGeneration = new Date(patch.dateFileGeneration);

            patch.programsApp = patch.programsApp.map((programApp: TProgramAppModel) => {
              programApp.date = new Date(programApp.date);

              return programApp;
            });

            return patch;
          });

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
                  key={"rpoVersion"}
                  name={"rpoVersion"}
                  readOnly={true}
                  label={tdsVscode.l10n.t("RPO Version")} />
                <TdsTextField
                  key={"dateGeneration"}
                  name={"dateGeneration"}
                  format={(value: string): string => {
                    return tdsVscode.l10n.formatDate(new Date(value), "date");
                  }}
                  readOnly={true}
                  label={tdsVscode.l10n.t("Generation")}
                />
                <TdsTextField
                  key={"environment"}
                  name={"environment"}
                  readOnly={true}
                  label={tdsVscode.l10n.t("Environment")} />
                <TdsLabelField
                  name={"lbl_monthly"}
                  label={tdsVscode.l10n.t("Applied in")}
                  className="tds-bold"
                />
                {
                  getMonthly(model.rpoPatches).map((months: string, index: number) => {
                    return (
                      <VSCodeButton
                        key={`btn_${index}`}
                        className={`tds-button-button`}
                        onClick={() => {
                          console.log("patch ", months);
                        }} >
                        {months}
                      </VSCodeButton>)
                  })
                }
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
