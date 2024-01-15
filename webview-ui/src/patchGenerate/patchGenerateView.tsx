import { VSCodeButton, VSCodeDataGrid, VSCodeDataGridCell, VSCodeDataGridRow } from "@vscode/webview-ui-toolkit/react";

import "./patchGenerate.css";
import Page from "../components/page";
import ErrorBoundary from "../components/errorBoundary";
import React, { ChangeEvent } from "react";
import { Control, FieldArrayWithId, FieldValues, SubmitHandler, UseControllerProps, UseFormSetValue, useFieldArray, useForm } from "react-hook-form";
import TDSForm, { IFormAction, TDSCheckBoxField, TDSLabelField, TDSSimpleCheckBoxField, TDSSimpleTextField, TDSTextField, getDefaultActionsForm } from "../components/form";
import { CommonCommandFromPanelEnum, ReceiveMessage, sendReady, sendSaveAndClose } from "../utilities/common-command-webview";
import { TInspectorObject } from "../model/inspectorObjectModel";
import { log } from "console";

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
  warningManyItens: false,
  objectsLeft: Array(ROWS_LIMIT).map(() => EMPTY_INSPECTOR_OBJECT),
  objectsRight: Array(ROWS_LIMIT).map(() => EMPTY_INSPECTOR_OBJECT),
  objectsFiltered: []
}

interface ISelectObjectComponentProps<T extends FieldValues> extends UseControllerProps<T> {
  //fieldName: string
}

function SelectObjectComponent(props: ISelectObjectComponentProps<TFields> & { _setValue: UseFormSetValue<TFields> }) {
  const { fields, replace } = useFieldArray(
    {
      control: props.control,
      name: props.name == "objectsFiltered" ? "objectsFiltered" : "objectsRight"
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
                <TDSSimpleCheckBoxField
                  className="tds-no-margin"
                  name={`${props.name}.${index}.check`}
                  textLabel={row.name}
                  control={props.control}
                  onChecked={(checked: boolean) => {
                    console.log("checked=", checked);
                    props._setValue(`objectsFiltered.${index}.check`, checked);
                  }} />
              </VSCodeDataGridCell>
              <VSCodeDataGridCell grid-column="2">
                <TDSSimpleTextField
                  className="tds-no-margin"
                  name={`${props.name}.${index}.type`}
                  control={props.control}
                  readOnly={true}
                />
              </VSCodeDataGridCell>
              <VSCodeDataGridCell grid-column="3">
                <TDSSimpleTextField
                  className="tds-no-margin"
                  name={`${props.name}.${index}.date`}
                  control={props.control}
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
  const {
    control,
    handleSubmit,
    setValue,
    setError,
    getValues,
    watch,
    formState: { errors, isDirty, isValid },
  } = useForm<TFields>({
    defaultValues: EMPTY_MODEL,
    mode: "all"
  })

  //watch("filter");
  const watchWarningManyItens = watch("warningManyItens");
  const onSubmit: SubmitHandler<TFields> = (data) => {
    data.objectsRight = data.objectsRight.filter((object: TInspectorObject) => object.name.length > 0);

    sendSaveAndClose(data);
  }

  React.useEffect(() => {
    let listener = (event: any) => {
      const command: ReceiveCommand = event.data as ReceiveCommand;
      const model: TFields = command.data.model;

      console.log("listener " + command.command);
      console.dir(model);

      switch (command.command) {
        case CommonCommandFromPanelEnum.UpdateModel:
          const objectsFiltered = extractData(getValues("filter") || "", model.objectsLeft);
          console.log("objectsLeft=", model.objectsLeft.length);
          console.log("filtered=", objectsFiltered.length);

          setValue("objectsLeft", model.objectsLeft);
          setValue("objectsFiltered", objectsFiltered);
          setValue("warningManyItens", objectsFiltered.length > ROWS_LIMIT);

          //replace(extractData(getValues("filter") || "", model.objectsLeft));
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

  // const model: TFields = getValues();
  // model.filter = model.filter.trim();
  const actions: IFormAction[] = getDefaultActionsForm();
  actions[0].enabled = isDirty && isValid;

  //const warningManyItens: boolean = model.objectsFiltered.length > ROWS_LIMIT;
  //setValue("objectsLeft", fieldsFiltered);
  //replace(fieldsFiltered)
  //console.log("fields", fields.length);
  //console.log("fieldsFiltered", model.objectsFiltered.length);

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
                  console.log((">>>>> onChange filter"));

                  const filter: string = event.currentTarget.value.trim();
                  const objectsLeft: TInspectorObject[] = getValues("objectsLeft");
                  const objectsFiltered = extractData(filter, objectsLeft);
                  console.log("filtered=", objectsFiltered.length);
                  //setValue("objectsLeft", model.objectsLeft);
                  setValue("objectsFiltered", objectsFiltered);
                  setValue("warningManyItens", objectsFiltered.length > ROWS_LIMIT);
                  //replace(objectsFiltered)
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
              {watchWarningManyItens ?
                <TDSLabelField
                  name="warningManyItens"
                  control={control}
                  label=
                  {`List has more than ${ROWS_LIMIT} items. Enter a more restrictive filter.`}
                />
                :
                <TDSLabelField
                  name="warningManyItens"
                  control={control}
                  label="&nbsp;" />
              }
            </section>

            <section className="tds-group-container" >
              <SelectObjectComponent
                name="objectsFiltered"
                control={control}
                _setValue={setValue}
              />
              <VSCodeButton appearance="icon" onClick={() => {
                const selectedObjects = getValues("objectsFiltered").filter((value) => value.check);
                console.log(">>>>> confirm select");
                console.log("selectedObjects=", selectedObjects.length);

                setValue("objectsRight", selectedObjects);
              }} >
                <span className="codicon codicon-arrow-right"></span>
              </VSCodeButton>
              <SelectObjectComponent
                control={control}
                name="objectsRight"
                _setValue={setValue}
              />
            </section>
          </TDSForm>
        </Page>
      </ErrorBoundary>
    </main >
  );
}
