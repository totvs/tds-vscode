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
import { IFormAction, TdsDataGrid, TdsFormActionsEnum, TdsLabelField, TdsPage, TdsProgressRing, getDefaultActionsForm } from "@totvs/tds-webtoolkit";
import React from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { CommonCommandEnum, ReceiveMessage } from "@totvs/tds-webtoolkit";
import { TdsForm, TdsTextField, setDataModel, setErrorModel } from "@totvs/tds-webtoolkit";
import { tdsVscode } from '@totvs/tds-webtoolkit';
import { TRepositoryLogModel } from "tds-shared/lib";
import { EMPTY_REPOSITORY_MODEL, TPatchInfoModel, TProgramAppModel } from "tds-shared/lib/models/repositoryLogModel";
import { FastTreeItem, FastTreeView } from "./components/tree";

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
  const [currentPatch, setCurrentPatch] = React.useState<TPatchInfoModel | undefined>(undefined);

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

        <section className="tds-row-container">
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
        </section>

        <section className="tds-row-container">
          <TdsTextField
            key={"environment"}
            name={"environment"}
            readOnly={true}
            label={tdsVscode.l10n.t("Environment")} />
          <TdsTextField
            key={"dateGeneration"}
            name={"dateGeneration"}
            format={(value: string): string => {
              return tdsVscode.l10n.formatDate(new Date(value), "date");
            }}
            readOnly={true}
            label={tdsVscode.l10n.t("Generation")}
          />
        </section>

        <section className="tds-row-container" id="repositoryLog">
          {rpoInfoWatch
            ? <>
              <section className="tds-row-container" id="rpoTree">
                <TdsLabelField
                  key={"lbl_monthly"}
                  name={"lbl_monthly"}
                  label={tdsVscode.l10n.t("Applied in")}
                  className="tds-bold"
                />
                <FastTreeView className="tds-tree-view"
                  key={"tree_monthly"}
                >
                  {tdsVscode.l10n.t("Applied in")}
                  {
                    getMonthly(model.rpoPatches)
                      .sort((a: string, b: string) => a.localeCompare(b))
                      .map((month: string, index: number) => {
                        return (
                          <FastTreeItem key={`tree_item_${index}`} className="tds-tree-item">
                            {month}
                            {
                              model.rpoPatches
                                .filter((patch: TPatchInfoModel) => {
                                  const dateFileApplicationMonth: string = patch.dateFileApplication.toLocaleString(tdsVscode.l10n.formatLocale, { month: "numeric", year: "numeric" });

                                  return dateFileApplicationMonth == month;
                                }
                                )
                                .sort((a: TPatchInfoModel, b: TPatchInfoModel) => a.dateFileApplication.getTime() - b.dateFileApplication.getTime())
                                .map((patch: TPatchInfoModel, indexMonth: number) => {
                                  return (
                                    <FastTreeItem key={`tree_item_${index}_${indexMonth}`} className="tds-tree-item"
                                      onClick={() => {
                                        setCurrentPatch(patch);
                                      }}
                                    >
                                      {tdsVscode.l10n.formatDate(patch.dateFileApplication, "date")}
                                    </FastTreeItem>
                                  )
                                }
                                )
                            }
                          </FastTreeItem>
                        )
                      })
                  }
                </FastTreeView>
              </section>

              {currentPatch !== undefined
                ? <section className="tds-row-container" id="rpoInfo">
                  <section className="tds-row-container">
                    <TdsTextField
                      key={"generation_date"}
                      name={"generation_date"}
                      readOnly={true}
                      label={tdsVscode.l10n.t("Generated in")}
                      format={(value: string): string => {
                        return tdsVscode.l10n.formatDate(currentPatch.dateFileGeneration, "date");
                      }}
                    />
                    <TdsTextField
                      key={"date_applied"}
                      name={"date_applied"}
                      format={(value: string): string => {
                        return tdsVscode.l10n.formatDate(currentPatch.dateFileApplication, "date");
                      }}
                      readOnly={true}
                      label={tdsVscode.l10n.t("Applied in")}
                    />
                  </section>
                  <section className="tds-row-container">
                    <TdsDataGrid
                      id={"grd_pathInfo"}
                      columnDef={[
                        {
                          name: "name",
                          label: "Program",
                          type: "string",
                          width: "2fr",
                          sortDirection: "asc",
                          grouping: false
                        },
                        {
                          name: "date",
                          label: "Date",
                          type: "datetime",
                          width: "1fr",
                          grouping: false
                        }
                      ]}
                      dataSource={currentPatch.programsApp}
                      options={{
                        bottomActions: [],
                        topActions: [],
                        pageSize: 1000,
                        pageSizeOptions: []
                      }} />
                  </section>
                </section>
                : <>{tdsVscode.l10n.t("Select the application date to see the details.")}.</>
              }
            </>
            :
            <TdsProgressRing size="full" />
          }
        </section>
      </TdsForm>
    </TdsPage >
  );
}
