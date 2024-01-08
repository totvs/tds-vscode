import { VSCodeButton, VSCodeDataGrid, VSCodeDataGridCell, VSCodeDataGridRow } from "@vscode/webview-ui-toolkit/react";

import "./globalInclude.css";
import Page from "../components/page";
import ErrorBoundary from "../components/errorBoundary";
import React, { ChangeEvent } from "react";
import { TIncludeData } from "../model/addServerModel";
import { SubmitHandler, useFieldArray, useForm } from "react-hook-form";
import TDSForm, { IFormAction, TDSSelectionFolderField, TDSSimpleTextField, getDefaultActionsForm } from "../components/form";
import PopupMessage from "../components/popup-message";
import { CommonCommandFromPanelEnum, ReceiveMessage, sendReady, sendSaveAndClose } from "../utilities/common-command-webview";

enum ReceiveCommandEnum {
}
type ReceiveCommand = ReceiveMessage<CommonCommandFromPanelEnum & ReceiveCommandEnum, TFields>;

type TFields = {
  includePaths: TIncludeData[]
}

export default function GlobalInclude() {
  const {
    control,
    handleSubmit,
    setValue,
    setError,
    getValues,
    formState: { errors, isDirty, isValid },
  } = useForm<TFields>({
    defaultValues: {
      includePaths: [0 - 20].map(() => {
        return { path: "" };
      })
    },
    mode: "all"
  })
  const { fields, remove, insert } = useFieldArray(
    {
      control,
      name: "includePaths"
    });

  const onSubmit: SubmitHandler<TFields> = (data) => {
    data.includePaths = data.includePaths.filter((includePath: TIncludeData) => includePath.path.length > 0);
    sendSaveAndClose(data);
  }

  React.useEffect(() => {
    let listener = (event: any) => {
      const command: ReceiveCommand = event.data as ReceiveCommand;
      const model: TFields = command.data.model;
      console.log(">>>>>>>>>>>>>>>>");
      console.dir(event.data);
      console.dir(command);
      console.dir(model);

      switch (command.command) {
        case CommonCommandFromPanelEnum.UpdateModel:
          setValue("includePaths", model.includePaths);

          break;
        case CommonCommandFromPanelEnum.ValidateResponse:
          Object.keys(command.data).forEach((fieldName: string) => {
            setError(fieldName as any, {
              message: command.data[fieldName].message,
              type: command.data[fieldName].type
            })
          })
          break;
        default:
          break;
      }
    };

    window.addEventListener('message', listener);

    sendReady();

    return () => {
      window.removeEventListener('message', listener);
    }
  }, []);

  function addIncludePath(event: ChangeEvent<HTMLInputElement>, index: number) {
    var input: any = event.target;

    if (input.files.length > 0) {
      const path: string = input.files[0].path;
      const pos: number = path.lastIndexOf("\\") == -1 ? path.lastIndexOf("/") : path.lastIndexOf("\\");
      var selectedDir: string = path.substring(0, pos + 1);
      remove(index);
      insert(index, { path: selectedDir });
    }
  }

  function removeIncludePath(index: number) {
    remove(index);
    insert(index, { path: "" });
  }

  const model: TFields = getValues();
  const indexFirstPathFree: number = model.includePaths.findIndex((row: TIncludeData) => row.path == "");
  const actions: IFormAction[] = getDefaultActionsForm();
  actions[0].enabled = isDirty && isValid;

  return (
    <main>
      <ErrorBoundary>
        <Page title="Global Includes" linkToDoc="[Include global]servers.md#registro-de-servidores">
          <TDSForm
            actions={actions}
            errors={errors}
            control={control}
            onSubmit={handleSubmit(onSubmit)}>

            <p>The global search folder list is used when not specified in the server definition</p>

            <section className="tds-group-container" >
              <p className="tds-item-grow-group">Include directories
                <PopupMessage fieldName="include" message="Informe as pastas onde os arquivos de definição devem ser procurados" />
              </p>
            </section>

            <VSCodeDataGrid id="includeGrid" grid-template-columns="30px">
              {fields.map((row: TIncludeData, index: number) => (
                <VSCodeDataGridRow key={index}>
                  {row.path !== "" &&
                    <>
                      <VSCodeDataGridCell grid-column="1">
                        <VSCodeButton appearance="icon" onClick={() => removeIncludePath(index)} >
                          <span className="codicon codicon-close"></span>
                        </VSCodeButton>
                      </VSCodeDataGridCell>
                      <VSCodeDataGridCell grid-column="2">
                        <TDSSimpleTextField
                          name={`includePaths.${index}.path`}
                          control={control}
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
                        <TDSSelectionFolderField
                          control={control}
                          onSelect={(event) => addIncludePath(event, index)}
                          name={`btnSelectFolder.${index}`}
                          info={"Selecione uma pasta que contenha arquivos de definição"} />
                      </VSCodeDataGridCell>
                    </>
                  }
                </VSCodeDataGridRow>
              ))
              }
            </VSCodeDataGrid>
            <p>These settings can also be changed in %HOME_USER%/.totvsls/servers.json</p>
          </TDSForm>
        </Page>
      </ErrorBoundary>
    </main >
  );
}
