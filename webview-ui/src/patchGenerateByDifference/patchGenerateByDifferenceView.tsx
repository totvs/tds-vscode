/*
Copyright 2021 TOTVS S.A

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

import "./patchGenerateByDifference.css";
import React from "react";
import { TdsPage, tdsVscode } from "@totvs/tds-webtoolkit";
import { SubmitHandler, UseFormReturn, useForm } from "react-hook-form";
import { CommonCommandEnum, ReceiveMessage, sendSaveAndClose } from "@totvs/tds-webtoolkit";
import { TdsForm, TdsTextField, setDataModel, setErrorModel, TdsSelectionFolderField } from "@totvs/tds-webtoolkit";
import { TGeneratePatchByDifferenceModel } from "tds-shared/lib";

enum ReceiveCommandEnum {
}

type ReceiveCommand = ReceiveMessage<CommonCommandEnum & ReceiveCommandEnum, TGeneratePatchByDifferenceModel>;

const EMPTY_MODEL: TGeneratePatchByDifferenceModel = {
  patchDest: "", //(vscode.getState() | {})["patchDest"],
  patchName: "",
  //  rpoMasterFile: "",
  rpoMasterFolder: ""
}

interface IPatchGenerateByDifferenceViewProps {
  //isServerP20OrGreater: boolean;
}

export default function PatchGenerateByDifferenceView(props: IPatchGenerateByDifferenceViewProps) {
  const methods = useForm<TGeneratePatchByDifferenceModel>({
    defaultValues: EMPTY_MODEL,
    mode: "all"
  })

  const onSubmit: SubmitHandler<TGeneratePatchByDifferenceModel> = (data) => {
    sendSaveAndClose(data);
  }

  React.useEffect(() => {

    let listener = (event: any) => {
      const command: ReceiveCommand = event.data as ReceiveCommand;

      switch (command.command) {
        case CommonCommandEnum.UpdateModel:
          const model: TGeneratePatchByDifferenceModel = command.data.model;
          const errors: TGeneratePatchByDifferenceModel = command.data.errors;

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

  return (
    <TdsPage title={tdsVscode.l10n.t("Patch Generation by Difference RPO")} linkToDoc="">
      <TdsForm methods={methods}
        onSubmit={onSubmit}>
        <section className="tds-row-container">
          <TdsTextField
            name="rpoMasterFolder"
            label={tdsVscode.l10n.t("RPO Master Location")}
            info={tdsVscode.l10n.t("Select RPO Master Location")}
            rules={{ required: true }}
            readOnly={false}
          />

          <TdsSelectionFolderField
            openLabel={tdsVscode.l10n.t("RPO Master Location")}
            info={tdsVscode.l10n.t("Use the navigation tree on the side")}
            name="btn-rpoMaster"
            title={tdsVscode.l10n.t("Select RPO Master Location")}
            fileSystem="serverFS"
          />
        </section>

        <section className="tds-row-container">
          <TdsTextField
            name="patchDest"
            label={tdsVscode.l10n.t("Output Folder")}
            info={tdsVscode.l10n.t("Select the folder from where the generated package will be recorded")}
            readOnly={true}
            rules={{ required: true }}
          />

          <TdsSelectionFolderField
            openLabel={tdsVscode.l10n.t("Output Folder")}
            info={tdsVscode.l10n.t("Select the destination folder of the generated update package")}
            name="btn-patchDest"
            title={tdsVscode.l10n.t("Select Output Directory")}
          />

          <TdsTextField
            name="patchName"
            label={tdsVscode.l10n.t("Output Patch Filename")}
            info={tdsVscode.l10n.t("Enter update package name.")}
          />

        </section>
      </TdsForm>
    </TdsPage>
  );
}
