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

import "./replayConfiguration.css";
import React from "react";
import { TdsCheckBoxField, TdsLabelField, TdsPage, TdsProgressRing, TdsSelectionFileField, TdsSimpleTextField } from "@totvs/tds-webtoolkit";
import { SubmitHandler, useFieldArray, useForm } from "react-hook-form";
import { CommonCommandEnum, ReceiveMessage, sendSaveAndClose } from "@totvs/tds-webtoolkit";
import { TdsForm, TdsSelectionField, TdsTextField, setDataModel, setErrorModel } from "@totvs/tds-webtoolkit";
import { tdsVscode } from '@totvs/tds-webtoolkit';
import { EMPTY_REPLAY_CONFIGURATION, TReplayConfigurationModel } from "tds-shared/lib";
import { VSCodeButton, VSCodeDataGrid, VSCodeDataGridCell, VSCodeDataGridRow } from "@vscode/webview-ui-toolkit/react";

enum ReceiveCommandEnum {
}

type ReceiveCommand = ReceiveMessage<CommonCommandEnum & ReceiveCommandEnum, TReplayConfigurationModel>

const ROW_LIMIT: number = 5;

export default function ReplayConfigurationView() {
  const methods = useForm<TReplayConfigurationModel>({
    defaultValues: EMPTY_REPLAY_CONFIGURATION(),
    mode: "all"
  })

  const onSubmit: SubmitHandler<TReplayConfigurationModel> = (data) => {
    sendSaveAndClose(data);
  }

  React.useEffect(() => {
    let listener = (event: any) => {
      const command: ReceiveCommand = event.data as ReceiveCommand;

      switch (command.command) {
        case CommonCommandEnum.UpdateModel:
          const model: TReplayConfigurationModel = command.data.model;
          const errors: any = command.data.errors;

          while (model.includeSources.length < ROW_LIMIT) {
            model.includeSources.push({ value: "" });
          }

          while (model.excludeSources.length < ROW_LIMIT) {
            model.excludeSources.push({ value: "" });
          }

          setDataModel<TReplayConfigurationModel>(methods.setValue, model);
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

  const { fields: includeFields, remove: includeRemove, insert: includeInsert } = useFieldArray(
    {
      control: methods.control,
      name: "includeSources"
    });

  const { fields: excludeFields, remove: excludeRemove, insert: excludeInsert } = useFieldArray(
    {
      control: methods.control,
      name: "excludeSources"
    });

  const model: TReplayConfigurationModel = methods.getValues();

  function buildSourceList(fields: any[],
    remove: any,
    insert: any,
    fieldName: string): React.ReactNode {
    const indexFirstArgFree: number = fields.findIndex((arg: { value: string }) => arg.value == "");

    const addIncludeArgument = (value: string, index: number) => {
      insert(index, { value: value });
      remove(index + 1);
    }

    const removeArgument = (index: number) => {
      remove(index);
      insert(fields.length, { value: "" });
    }

    return (
      <>
        <VSCodeDataGrid id={`source_list_${fieldName}`} grid-template-columns="30px 1fr" >
          {fields.map((field, index) => (
            <VSCodeDataGridRow
              key={`source_list_${fieldName}_${index}`}
            >
              {field.value !== "" &&
                <>
                  <VSCodeDataGridCell grid-column="1">
                    <VSCodeButton appearance="icon"
                      onClick={() => removeArgument(index)} >
                      <span className="codicon codicon-close"></span>
                      {index}
                    </VSCodeButton>
                  </VSCodeDataGridCell>
                  <VSCodeDataGridCell grid-column="2">
                    <TdsSimpleTextField
                      key={field.id}
                      name={`${fieldName}.${index}.value`}
                      rules={{ required: true }}
                    />
                  </VSCodeDataGridCell>
                </>
              }
              {((field.value == "") && (index < indexFirstArgFree)) &&
                <>
                  <VSCodeDataGridCell grid-column="1">
                    &nbsp;
                  </VSCodeDataGridCell>
                  <VSCodeDataGridCell grid-column="2">
                    <TdsSimpleTextField
                      key={field.id}
                      name={`${fieldName}.${index}.value`}
                      info={tdsVscode.l10n.t("Enter the value of parameters.")}
                    />
                  </VSCodeDataGridCell>
                </>
              }
              {(index === indexFirstArgFree) &&
                <>
                  <VSCodeDataGridCell grid-column="1">
                    &nbsp;
                  </VSCodeDataGridCell>
                  <VSCodeDataGridCell grid-column="2">
                    <VSCodeButton
                      onClick={() => addIncludeArgument("*.*", index)}
                    >
                      {tdsVscode.l10n.t("Add Selector")}
                    </VSCodeButton>
                  </VSCodeDataGridCell>
                </>
              }
            </VSCodeDataGridRow>
          ))}
        </VSCodeDataGrid>

      </>
    )
  }

  return (
    <TdsPage>
      <TdsForm<TReplayConfigurationModel>
        methods={methods}
        onSubmit={onSubmit}
      >
        {(!model)
          ? <TdsProgressRing size="full" />
          :
          <>
            <section className="tds-row-container" >
              <TdsSelectionField
                name="launcherType"
                label="Launcher Type"
                info={tdsVscode.l10n.t("Select the launcher type to config")}
                rules={{ required: true }}
                readOnly={true}
                options={[
                  { value: "totvs_tdsreplay_debug", text: "TDS Replay" },
                ]}
              />

              <TdsTextField
                name="name"
                label={tdsVscode.l10n.t("Name")}
                info={tdsVscode.l10n.t("Enter a name that helps you identify the launcher")}
                data-list={Object.keys(model.launchers).join(",")}
                rules={{ required: true }}
              />
            </section>

            <section className="tds-row-container">
              <TdsTextField
                name="replayFile"
                label={tdsVscode.l10n.t("TDS-Replay file")}
                info={tdsVscode.l10n.t("File Generated by TDS-Replay")}
                readOnly={true}
                rules={{ required: true }}
              />

              <TdsSelectionFileField
                title={tdsVscode.l10n.t("TDS-Replay file")}
                filters={
                  {
                    "TDS-Replay file": ["trplay"]
                  }
                }
              />
            </section>
            <TdsTextField name={"password"} label={tdsVscode.l10n.t("Password")} />

            <section className="tds-row-container" id="options">
              <div className="col-2">
                <TdsLabelField
                  name="lblOptions"
                  label={"**Options**"} />
                <TdsCheckBoxField name={"ignoreFiles"} label={"Ignore files not found in WorkSpace"} />
                <TdsCheckBoxField name={"importOnlySourcesInfo"} label={"Import only the sources information"} />
              </div>

              <div>
                <TdsLabelField
                  name="lblIncludeSources"
                  label={"**Include Sources**"}
                  info="List of sources to include. Can use wildcard characters (*,?)" />
                {buildSourceList(includeFields, includeRemove, includeInsert, "includeSources")}
              </div>

              <div>
                <TdsLabelField
                  name="lblExcludeSources"
                  label={"**Exclude Sources**"}
                  info="List of sources to exclude. Can use wildcard characters (*,?)" />
                {buildSourceList(excludeFields, excludeRemove, excludeInsert, "excludeSources")}
              </div>
            </section>

            <section className="tds-row-container">
              <TdsLabelField
                name={"lblWarning"}
                label={"_* This config could be altered editing file./vscode/launch.json_"} />
            </section>
          </>
        }
      </TdsForm>
    </TdsPage >
  );
}

