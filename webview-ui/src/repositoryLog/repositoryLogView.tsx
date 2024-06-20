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
import { SubmitHandler, useFieldArray, useForm } from "react-hook-form";
import { CommonCommandEnum, ReceiveMessage, sendSaveAndClose } from "@totvs/tds-webtoolkit";
import { TdsCheckBoxField, TdsForm, TdsLabelField, TdsNumericField, TdsSelectionField, TdsSelectionFolderField, TdsSimpleTextField, TdsTextField, setDataModel, setErrorModel } from "@totvs/tds-webtoolkit";
import { VSCodeButton, VSCodeDataGrid, VSCodeDataGridCell, VSCodeDataGridRow, VSCodeProgressRing } from "@vscode/webview-ui-toolkit/react";
import { tdsVscode } from '@totvs/tds-webtoolkit';
import { TIncludePath, TRepositoryLogModel } from "tds-shared/lib";
import { EMPTY_REPOSITORY_MODEL } from "tds-shared/lib/models/repositoryLogModel";
import { Flex } from "./components/Flex";

enum ReceiveCommandEnum {
}
type ReceiveCommand = ReceiveMessage<CommonCommandEnum & ReceiveCommandEnum, TRepositoryLogModel>;

export default function RepositoryLogView() {
  const methods = useForm({
    defaultValues: EMPTY_REPOSITORY_MODEL,
    mode: "all"
  })

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
            {model.rpoInfo.serverName !== ""
              ? <>
                <TdsLabelField
                  key={"rpoInfo.serverName"}
                  name={"rpoInfo.serverName"}
                  label={tdsVscode.l10n.t("Server")} />
                <TdsLabelField
                  key={"rpoInfo.environment"}
                  name={"rpoInfo.environment"}
                  label={tdsVscode.l10n.t("Environment")} />
                <TdsLabelField
                  key={"rpoInfo.rpoVersion"}
                  name={"rpoInfo.rpoVersion"}
                  label={tdsVscode.l10n.t("RPO Version")} />
                <TdsLabelField
                  key={"rpoInfo.dateGeneration"}
                  name={"rpoInfo.dateGeneration"}
                  label={tdsVscode.l10n.t("Generation")}
                />

                {tdsVscode.l10n.formatDate(model.rpoInfo.dateGeneration, "date")}
                {model.rpoInfo.rpoVersion}model.rpoInfo
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
