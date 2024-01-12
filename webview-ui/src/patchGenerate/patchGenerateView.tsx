import { VSCodeDataGrid, VSCodeDataGridCell, VSCodeDataGridRow } from "@vscode/webview-ui-toolkit/react";

import "./patchGenerate.css";
import Page from "../components/page";
import ErrorBoundary from "../components/errorBoundary";
import React, { ChangeEvent } from "react";
import { FieldArrayWithId, SubmitHandler, useFieldArray, useForm } from "react-hook-form";
import TDSForm, { IFormAction, TDSCheckBoxField, TDSSimpleCheckBoxField, TDSSimpleTextField, TDSTextField, getDefaultActionsForm } from "../components/form";
import { CommonCommandFromPanelEnum, ReceiveMessage, sendReady, sendSaveAndClose } from "../utilities/common-command-webview";
import { TInspectorObject } from "../model/inspectorObjectModel";


enum ReceiveCommandEnum {
}
type ReceiveCommand = ReceiveMessage<CommonCommandFromPanelEnum & ReceiveCommandEnum, TFields>;

type TObjectFiltered = TInspectorObject & { check: boolean };

type TFields = {
  patchName: string;
  patchDest: string;
  includeTRes: boolean;
  filter: string;
  objectsLeft: TInspectorObject[];
  objectsRight: TInspectorObject[];
  objectsFiltered: TObjectFiltered[];
}

const ROWS_LIMIT: number = 500;

const EMPTY_INSPECTOR_OBJECT: TInspectorObject = {
  name: "",
  type: "",
  date: ""
}

const EMPTY_MODEL: TFields = {
  patchDest: "", //(vscode.getState() | {})["patchDest"],
  patchName: "", //(vscode.getState() | {})["patchName"],
  includeTRes: false,
  filter: "",
  objectsLeft: Array(ROWS_LIMIT).map(() => EMPTY_INSPECTOR_OBJECT),
  objectsRight: Array(ROWS_LIMIT).map(() => EMPTY_INSPECTOR_OBJECT),
  objectsFiltered: []
}

export default function PatchGenerateView() {
  const {
    control,
    handleSubmit,
    setValue,
    setError,
    getValues,
    formState: { errors, isDirty, isValid },
  } = useForm<TFields>({
    defaultValues: EMPTY_MODEL,
    mode: "all"
  })

  const { fields, replace } = useFieldArray(
    {
      control,
      name: "objectsFiltered"
    });

  const onSubmit: SubmitHandler<TFields> = (data) => {
    data.objectsRight = data.objectsRight.filter((object: TInspectorObject) => object.name.length > 0);

    sendSaveAndClose(data);
  }

  React.useEffect(() => {
    let listener = (event: any) => {
      const command: ReceiveCommand = event.data as ReceiveCommand;
      const model: TFields = command.data.model;

      switch (command.command) {
        case CommonCommandFromPanelEnum.UpdateModel:
          setValue("objectsLeft", model.objectsLeft);
          replace(extractData(getValues("filter") || "", model.objectsLeft));
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

  function extractData(filter: string, objects: TInspectorObject[]): TObjectFiltered[] {
    if (filter.length > 0) {
      const wildcard: RegExp = new RegExp(`^${filter.replace("?", ".").replace("*", ".*")}$`, "gi");
      console.log("wildcard = ", wildcard.source);

      return [...objects
        .filter((row: TInspectorObject) => {
          return wildcard.test(row.name);
        }).map((row: TInspectorObject) => {
          return { ...row, check: false }
        })
      ]
    } else {
      return [...objects
        .map((row: TInspectorObject) => {
          return { ...row, check: false }
        })
      ]
    }
  }

  const model: TFields = getValues();
  model.filter = model.filter.trim();
  const actions: IFormAction[] = getDefaultActionsForm();
  actions[0].enabled = isDirty && isValid;

  const warningManyItens: boolean = model.objectsFiltered.length > ROWS_LIMIT;
  //setValue("objectsLeft", fieldsFiltered);
  //replace(fieldsFiltered)
  console.log("fields", fields.length);
  console.log("fieldsFiltered", model.objectsFiltered.length);

  return (
    <main>
      <ErrorBoundary>
        <Page title="Patch generation from RPO" linkToDoc="[Geração de pacote de atualização]servers.md#registro-de-servidores">
          <TDSForm
            actions={actions}
            errors={errors}
            control={control}
            onSubmit={handleSubmit(onSubmit)}>

            <section className="tds-group-container" >
              <TDSTextField
                className="tds-item-grow"
                name="filter"
                label="Filter"
                control={control}
                info="Filtrar por nome do objeto. Ex: MAT or FAT*"
                onChange={(event: ChangeEvent<HTMLInputElement>) => {
                  const filter: string = event.currentTarget.value.trim();
                  const objectsLeft: TInspectorObject[] = getValues("objectsLeft");
                  const objectsFiltered: TObjectFiltered[] = extractData(filter, objectsLeft);

                  setValue("filter", filter);
                  replace(objectsFiltered)
                }}
              />

              <TDSCheckBoxField
                name="includeTRes"
                label="&nbsp;"
                textLabel={"Include *.TRES"}
                control={control}
                onChecked={(checked: boolean) => {
                  setValue("includeTRes", checked);
                }} />
            </section>

            <section className="tds-group-container" >
              {warningManyItens ?
                <p className="tds-no-margin">List has more than <b>{ROWS_LIMIT}</b> items. Enter a more restrictive filter</p>
                : <p>&nbsp;</p>}
            </section>

            <section className="tds-group-container" >
              <VSCodeDataGrid id="objectsFilteredGrid">
                {fields
                  .filter((row: FieldArrayWithId<TFields, "objectsFiltered", "id">, index: number) => {
                    return (index < ROWS_LIMIT);
                  })
                  .map((row: FieldArrayWithId<TFields, "objectsFiltered", "id">, index: number) => {
                    return (
                      <VSCodeDataGridRow className="compact" key={row.id}>
                        <VSCodeDataGridCell grid-column="1">
                          <TDSSimpleCheckBoxField
                            className="tds-no-margin"
                            name={`objectsFiltered.${index}.check`}
                            textLabel={row.name}
                            control={control}
                            onChecked={(checked: boolean) => {
                              setValue(`objectsFiltered.${index}.check`, checked);
                            }} />
                        </VSCodeDataGridCell>
                        <VSCodeDataGridCell grid-column="2">
                          <TDSSimpleTextField
                            className="tds-no-margin"
                            name={`objectsFiltered.${index}.type`}
                            control={control}
                            readOnly={true}
                          />
                        </VSCodeDataGridCell>
                        <VSCodeDataGridCell grid-column="3">
                          <TDSSimpleTextField
                            className="tds-no-margin"
                            name={`objectsFiltered.${index}.date`}
                            control={control}
                            readOnly={true}
                          />
                        </VSCodeDataGridCell>
                      </VSCodeDataGridRow>
                    )
                  }
                  )
                }
              </VSCodeDataGrid>
            </section>
          </TDSForm>
        </Page>
      </ErrorBoundary>
    </main >
  );
}
