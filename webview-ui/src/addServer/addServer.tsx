import { ICommandFromPanel, vscode } from "../utilities/vscodeWrapper";
import { VSCodeButton, VSCodeDataGrid, VSCodeDataGridCell, VSCodeDataGridRow, VSCodeDropdown, VSCodeOption, VSCodeTextField } from "@vscode/webview-ui-toolkit/react";

import "./AddServer.css";
import Page, { IPageAction } from "../components/page";
import ErrorBoundary from "../components/errorBoundary";
import PopupMessage from "../components/popup-message";
import { ChangeEvent } from "react";
import React from "react";
import { TAddServerModel, TIncludeData } from "../model/addServerModel";
import { CommandFromPanelEnum, CommandToPanelEnum } from "../utilities/command-panel";
import { sendCheckDir, sendReady, sendSave, sendSaveAndClose } from "./sendCommand";

enum ACTIONS {
  ACT_SAVE,
  ACT_SAVE_CLOSE
}

declare module "react" {
  interface InputHTMLAttributes<T> extends HTMLAttributes<T> {
    webkitdirectory?: string;
    directory?: string;
  }
}

export default function AddServer() {
  console.log(">>> AddServer: initialize")
  const [model, setModel] = React.useState<TAddServerModel>({
    serverName: "",
    includePatches: []
  });
  const [_call, set_Call] = React.useState(0);

  React.useEffect(() => {
    console.log("React.useEffect");
    let listener = (event: any) => {
      const command: ICommandFromPanel<any> = event.data as ICommandFromPanel<any>;

      switch (command.command) {
        case CommandFromPanelEnum.UpdateModel:
          setModel({ ...model, ...command.model as TAddServerModel });

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

  function checkDir(event: ChangeEvent<HTMLInputElement>) {
    var input: any = event.target;

    if (input.files.length > 0) {
      var selectedDir = input.files[0].path;
      sendCheckDir(model!, selectedDir);

      set_Call(_call + 1);
    }
  }

  const actions: IPageAction[] = [
    {
      id: ACTIONS.ACT_SAVE,
      caption: "Save",
      appearance: "secondary",
      action: () => { sendSave(model!) }
    },
    {
      id: ACTIONS.ACT_SAVE_CLOSE,
      caption: "Save/Close",
      appearance: "primary",
      action: () => { sendSaveAndClose(model!) }
    }
  ];

  return (
    <main>
      <ErrorBoundary>
        <Page title={`Add Server ${_call} times`}
          actions={actions}
          linkToDoc="[Registro de Servidores]servers.md#registro-de-servidores"
        >
          <section className="tds-dropdown-container">
            <label htmlFor="serverType">Server Type</label>
            <VSCodeDropdown name="serverType">
              <VSCodeOption value="totvs_server_protheus">Protheus (Adv/PL)</VSCodeOption>
              <VSCodeOption value="totvs_server_logix">Logix (4GL)</VSCodeOption>
              <VSCodeOption value="totvs_server_totvstec">TOTVS Tec (Adv/PL e 4GL)</VSCodeOption>
              <PopupMessage fieldName="serverType" message="Selecione o tipo do servidor Protheus" />
            </VSCodeDropdown>
          </section>

          <section className="tds-text-field-container">
            <label htmlFor="serverName">Server Name</label>
            <VSCodeTextField name="serverName" placeholder="Local Server | Production Server"
              value={model!.serverName || "<no name>"}
              onChange={(event) => setModel({ ...model!, serverName: "event." })}
            >
              <PopupMessage fieldName="serverName" message="Informe um nome que o ajude a identificar o servidor" />
            </VSCodeTextField>
          </section>

          <section className="tds-text-field-container">
            <label htmlFor="address">Address</label>
            <VSCodeTextField name="address" placeholder="127.0.0.1 | localhost | myServer">
              <PopupMessage fieldName="address" message="Informe IP ou nome do servidor no qual esta o Protheus" />
            </VSCodeTextField>
          </section>

          <section className="tds-text-field-container">
            <label htmlFor="port">Port</label>
            <VSCodeTextField name="port" placeholder="1234">
              <PopupMessage fieldName="port" message="Informe a porta de conexão do SC" />
            </VSCodeTextField>
          </section>

          <section className="tds-group-container" >
            <p className="tds-item-grow-group">Include directories
              <PopupMessage fieldName="include" message="Informe as pastas onde os arquivos de definição devem ser procurados" />
            </p>
            {/* ts-expect-error */}
            <input type="file" name="btn-FileInclude"
              onChange={(event) => checkDir(event)}
              webkitdirectory="" directory="" />
          </section>

          <VSCodeDataGrid id="includeGrid" grid-template-columns="30px">
            {model && model.includePatches.map((row: TIncludeData) => (
              <VSCodeDataGridRow key={row.id}>
                <VSCodeDataGridCell grid-column="1">
                  <span className="codicon codicon-close"></span>
                </VSCodeDataGridCell>
                <VSCodeDataGridCell grid-column="2">{row.path}</VSCodeDataGridCell>
              </VSCodeDataGridRow>
            ))}
          </VSCodeDataGrid>
        </Page>
      </ErrorBoundary>
    </main >
  );
}
