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
import React from "react";
import { TdsSimpleCheckBoxField, TdsPage, TdsSelectionFileField, TdsSimpleTextField } from "@totvs/tds-webtoolkit";
import { SubmitHandler, useFieldArray, useForm } from "react-hook-form";
import { CommonCommandEnum, ReceiveMessage, sendSaveAndClose } from "@totvs/tds-webtoolkit";
import { TdsForm, TdsLabelField, TdsSelectionField, TdsTextField, setDataModel, setErrorModel } from "@totvs/tds-webtoolkit";
import { tdsVscode } from '@totvs/tds-webtoolkit';
import { EMPTY_DEBUG_CONFIGURATION, LauncherTypeEnum, TDebugConfigurationModel } from "tds-shared/lib";
import { VSCodeButton, VSCodeDataGrid, VSCodeDataGridCell, VSCodeDataGridRow } from "@vscode/webview-ui-toolkit/react";
import { LanguagesEnum } from 'tds-shared/lib';

enum ReceiveCommandEnum {
}
type ReceiveCommand = ReceiveMessage<CommonCommandEnum & ReceiveCommandEnum, TDebugConfigurationModel>

const ROW_LIMIT: number = 5;

export default function LauncherConfigurationView() {
  const methods = useForm<TDebugConfigurationModel>({
    defaultValues: EMPTY_DEBUG_CONFIGURATION,
    mode: "all"
  })

  const { fields, remove, insert } = useFieldArray(
    {
      control: methods.control,
      name: "programArgs"
    });

  const onSubmit: SubmitHandler<TDebugConfigurationModel> = (data) => {

    data.programArgs = data.programArgs.filter((item) => {
      return item.value.trim() !== "";
    });

    if (data.launcherType == LauncherTypeEnum.TotvsLanguageDebug) {
      data.webAppUrl = "";
    } else {
      data.smartClient = "";
    }

    console.dir(data);

    sendSaveAndClose(data);
  }

  React.useEffect(() => {
    let listener = (event: any) => {
      const command: ReceiveCommand = event.data as ReceiveCommand;

      switch (command.command) {
        case CommonCommandEnum.UpdateModel:
          const model: TDebugConfigurationModel = command.data.model;
          const errors: any = command.data.errors;

          while (model.programArgs.length < ROW_LIMIT) {
            model.programArgs.push({ value: "" });
          }

          setDataModel<TDebugConfigurationModel>(methods.setValue, model);
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

  const model: TDebugConfigurationModel = methods.getValues();
  const indexFirstArgFree: number = model.programArgs.findIndex((arg: { value: string }) => arg.value == "");

  return (
    <TdsPage title={tdsVscode.l10n.t("Launcher Debug Config")}>
      <TdsForm<TDebugConfigurationModel>
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

        <section className="tds-row-container" >
          {
            (model.launcherType !== "totvs_language_web_debug") &&
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

          {
            model.launcherType == "totvs_language_web_debug" &&
            <TdsTextField
              name="webAppUrl"
              label={tdsVscode.l10n.t("Web App URL")}
              placeholder={"http(s)://<server>:<port>/webapp"}
              info={tdsVscode.l10n.t("Start Web App URL.")}
            />
          }
        </section>

        {
          model.launcherType !== "totvs_language_web_debug" &&
          <section className="tds-row-container" >
            <TdsLabelField
              name={"lblWarning"}
              label={tdsVscode.l10n.t("If not informed, it will use the definition made in the current server configuration.")}
            />
          </section>
        }

        {
          model.launcherType == "totvs_language_web_debug" &&
          <section className="tds-row-container" >
            <TdsLabelField
              name={"lblWarning"}
              label={tdsVscode.l10n.t("If not informed, it will use the `http(s)://<server>:<port>/webapp` of current server configuration.")}
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
              name="argumentsAdvPLLabel"
              label={tdsVscode.l10n.t("AdvPL Arguments `-A`")}
              info={tdsVscode.l10n.t("Enter the arguments for AdvPL function.")}
            />

            <VSCodeDataGrid id="argumentsGrid" grid-template-columns="30px 1fr" >
              {fields.map((field, index) => (
                <VSCodeDataGridRow
                  key={`arguments_grid_${index}`}
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
                          onClick={() => addIncludeArgument("<value>", index)}
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
              info={tdsVscode.l10n.t("Mark the arguments which will be passed to the SmartClient.")}
            />
            <TdsSimpleCheckBoxField
              name={"multiSession"}
              label={"`-M` Multiple sessions"} />
            <TdsSimpleCheckBoxField
              name={"accessibilityMode"}
              label={"`-AC` Accessibility module"} />
            <TdsSimpleCheckBoxField
              name={"doNotShowSplash"}
              label={"`-Q` Don't display 'splash'"} />
            <TdsSimpleCheckBoxField
              name={"openGlMode"}
              label={"`-OPENGL` Enable OpenGL mode"} />
            <TdsSimpleCheckBoxField
              name={"dpiMode"}
              label={"`-DPI` Enable DPI mode"} />
            <TdsSimpleCheckBoxField
              name={"oldDpiMode"}
              label={"`-OLDDPI` Enable old DPI mode"} />
            <TdsSelectionField
              name={"language"}
              label={"Language"}
              options={[
                { value: LanguagesEnum.DEFAULT, text: "Default" },
                { value: LanguagesEnum.POR, text: "Português" },
                { value: LanguagesEnum.SPA, text: "Español" },
                { value: LanguagesEnum.ENG, text: "English" },
                { value: LanguagesEnum.RUS, text: "Русский" }
              ]
              }
            />

          </div>

          <div id="debuggerOptions">
            <TdsLabelField
              name={"debuggerOptionsLabel"}
              label={tdsVscode.l10n.t("Debugger Options")}
              info={tdsVscode.l10n.t("Mark the arguments which will be passed to the process of debugging.")}
            />

            <TdsSimpleCheckBoxField
              name="enableMultiThread"
              label={"Multi Thread"} />

            <TdsSimpleCheckBoxField
              name="enableProfile"
              label={"Profile"} />

            <TdsSimpleCheckBoxField
              name="ignoreFiles"
              label={"Ignore files not found in WorkSpace (debugging)"} />

          </div>

        </section>
      </TdsForm>
    </TdsPage >
  );
}

