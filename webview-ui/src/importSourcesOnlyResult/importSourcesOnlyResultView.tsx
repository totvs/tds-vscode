import "./importSourcesOnlyResult.css";
import { getDefaultActionsForm, IFormAction, TdsDataGrid, TdsFormActionsEnum, TdsPage, tdsVscode, TTdsDataGridAction, TTdsDataGridColumnDef } from "@totvs/tds-webtoolkit";
import React from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { CommonCommandEnum, ReceiveMessage, sendSaveAndClose } from "@totvs/tds-webtoolkit";
import { TdsForm, TdsSelectionFileField, TdsSelectionFolderField, TdsSimpleCheckBoxField, TdsTextField, setDataModel, setErrorModel } from "@totvs/tds-webtoolkit";
import { BuildResultCommandEnum, EMPTY_IMPORT_SOURCES_ONLY_RESULT_MODEL, ImportSourcesOnlyResultCommandEnum, TImportSourcesOnlyResultData, TImportSourcesOnlyResultModel } from "tds-shared/lib";

enum ReceiveCommandEnum {
}
type ReceiveCommand = ReceiveMessage<CommonCommandEnum & ReceiveCommandEnum, TImportSourcesOnlyResultModel>;

export default function ImportSourcesOnlyResultView() {
  const methods = useForm<TImportSourcesOnlyResultModel>({
    defaultValues: EMPTY_IMPORT_SOURCES_ONLY_RESULT_MODEL,
    mode: "all"
  })
  const [dataSource, setDataSource] = React.useState<TImportSourcesOnlyResultData[]>([]);

  const onSubmit: SubmitHandler<TImportSourcesOnlyResultModel> = (data) => {
    //not applicable
  }

  React.useEffect(() => {
    let listener = (event: any) => {
      const command: ReceiveCommand = event.data as ReceiveCommand;

      switch (command.command) {
        case CommonCommandEnum.UpdateModel:
          const model: TImportSourcesOnlyResultModel = command.data.model;

          setDataModel(methods.setValue, model);
          setDataSource(model.sourceObj);

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

  const columnsDef = (): TTdsDataGridColumnDef[] => {
    return [
      {
        type: "string",
        name: "name",
        label: "Source",
        width: "3fr",
        sortable: true,
        sortDirection: "asc",
      },
      {
        type: "datetime",
        name: "compileDate",
        label: "Compilation Date",
        width: "1fr",
        sortable: true,
        sortDirection: ""
      }
    ];
  }

  const sendExportTxt = (model: any) => {
    tdsVscode.postMessage({
      command: ImportSourcesOnlyResultCommandEnum.EXPORT,
      data: {
        type: "text",
        model: model
      }
    });
  }

  const sendExportCsv = (model: any) => {
    tdsVscode.postMessage({
      command: BuildResultCommandEnum.Export,
      data: {
        type: "csv",
        model: model
      }
    });
  }

  const formActions: IFormAction[] = getDefaultActionsForm().filter((action: IFormAction) => action.id == TdsFormActionsEnum.Close);
  formActions.push({
    id: "btnExportTxt",
    caption: tdsVscode.l10n.t("Export (TXT)"),
    isProcessRing: true,
    type: "button",
    onClick: () => {
      sendExportTxt(methods.getValues());
    }
  });
  formActions.push({
    id: "btnExportCsv",
    caption: tdsVscode.l10n.t("Export (CSV)"),
    isProcessRing: true,
    type: "button",
    onClick: () => {
      sendExportCsv(methods.getValues());
    }
  });

  const model: TImportSourcesOnlyResultModel = methods.getValues();

  return (
    <TdsPage title="TDS-Replay Sources Result">
      <TdsForm<TImportSourcesOnlyResultModel>
        methods={methods}
        onSubmit={onSubmit}
        actions={formActions}
      >
        <TdsDataGrid id={""}
          columnDef={columnsDef()}
          dataSource={model.sourceObj}
          options={{
          }}
        />
      </TdsForm>
    </TdsPage>
  );
}
