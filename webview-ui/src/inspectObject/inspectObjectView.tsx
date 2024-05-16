import { VSCodeDataGrid, VSCodeDataGridCell, VSCodeDataGridRow } from "@vscode/webview-ui-toolkit/react";

import "./inspectObject.css";
import React from "react";
import { IFormAction, TdsPage, getDefaultActionsForm, tdsVscode } from "@totvs/tds-webtoolkit";
import { UseFormReturn, useFieldArray, useForm } from "react-hook-form";
import { CommonCommandEnum, ReceiveMessage } from "@totvs/tds-webtoolkit";
import { TdsSimpleTextField, TdsForm, TdsTextField, TdsCheckBoxField, TdsLabelField, setDataModel, setErrorModel, TdsSelectionField } from "@totvs/tds-webtoolkit";
import { sendExport, sendIncludeTRes } from "./sendCommand";

enum ReceiveCommandEnum {
}

type ReceiveCommand = ReceiveMessage<CommonCommandEnum & ReceiveCommandEnum, TFields>;

type TInspectorObject = {
  program: string;
  date: Date;
  status: string;
  rpo: string;
}

type TInspectorObjectModel = {
  includeTRes: boolean;
  filter: string;
  objects: TInspectorObject[];
  rowsLimit: number | 100 | 250 | 500;
}

type TFields = TInspectorObjectModel;

const EMPTY_INSPECTOR_OBJECT: TInspectorObject = {
  program: "",
  date: new Date(0, 0, 0, 0, 0, 0, 0),
  status: "",
  rpo: ""
}

const EMPTY_MODEL: TFields = {
  includeTRes: false,
  filter: "",
  objects: Array(10).map(() => EMPTY_INSPECTOR_OBJECT),
  rowsLimit: 100
}

type TInspectorObjectComponentProps = {
  methods: UseFormReturn<any>;
  id?: string;
  label: string;
  fieldName: string;
  rowsLimit: number;
}

function InspectorObjectComponent(props: TInspectorObjectComponentProps) {
  const { register, control } = props.methods;
  // const fieldState: ControllerFieldState = props.methods.control.getFieldState(props.fieldName);
  // const registerField = register(props.name, props.rules);
  // const options = props.options || [];
  // const currentValue: string = props.methods.getValues(props.name) as string;
  //const { control } = useFormContext();
  const { fields } = useFieldArray(
    {
      control: control,
      name: props.fieldName
    });

  return (
    <section className="tds-grid-container">
      {props.label && <TdsLabelField methods={props.methods} name={props.fieldName} label={props.label} />}
      <div className="tds-scroll" >
        <VSCodeDataGrid
          id={props.id ? props.id : props.fieldName}
          generate-header="sticky"
          grid-template-columns="8fr 8fr 3fr 3fr"
        >
          <VSCodeDataGridRow row-type="header">
            <VSCodeDataGridCell cell-type="columnheader" grid-column="1">Object Name</VSCodeDataGridCell>
            <VSCodeDataGridCell cell-type="columnheader" grid-column="2">Compile Date</VSCodeDataGridCell>
            <VSCodeDataGridCell cell-type="columnheader" grid-column="3">Status</VSCodeDataGridCell>
            <VSCodeDataGridCell cell-type="columnheader" grid-column="4">RPO</VSCodeDataGridCell>
          </VSCodeDataGridRow >
          {
            fields
              .filter((row: any, index: number) => {
                return (index < (props.rowsLimit == 0 ? 1000 : props.rowsLimit));
              })
              .map((row: any, index: number) => {
                return (
                  <VSCodeDataGridRow key={row.id}>
                    <VSCodeDataGridCell grid-column="1">
                      <TdsSimpleTextField
                        methods={props.methods}
                        className="tds-no-margin"
                        name={`${props.fieldName}.${index}.program`}
                        readOnly={true}
                      />
                    </VSCodeDataGridCell>
                    <VSCodeDataGridCell grid-column="2">
                      <TdsSimpleTextField
                        methods={props.methods}
                        className="tds-no-margin"
                        name={`${props.fieldName}.${index}.date`}
                        readOnly={true}
                      />
                    </VSCodeDataGridCell>
                    <VSCodeDataGridCell grid-column="3">
                      <TdsSimpleTextField
                        methods={props.methods}
                        className="tds-no-margin"
                        name={`${props.fieldName}.${index}.status`}
                        readOnly={true}
                      />
                    </VSCodeDataGridCell>
                    <VSCodeDataGridCell grid-column="4">
                      <TdsSimpleTextField
                        methods={props.methods}
                        className="tds-no-margin"
                        name={`${props.fieldName}.${index}.rpo`}
                        readOnly={true}
                      />
                    </VSCodeDataGridCell>
                  </VSCodeDataGridRow>
                )
              }
              )
          }
        </VSCodeDataGrid>
      </div>
    </section>
  );
}

export default function InspectObjectView() {
  const methods = useForm<TFields>({
    defaultValues: EMPTY_MODEL,
    mode: "all"
  })

  // const onSubmit: SubmitHandler<TFields> = (data) => {
  //   data.objectsRight = data.objectsRight.filter((object: TInspectorObject) => object.name.length > 0);

  //   sendSaveAndClose(data);
  // }

  React.useEffect(() => {

    let listener = (event: any) => {
      const command: ReceiveCommand = event.data as ReceiveCommand;
      const rowsLimit: number = methods.getValues("rowsLimit") as number
      console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>");
      console.dir(command);

      switch (command.command) {
        case CommonCommandEnum.UpdateModel:
          const model: TFields = command.data.model;
          const errors: TFields = command.data.errors;

          // model.objectsFiltered = applyFilter(methods.getValues("filter") || "", model.objectsLeft);
          // model.warningManyItens = model.objectsFiltered.length > rowsLimit;
          //console.log("model", model);
          model.objects.forEach((row: TInspectorObject, index: number) => {
            if (row.status == "N") {
              model.objects[index].status = "NoAuth";
            } else if (row.status == "P") {
              model.objects[index].status = "Prod";
            } else if (row.status == "D") {
              model.objects[index].status = "Dev";
            }

            if (row.rpo == "N") {
              model.objects[index].rpo = "None";
            } else if (row.rpo == "D") {
              model.objects[index].rpo = "Default";
            } else if (row.rpo == "T") {
              model.objects[index].rpo = "TLPP";
            } else if (row.rpo == "C") {
              model.objects[index].rpo = "Custom";
            }
          });

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

  function applyFilter(filter: string, objects: TInspectorObject[]): TInspectorObject[] {

    if (filter.length > 0) {
      const wildcard: RegExp = new RegExp(`^${filter.replace("?", ".").replace("*", ".*")}$`, "gi");

      return [...objects
        .filter((row: TInspectorObject) => {
          return wildcard.test(row.program)
        }).map((row: TInspectorObject) => {
          return row;
        })
      ]
    } else {
      return [...objects
        .map((row: TInspectorObject) => {
          return row;
        })
      ]
    }
  }

  const model: TFields = methods.getValues();
  const rowsLimit: number = model.rowsLimit;

  const actions: IFormAction[] = getDefaultActionsForm();
  actions.push({
    id: "btnExportTxt",
    caption: tdsVscode.l10n.t("Export (TXT)"),
    isProcessRing: true,
    enabled: methods.formState.isValid,
    type: "button",
    onClick: () => {
      sendExport("TXT", methods.getValues());
    }
  });
  actions.push({
    id: "btnExportCsv",
    caption: tdsVscode.l10n.t("Export (CSV)"),
    isProcessRing: true,
    enabled: methods.formState.isValid,
    type: "button",
    onClick: () => {
      sendExport("CSV", methods.getValues());
    }
  });

  return (
    <TdsPage title={tdsVscode.l10n.t("Objects Inspector")} linkToDoc="">
      <TdsForm
        methods={methods}
        onSubmit={() => { }}
        actions={actions}>

        <section className="tds-row-container" >
          <TdsTextField
            methods={methods}
            name="filter"
            label={tdsVscode.l10n.t("Filter")}
            info={tdsVscode.l10n.t("Filter by Object Name. Ex: Mat or Fat*")}
            onInput={(e: any) => {
              return new Promise(() => {
                // methods.setValue("objectsFiltered", applyFilter(e.target.value, methods.getValues("objectsLeft")));
                // methods.setValue("warningManyItens", methods.getValues("objectsFiltered").length > rowsLimit);
              });
            }}
          />

          <TdsCheckBoxField
            methods={methods}
            name="includeTRes"
            label="&nbsp;"
            textLabel={tdsVscode.l10n.t("Include *.TRES")}
            onInput={(e: any) => {
              return new Promise(() => {
                sendIncludeTRes(methods.getValues(), e.target.checked);
              });
            }}

          />

          <TdsSelectionField
            methods={methods}
            name={"rowsLimit"}
            label={tdsVscode.l10n.t("Resource count limit")}
            options={[
              { value: "100", text: tdsVscode.l10n.t("100 (fast render)") },
              { value: "250", text: "250" },
              { value: "500", text: tdsVscode.l10n.t("500 (slow render)") },
            ]} />
        </section>

        <section className="tds-row-container" id="selectGrid" >
          <InspectorObjectComponent
            methods={methods}
            fieldName="objects"
            label={tdsVscode.l10n.t("RPO Objects")}
            rowsLimit={100}
          />
        </section>
      </TdsForm>
    </TdsPage>
  );
}
