import { VSCodeButton, VSCodeDataGrid, VSCodeDataGridCell, VSCodeDataGridRow } from "@vscode/webview-ui-toolkit/react";

import "./patchGenerate.css";
import React from "react";
import { TdsPage, tdsVscode } from "@totvs/tds-webtoolkit";
import { FormProvider, SubmitHandler, UseFormReturn, useFieldArray, useForm, useFormContext } from "react-hook-form";
import { CommonCommandEnum, ReceiveMessage, sendSaveAndClose } from "@totvs/tds-webtoolkit";
import { TInspectorObject } from "../model/inspectorObjectModel";
import { TdsSimpleCheckBoxField, TdsSimpleTextField, TdsForm, TdsTextField, TdsCheckBoxField, TdsLabelField, setDataModel, setErrorModel, TdsSelectionField, TdsSelectionFolderField } from "@totvs/tds-webtoolkit";
import { sendIncludeTRes, sendToLeft, sendToRight } from "./sendCommand";

enum ReceiveCommandEnum {
  MOVE_TO_LEFT = "moveToLeft",
  MOVE_TO_RIGHT = "moveToRight"
}

type ReceiveCommand = ReceiveMessage<CommonCommandEnum & ReceiveCommandEnum, TFields>;

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
  rowsLimit: number | 100 | 250 | 500;
}

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
  objectsLeft: Array(10).map(() => EMPTY_INSPECTOR_OBJECT),
  objectsRight: Array(10).map(() => EMPTY_CHECK_INSPECTOR_OBJECT),
  objectsFiltered: [],
  rowsLimit: 100
}

type TSelectObjectComponentProps = {
  methods: UseFormReturn<any>;
  id?: string;
  label: string;
  fieldName: string;
  rowsLimit: number;
}

function SelectResourceComponent(props: TSelectObjectComponentProps) {
  const { control } = useFormContext();
  const { fields } = useFieldArray(
    {
      control: control,
      name: props.fieldName
    });

  return (
    <section className="tds-grid-container">
      {props.label && <TdsLabelField methods={props.methods} name={props.fieldName} label={props.label} />}
      <VSCodeDataGrid
        id={props.id ? props.id : props.fieldName}
        generate-header="none"
        grid-template-columns="1fr 8fr 3fr"
      >
        <div className="tds-scroll" >
          {
            fields
              .filter((row: any, index: number) => {
                return (index < (props.rowsLimit == 0 ? 1000 : props.rowsLimit));
              })
              .map((row: any, index: number) => {
                return (
                  <VSCodeDataGridRow key={row.id}>
                    <VSCodeDataGridCell grid-column="1" >
                      <TdsSimpleCheckBoxField
                        methods={props.methods}
                        name={`${props.fieldName}.${index}.check`}
                        textLabel={""}
                        label={""}
                      />
                    </VSCodeDataGridCell>
                    <VSCodeDataGridCell grid-column="2">
                      <TdsSimpleTextField
                        methods={props.methods}
                        className="tds-no-margin"
                        name={`${props.fieldName}.${index}.name`}
                        readOnly={true}
                      />
                    </VSCodeDataGridCell>
                    <VSCodeDataGridCell grid-column="3">
                      <TdsSimpleTextField
                        methods={props.methods}
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
        </div>
      </VSCodeDataGrid>
    </section>
  );
}

export default function PatchGenerateView() {
  const methods = useForm<TFields>({
    defaultValues: EMPTY_MODEL,
    mode: "all"
  })

  const watchWarningManyItens = methods.watch("warningManyItens");
  const onSubmit: SubmitHandler<TFields> = (data) => {
    data.objectsRight = data.objectsRight.filter((object: TInspectorObject) => object.name.length > 0);

    sendSaveAndClose(data);
  }

  React.useEffect(() => {

    let listener = (event: any) => {
      const command: ReceiveCommand = event.data as ReceiveCommand;
      const rowsLimit: number = methods.getValues("rowsLimit") as number

      switch (command.command) {
        case CommonCommandEnum.UpdateModel:
          const model: TFields = command.data.model;
          const errors: TFields = command.data.errors;

          model.objectsFiltered = applyFilter(methods.getValues("filter") || "", model.objectsLeft);
          model.warningManyItens = model.objectsFiltered.length > rowsLimit;

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

  function applyFilter(filter: string, objects: TInspectorObject[]): TObjectFiltered[] {

    if (filter.length > 0) {
      const wildcard: RegExp = new RegExp(`^${filter.replace("?", ".").replace("*", ".*")}$`, "gi");

      return [...objects
        .filter((row: TInspectorObject) => {
          return wildcard.test(row.name)
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

  const model: TFields = methods.getValues();
  const rowsLimit: number = model.rowsLimit;

  return (
    <TdsPage title={tdsVscode.l10n.t("Patch Generation from RPO")} linkToDoc="[Geração de pacote de atualização]servers.md#registro-de-servidores">
      <TdsForm
        methods={methods}
        onSubmit={onSubmit}>
        <section className="tds-row-container">
          <TdsTextField
            methods={methods}
            name="patchDest"
            label={tdsVscode.l10n.t("Output directory")}
            info={tdsVscode.l10n.t("Enter the destination folder of the generated update package")}
            readOnly={true}
            rules={{ required: true }}
          />

          <TdsSelectionFolderField
            methods={methods}
            openLabel={tdsVscode.l10n.t("Output Folder")}
            info={tdsVscode.l10n.t("Select the destination folder of the generated update package")}
            name="btn-patchDest"
            title={tdsVscode.l10n.t("Select Output Directory")}
          />

          <TdsTextField
            methods={methods}
            name="patchName"
            label={tdsVscode.l10n.t("Output Patch Filename")}
            info={tdsVscode.l10n.t("Enter update package name.")}
          />

        </section>

        <section className="tds-row-container" >
          <TdsTextField
            methods={methods}
            name="filter"
            label={tdsVscode.l10n.t("Filter")}
            info={tdsVscode.l10n.t("Filter by Object Name. Ex: Mat or Fat*")}
            onInput={(e: any) => {
              return new Promise(() => {
                methods.setValue("objectsFiltered", applyFilter(e.target.value, methods.getValues("objectsLeft")));
                methods.setValue("warningManyItens", methods.getValues("objectsFiltered").length > rowsLimit);
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

        <section className="tds-row-container" >
          {watchWarningManyItens ?
            <TdsLabelField
              methods={methods}
              name="warningManyItens"
              label={tdsVscode.l10n.t("Resource list has more than {0} items. Enter a more restrictive filter.", rowsLimit)}
            />
            :
            <TdsLabelField
              methods={methods}
              name="warningManyItens"
              label="&nbsp;"
            />
          }
        </section>

        <section className="tds-row-container" id="selectGrid" >
          <SelectResourceComponent
            methods={methods}
            fieldName="objectsFiltered"
            label={tdsVscode.l10n.t("RPO Objects")}
            rowsLimit={rowsLimit}
          />

          <section className="tds-row-container-column" id="directionButtons" >
            <VSCodeButton appearance="icon" onClick={() => {
              const selectedObjects = methods.getValues("objectsFiltered").filter((value) =>
                (typeof value.check == "string") ? value.check == "true" : value.check);
              sendToRight(methods.getValues(), selectedObjects);
            }} >
              <span className="codicon codicon-arrow-right"></span>
            </VSCodeButton>
            <VSCodeButton appearance="icon" onClick={() => {
              const selectedObjects = methods.getValues("objectsRight").filter((value) =>
                (typeof value.check == "string") ? value.check == "true" : value.check);

              sendToLeft(methods.getValues(), selectedObjects);
            }} >
              <span className="codicon codicon-arrow-left"></span>
            </VSCodeButton>
          </section>

          <SelectResourceComponent
            methods={methods}
            label={tdsVscode.l10n.t("To patch")}
            fieldName="objectsRight"
            rowsLimit={0}
          />
        </section>
      </TdsForm>
    </TdsPage>
  );
}
