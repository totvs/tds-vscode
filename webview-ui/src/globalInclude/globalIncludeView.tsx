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

import { VSCodeButton, VSCodeDataGrid, VSCodeDataGridCell, VSCodeDataGridRow } from "@vscode/webview-ui-toolkit/react";

import "./globalInclude.css";
import { TdsPage, tdsVscode } from "@totvs/tds-webtoolkit";
import React from "react";
import { FieldArrayWithId, FormProvider, SubmitHandler, useFieldArray, useForm } from "react-hook-form";
import { TdsForm, TdsLabelField, TdsSelectionFolderField, TdsSimpleTextField, setDataModel, setErrorModel } from "@totvs/tds-webtoolkit";
import { CommonCommandEnum, ReceiveMessage, sendSaveAndClose } from "@totvs/tds-webtoolkit";
import { EMPTY_GLOBAL_INCLUDE_MODEL, TGlobalIncludeModel, TIncludePath } from "@tds-shared/index";

enum ReceiveCommandEnum {
}
type ReceiveCommand = ReceiveMessage<CommonCommandEnum & ReceiveCommandEnum, TFields>;

type TFields = TGlobalIncludeModel;

const ROWS_LIMIT: number = 5;

export default function GlobalIncludeView() {
  const methods = useForm<TFields>({
    defaultValues: EMPTY_GLOBAL_INCLUDE_MODEL() && {
      includePaths: Array(ROWS_LIMIT).map(() => {
        return { path: "" };
      })
    },
    mode: "all"
  })

  const { fields, remove, insert } = useFieldArray(
    {
      control: methods.control,
      name: "includePaths"
    });

  const watchFieldArray = methods.watch("includePaths");
  const includePathsFields = fields.map((field, index) => {
    return {
      ...field,
      ...watchFieldArray[index]
    };
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

          while (model.includePaths.length < ROWS_LIMIT) {
            model.includePaths.push({ path: "" });
          }

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

  function addIncludePath(folder: string, index: number) {

    if (methods.getValues().includePaths.findIndex((includePath: TIncludePath) => includePath.path.toLowerCase() == folder.toLowerCase()) == -1) {
      remove(index);
      insert(index + 1, { path: folder });
    };
  }

  function removeIncludePath(index: number) {
    remove(index);
    insert(index, { path: "" });
  }

  const model: TFields = methods.getValues();
  const indexFirstPathFree: number = model.includePaths.findIndex((row: TIncludePath) => row.path == "");

  return (
    <TdsPage>
      <TdsForm<TGlobalIncludeModel> methods={methods}
        onSubmit={onSubmit}
        description={tdsVscode.l10n.t("The global search folder list is used when not specified in the server definition.")}>

        <section className="tds-row-container" >
          <TdsLabelField
            label={tdsVscode.l10n.t("Include directories")}
            name={"includeDirectoriesLabel"}
            info={tdsVscode.l10n.t("Enter the folders where the definition files should be searched")} />
        </section>

        <VSCodeDataGrid id="includeGrid" grid-template-columns="30px">
          {includePathsFields.map((row: FieldArrayWithId<TFields, "includePaths", "id">, index: number) => (
            <VSCodeDataGridRow key={row.id}>
              {row.path !== "" &&
                <>
                  <VSCodeDataGridCell grid-column="1">
                    <VSCodeButton appearance="icon" onClick={() => removeIncludePath(index)} >
                      <span className="codicon codicon-close"></span>
                    </VSCodeButton>
                  </VSCodeDataGridCell>
                  <VSCodeDataGridCell grid-column="2">
                    <TdsSimpleTextField
                      key={`includePaths.${index}.path`}
                      name={`includePaths.${index}.path`}
                      readOnly={true}
                    />
                  </VSCodeDataGridCell>
                </>
              }
              {((row.path == "") && (index !== indexFirstPathFree)) &&
                <>
                  <VSCodeDataGridCell grid-column="1">&nbsp;</VSCodeDataGridCell>
                  <VSCodeDataGridCell grid-column="2">&nbsp;</VSCodeDataGridCell>
                </>
              }
              {index == indexFirstPathFree &&
                <>
                  <VSCodeDataGridCell grid-column="2">
                    <TdsSelectionFolderField
                      title={tdsVscode.l10n.t("Select folder with definition files")}
                      name={`btnSelectFolder.${index}`}
                      info={tdsVscode.l10n.t("Select the folder where the definition files are located")}
                    />
                  </VSCodeDataGridCell>
                </>
              }
            </VSCodeDataGridRow>
          ))
          }
        </VSCodeDataGrid>
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

