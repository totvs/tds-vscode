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

import "./launcherConfiguration.css";
import { TdsCheckBoxField, TdsPage, TdsSelectionFileField, TdsSimpleCheckBoxField, TdsSimpleTextField } from "@totvs/tds-webtoolkit";
import React from "react";
import { SubmitHandler, useFieldArray, useForm } from "react-hook-form";
import { CommonCommandEnum, ReceiveMessage, sendSaveAndClose } from "@totvs/tds-webtoolkit";
import { TdsForm, TdsLabelField, TdsSelectionField, TdsTextField, setDataModel, setErrorModel } from "@totvs/tds-webtoolkit";
import { tdsVscode } from '@totvs/tds-webtoolkit';
import { EMPTY_LAUNCHER_CONFIGURATION, TLauncherConfigurationModel } from "tds-shared/lib";
import { VSCodeButton, VSCodeDataGrid, VSCodeDataGridCell, VSCodeDataGridRow } from "@vscode/webview-ui-toolkit/react";
import { vsCodeButton } from '@vscode/webview-ui-toolkit';

enum ReceiveCommandEnum {
}
type ReceiveCommand = ReceiveMessage<CommonCommandEnum & ReceiveCommandEnum, TLauncherConfigurationModel>

const ROW_LIMIT: number = 5;

export default function LauncherConfigurationView() {
  const methods = useForm<TLauncherConfigurationModel>({
    defaultValues: EMPTY_LAUNCHER_CONFIGURATION,
    mode: "all"
  })
  const launcherTypeWatch = methods.watch("launcherType");

  const { fields, remove, insert } = useFieldArray(
    {
      control: methods.control,
      name: "programArgs"
    });

  const onSubmit: SubmitHandler<TLauncherConfigurationModel> = (data) => {

    sendSaveAndClose(data);
  }

  React.useEffect(() => {
    let listener = (event: any) => {
      const command: ReceiveCommand = event.data as ReceiveCommand;

      switch (command.command) {
        case CommonCommandEnum.UpdateModel:
          const model: TLauncherConfigurationModel = command.data.model;
          const errors: any = command.data.errors;

          while (model.programArgs.length < ROW_LIMIT) {
            model.programArgs.push({ value: "" });
          }

          model.launcherType = model.launcherType ? model.launcherType : "totvs_language_debug";

          console.log(model);
          setDataModel<TLauncherConfigurationModel>(methods.setValue, model);
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

  function addIncludeArgument(value: string, index: number) {
    insert(index, { value: value });
    remove(index + 1);
  }

  function removeArgument(index: number) {
    remove(index);
    insert(fields.length, { value: "" });
  }

  const model: TLauncherConfigurationModel = methods.getValues();
  const indexFirstArgFree: number = model.programArgs.findIndex((arg: { value: string }) => arg.value == "");

  return (
    <TdsPage title={tdsVscode.l10n.t("Launcher Config")} linkToDoc="[Server Registration]servers.md#registro-de-servidores">
      <TdsForm<TLauncherConfigurationModel>
        methods={methods}
        onSubmit={onSubmit}
      >
        <section className="tds-row-container" >
          <TdsSelectionField
            name="launcherType"
            label="Launcher Type"
            info={tdsVscode.l10n.t("Select the launcher type to config")}
            rules={{ required: true }}
            options={[
              { value: "totvs_language_debug", text: "TOTVS Language Debug" },
              { value: "totvs_language_web_debug", text: "TOTVS Language Debug via Web App" },
            ]}
          />
          <TdsTextField
            name="name"
            label={tdsVscode.l10n.t("Name")}
            info={tdsVscode.l10n.t("Enter a name that helps you identify the launcher")}
            rules={{ required: true }}
          />
        </section>

        <section className="tds-row-container" >

          {launcherTypeWatch && (model.launcherType !== "totvs_language_web_debug") &&
            <>
              <TdsTextField
                name="smartClient"
                label={tdsVscode.l10n.t("Smart Client (Desktop)")}
                info={tdsVscode.l10n.t("Select the SmartClient binary to be used.")}
                rules={{ required: false }}
              />

              <TdsSelectionFileField
                name={`btnSelectSmartClient`}
                info={tdsVscode.l10n.t("Select the SmartClient binary to be used.")}
                title="Select Smart Client Desktop"
              />
            </>
          }

          {launcherTypeWatch && model.launcherType == "totvs_language_web_debug" &&
            <TdsTextField
              name="webAppUrl"
              label={tdsVscode.l10n.t("Web App URL")}
              placeholder={"http(s)://<server>:<port>"}
              info={tdsVscode.l10n.t("Start Web App URL.")}
            />
          }

          <div id="smartClientOptions" >
            <TdsCheckBoxField
              name={"enableMultiThread"}
              label={"SmartClient Options"}
              textLabel={"Multi Thread"} />

            <TdsCheckBoxField
              name={"enableProfile"}
              label={""}
              textLabel={"Profile"} />
          </div>
        </section>

        {launcherTypeWatch && model.launcherType !== "totvs_language_web_debug" &&
          <section className="tds-row-container" >
            <TdsLabelField
              name={"lblWarning"}
              label={tdsVscode.l10n.t("If not informed, it will use the definition made in the current server configuration.")}
            />
          </section>
        }
        {launcherTypeWatch && model.launcherType == "totvs_language_web_debug" &&
          <section className="tds-row-container" >
            <TdsLabelField
              name={"lblWarning"}
              label={tdsVscode.l10n.t("If not informed, it will use the `http(s)://<server>:<port>` of current server configuration.")}
            />
          </section>
        }

        <section className="tds-row-container" >
          <TdsTextField
            name="program"
            label={tdsVscode.l10n.t("AdvPL Function")}
            info={tdsVscode.l10n.t("Enter the name of the function to be performed.")}
            rules={{ required: false }}
            placeholder="${command:AskForProgramName}"
          />
        </section>

        <section className="tds-row-container" id="arguments">
          <div id="advplArguments">
            <TdsLabelField
              name={"argumentsAdvPLLabel"}
              label={tdsVscode.l10n.t("AdvPL Arguments `-A`")}
              info={tdsVscode.l10n.t("Enter the arguments for AdvPL function.")}
            />

            <VSCodeDataGrid id="argumentsGrid" grid-template-columns="30px 1fr" >
              {fields.map((field, index) => (
                <VSCodeDataGridRow
                  key={index}
                >
                  {field.value !== "" &&
                    <>
                      <VSCodeDataGridCell grid-column="1">
                        <VSCodeButton appearance="icon"
                          onClick={() => removeArgument(index)} >
                          <span className="codicon codicon-close"></span>
                        </VSCodeButton>
                      </VSCodeDataGridCell>
                      <VSCodeDataGridCell grid-column="2">
                        <TdsSimpleTextField
                          key={field.id}
                          name={`programArgs.${index}.value`}
                          readOnly={field.value == "<empty>"}

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
                          name={`programArgs.${index}.value`}
                          info={tdsVscode.l10n.t("Enter the value of parameters.")}
                          readOnly={false}
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
                          onClick={() => addIncludeArgument("value", index)}
                        >
                          {tdsVscode.l10n.t("Add Argument")}
                        </VSCodeButton>
                        <VSCodeButton
                          onClick={() => addIncludeArgument("<empty>", index)}
                        >
                          {tdsVscode.l10n.t("Add Empty Argument")}
                        </VSCodeButton>
                      </VSCodeDataGridCell>
                    </>
                  }
                </VSCodeDataGridRow>
              ))}
            </VSCodeDataGrid>

          </div>

          <div id="scArgumentsOptions">
            <TdsLabelField
              name={"argumentsLabel"}
              label={tdsVscode.l10n.t("Smart Client Arguments")}
              info={tdsVscode.l10n.t("Mark the desired arguments and/or write in text area, which will be passed to the SmartClient.")}
            />
            <TdsSimpleCheckBoxField
              name={"multiSession"}
              label={""}
              textLabel={"`-M` Multiple sessions"} />
            <TdsSimpleCheckBoxField
              name={"accessibilityMode"}
              label={""}
              textLabel={"`-AC` Accessibility module"} />
            <TdsSimpleCheckBoxField
              name={"doNotShowSplash"}
              label={""}
              textLabel={"`-Q` Don't display 'splash'"} />
            <TdsSimpleCheckBoxField
              name={"openGlMode"}
              label={""}
              textLabel={"`-OPENGL` Enable OpenGL mode"} />
            <TdsSimpleCheckBoxField
              name={"dpiMode"}
              label={""}
              textLabel={"`-DPI` Enable DPI mode"} />
            <TdsSimpleCheckBoxField
              name={"oldDpiMode"}
              label={""}
              textLabel={"`-OLDDPI` Enable old DPI mode"} />
          </div>

          <TdsTextField
            name={"smartClientArguments"}
            label={" "}
            textArea={true}
            rows={7}
            cols={30}
          />
        </section>

      </TdsForm>
    </TdsPage >
  );
}

