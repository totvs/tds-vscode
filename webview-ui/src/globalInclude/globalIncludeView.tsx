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

import "./globalInclude.css";
import { TdsPage, tdsVscode } from "@totvs/tds-webtoolkit";
import React from "react";
import { SubmitHandler, useFieldArray, useForm } from "react-hook-form";
import { TdsForm, TdsLabelField, setDataModel, setErrorModel } from "@totvs/tds-webtoolkit";
import { CommonCommandEnum, ReceiveMessage, sendSaveAndClose } from "@totvs/tds-webtoolkit";
import { EMPTY_GLOBAL_INCLUDE_MODEL, TGlobalIncludeModel, TIncludePath } from "@tds-shared/index";

enum ReceiveCommandEnum {
}
type ReceiveCommand = ReceiveMessage<CommonCommandEnum & ReceiveCommandEnum, TFields>;

type TFields = TGlobalIncludeModel;

export default function GlobalIncludeView() {
  const methods = useForm<TFields>({
    defaultValues: {
      ...EMPTY_GLOBAL_INCLUDE_MODEL(),
      includePaths: []
    },
    mode: "all"
  })

  const { fields, remove } = useFieldArray(
    {
      control: methods.control,
      name: "includePaths"
    });

  const onSubmit: SubmitHandler<TFields> = (data) => {
    data.includePaths = data.includePaths.filter((includePath: TIncludePath) => includePath.path.length > 0);
    sendSaveAndClose(data);
  }

  React.useEffect(() => {
    const listener = (event: any) => {
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

  function removeIncludePath(index: number) {
    remove(index);
  }

  return (
    <TdsPage id="globalIncludeView">
      <TdsForm<TGlobalIncludeModel>
        name="frmGlobalInclude"
        onSubmit={methods.handleSubmit(onSubmit)}
        description={tdsVscode.l10n.t("The global search folder list is used when not specified in the server definition.")}>

        <section className="tds-row-container" >
          <TdsLabelField
            label={tdsVscode.l10n.t("Include directories")}
            name={"includeDirectoriesLabel"}
            info={tdsVscode.l10n.t("Enter the folders where the definition files should be searched")} />
        </section>

        {/* <VSCodeDataGrid id="includeGrid" grid-template-columns="30px">
          {fields.map((row, index: number) => (
            <VSCodeDataGridRow
              key={row.id}
            >
              <VSCodeDataGridCell grid-column="1">
                <VSCodeButton appearance="icon"
                  onClick={() => removeIncludePath(index)} >
                  <span className="codicon codicon-close"></span>
                </VSCodeButton>
              </VSCodeDataGridCell>
              <VSCodeDataGridCell grid-column="2">
                <TdsSimpleTextField
                  name={`includePaths.${index}.path`}
                  readOnly={true}
                />
              </VSCodeDataGridCell>
            </VSCodeDataGridRow>
          ))}

          <VSCodeDataGridRow>
            <VSCodeDataGridCell grid-column="1">
              &nbsp;
            </VSCodeDataGridCell>
            <VSCodeDataGridCell grid-column="2">
              <TdsSelectionFolderField
                name={`btnSelectFolder`}
                info={tdsVscode.l10n.t("Select folder with definition files")}
                title={tdsVscode.l10n.t("Select folder with definition files")}
              />
            </VSCodeDataGridCell>
          </VSCodeDataGridRow>

        </VSCodeDataGrid> */}
        {
          //TODO: melhorar e adicionar link (cuidado que pode ser por na área de trabalho)
          //servers.md#Local de gravação de *servers.json*
          //| Windows* |  `%USERPROFILE%\.totvsls\settings.json` |
          //| MacOS |`$HOME/.totvsls/settings.json` |
          //| Linux | `$HOME/.totvsls/settings.json`
        }
        <p>{tdsVscode.l10n.t("These settings can also be changed in {0}", "%HOME_USER%/.totvsls/servers.json")}</p>
      </TdsForm>
    </TdsPage>
  );
}

