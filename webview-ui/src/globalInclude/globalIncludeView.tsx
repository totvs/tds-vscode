import { VSCodeButton, VSCodeDataGrid, VSCodeDataGridCell, VSCodeDataGridRow } from "@vscode/webview-ui-toolkit/react";

import "./globalInclude.css";
import TdsPage from "../components/page";
import React from "react";
import { TIncludeData } from "../model/addServerModel";
import { FieldArrayWithId, SubmitHandler, useFieldArray, useForm, FormProvider } from "react-hook-form";
import { IFormAction, TdsForm, TdsLabelField, TdsSelectionFolderField, TdsSimpleTextField, setDataModel, setErrorModel } from "../components/form";
import { CommonCommandFromPanelEnum, ReceiveMessage, sendReady, sendSaveAndClose } from "../utilities/common-command-webview";

enum ReceiveCommandEnum {
}
type ReceiveCommand = ReceiveMessage<CommonCommandFromPanelEnum & ReceiveCommandEnum, TFields>;

type TFields = {
  includePaths: TIncludeData[]
}

const ROWS_LIMIT: number = 5;

export default function GlobalIncludeView() {
  const methods = useForm<TFields>({
    defaultValues: {
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

  const onSubmit: SubmitHandler<TFields> = (data) => {
    data.includePaths = data.includePaths.filter((includePath: TIncludeData) => includePath.path.length > 0);
    sendSaveAndClose(data);
  }

  React.useEffect(() => {
    let listener = (event: any) => {
      const command: ReceiveCommand = event.data as ReceiveCommand;

      switch (command.command) {
        case CommonCommandFromPanelEnum.UpdateModel:
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

    if (methods.getValues().includePaths.findIndex((includePath: TIncludeData) => includePath.path.toLowerCase() == folder.toLowerCase()) == -1) {
      remove(index);
      insert(index, { path: folder });
    };
  }

  function removeIncludePath(index: number) {
    remove(index);
    insert(index, { path: "" });
  }

  const model: TFields = methods.getValues();
  const indexFirstPathFree: number = model.includePaths.findIndex((row: TIncludeData) => row.path == "");

  return (
    <main>
      <TdsPage title="Global Includes" linkToDoc="[Include global]servers.md#registro-de-servidores">
        <FormProvider {...methods} >
          <TdsForm
            methods={methods}
            onSubmit={onSubmit}>

            <p>The global search folder list is used when not specified in the server definition.</p>

            <section className="tds-row-container" >
              <TdsLabelField
                label="Include directories"
                name={"includeDirectoriesLabel"}
                info={"Informe as pastas onde os arquivos de definição devem ser procurados"} />
            </section>

            <VSCodeDataGrid id="includeGrid" grid-template-columns="30px">
              {fields.map((row: FieldArrayWithId<TFields, "includePaths", "id">, index: number) => (
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
                          title="Select folder with definition files"
                          name={`btnSelectFolder.${index}`}
                          info={"Selecione uma pasta que contenha arquivos de definição"}
                        />
                      </VSCodeDataGridCell>
                    </>
                  }
                </VSCodeDataGridRow>
              ))
              }
            </VSCodeDataGrid>
            <p>These settings can also be changed in %HOME_USER%/.totvsls/servers.json</p>
          </TdsForm>
        </FormProvider>
      </TdsPage>
    </main >
  );
}
