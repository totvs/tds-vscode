import { VSCodeButton, VSCodeDataGrid, VSCodeDataGridCell, VSCodeDataGridRow } from "@vscode/webview-ui-toolkit/react";

import "./patchGenerate.css";
import Page from "../components/page";
import React from "react";
import { FieldValues, FormProvider, SubmitHandler, UseControllerProps, UseFormSetValue, useFieldArray, useForm, useFormContext } from "react-hook-form";
import { CommonCommandFromPanelEnum, ReceiveMessage, sendReady, sendSaveAndClose } from "../utilities/common-command-webview";
import { TInspectorObject } from "../model/inspectorObjectModel";
import { TdsSimpleCheckBoxField, TdsSimpleTextField, IFormAction, TdsForm, TdsTextField, TdsCheckBoxField, TdsLabelField, setDataModel, setErrorModel } from "../components/form";
import { getDefaultActionsForm } from "../components/fields/numericField";

enum ReceiveCommandEnum {
}
type ReceiveCommand = ReceiveMessage<CommonCommandFromPanelEnum & ReceiveCommandEnum, TFields>;

type TObjectFiltered = TInspectorObject & { check: boolean };

type TFields = {
  patchName: string;
  patchDest: string;
  includeTRes: boolean;
  filter: string;
  warningManyItens: boolean;
  objectsLeft: TInspectorObject[];
  objectsRight: TObjectFiltered[];
  objectsFiltered: TObjectFiltered[];
}

const ROWS_LIMIT: number = 500;

const EMPTY_INSPECTOR_OBJECT: TInspectorObject = {
  name: "",
  type: "",
  date: ""
}

const EMPTY_CHECK_INSPECTOR_OBJECT: TObjectFiltered = {
  name: "",
  type: "",
  date: "",
  check: false
}

const EMPTY_MODEL: TFields = {
  patchDest: "", //(vscode.getState() | {})["patchDest"],
  patchName: "", //(vscode.getState() | {})["patchName"],
  includeTRes: false,
  filter: "",
  warningManyItens: false,
  objectsLeft: Array(ROWS_LIMIT).map(() => EMPTY_INSPECTOR_OBJECT),
  objectsRight: Array(ROWS_LIMIT).map(() => EMPTY_CHECK_INSPECTOR_OBJECT),
  objectsFiltered: []
}

type TSelectObjectComponentProps = {
  fieldName: string
}

function SelectObjectComponent(props: TSelectObjectComponentProps) {
  const {
    register,
    setValue,
    control,
    formState: { isDirty }
  } = useFormContext();

  const { fields, replace } = useFieldArray(
    {
      control: control,
      name: props.fieldName //props.name == "objectsFiltered" ? "objectsFiltered" : "objectsRight"
    });

  //const warningManyItens: boolean = model.objects.length > ROWS_LIMIT;

  return (
    <VSCodeDataGrid>
      {fields
        .filter((row: any, index: number) => {
          return (index < ROWS_LIMIT);
        })
        .map((row: any, index: number) => {
          return (
            <VSCodeDataGridRow key={row.id}>
              <VSCodeDataGridCell grid-column="1" >
                <TdsSimpleCheckBoxField
                  className="tds-no-margin"
                  name={`${props.fieldName}.${index}.check`}
                  textLabel={row.name}
                  label={""}
                />
              </VSCodeDataGridCell>
              <VSCodeDataGridCell grid-column="2">
                <TdsSimpleTextField
                  className="tds-no-margin"
                  name={`${props.fieldName}.${index}.type`}
                  readOnly={true}
                />
              </VSCodeDataGridCell>
              <VSCodeDataGridCell grid-column="3">
                <TdsSimpleTextField
                  className="tds-no-margin"
                  name={`${props.fieldName}.${index}.date`}
                  readOnly={true}
                />
              </VSCodeDataGridCell>
            </VSCodeDataGridRow>
          )
        }
        )
      }
    </VSCodeDataGrid>
  );
}

export default function PatchGenerateView() {
  const methods = useForm<TFields>({
    defaultValues: EMPTY_MODEL,
    mode: "all"
  })

  //watch("filter");
  const watchWarningManyItens = methods.watch("warningManyItens");
  const onSubmit: SubmitHandler<TFields> = (data) => {
    data.objectsRight = data.objectsRight.filter((object: TInspectorObject) => object.name.length > 0);

    sendSaveAndClose(data);
  }

  React.useEffect(() => {
    let listener = (event: any) => {
      const command: ReceiveCommand = event.data as ReceiveCommand;

      console.log("listener " + command.command);

      switch (command.command) {
        case CommonCommandFromPanelEnum.UpdateModel:
          const model: TFields = command.data.model;
          const errors: TFields = command.data.errors;

          model.objectsLeft = model.objectsLeft.filter((objectLeft: TInspectorObject) => model.objectsRight.findIndex((objectRight) => objectLeft.name == objectRight.name) == -1);
          model.objectsFiltered = extractData(methods.getValues("filter") || "", model.objectsLeft);
          model.warningManyItens = model.objectsFiltered.length > ROWS_LIMIT;

          console.log("objectsLeft=", model.objectsLeft.length);
          console.log("filtered=", model.objectsFiltered.length);
          console.log("objectsRight=", model.objectsRight.length);

          setDataModel(methods.setValue, model);
          setErrorModel(methods.setError, errors as any);

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

  // const model: TFields = getValues();
  // model.filter = model.filter.trim();
  const actions: IFormAction[] = getDefaultActionsForm();
  //actions[0].enabled = isDirty && isValid;

  //const warningManyItens: boolean = model.objectsFiltered.length > ROWS_LIMIT;
  //setValue("objectsLeft", fieldsFiltered);
  //replace(fieldsFiltered)
  //console.log("fields", fields.length);
  //console.log("fieldsFiltered", model.objectsFiltered.length);

  return (
    <main>
      <Page title="Patch generation from RPO" linkToDoc="[Geração de pacote de atualização]servers.md#registro-de-servidores">
        <FormProvider {...methods} >
          <TdsForm
            methods={methods}
            actions={actions}
            onSubmit={onSubmit}>

            <section className="tds-group-container" >
              <TdsTextField
                name="filter"
                label="Filter"
                info="Filtrar por nome do objeto. Ex: MAT or FAT*"
              />

              <TdsCheckBoxField
                name="includeTRes"
                label="&nbsp;"
                textLabel={"Include *.TRES"}
              />
            </section>

            <section className="tds-group-container" >
              {watchWarningManyItens ?
                <TdsLabelField
                  name="warningManyItens"
                  label={`List has more than ${ROWS_LIMIT} items. Enter a more restrictive filter.`}
                />
                :
                <TdsLabelField
                  name="warningManyItens"
                  label="&nbsp;"
                />
              }
            </section>

            <section className="tds-group-container" >
              <SelectObjectComponent
                fieldName="objectsFiltered"
              />

              <section className="tds-group-container-column" >
                <VSCodeButton appearance="icon" onClick={() => {
                  const selectedObjects = methods.getValues("objectsFiltered").filter((value) => value.check);
                  console.log(">>>>> confirm select");
                  console.log("selectedObjects=", selectedObjects.length);

                  methods.setValue("objectsRight", selectedObjects);
                }} >
                  <span className="codicon codicon-arrow-right"></span>
                </VSCodeButton>
                <VSCodeButton appearance="icon" onClick={() => {
                  const selectedObjects = methods.getValues("objectsRight").filter((value) => value.check);
                  console.log(">>>>> confirm select");
                  console.log("selectedObjects=", selectedObjects.length);

                  methods.setValue("objectsRight", selectedObjects);
                }} >
                  <span className="codicon codicon-arrow-left"></span>
                </VSCodeButton>
              </section>

              <SelectObjectComponent
                fieldName="objectsRight"
              />
            </section>
          </TdsForm>
        </FormProvider>
      </Page>
    </main >
  );
}
