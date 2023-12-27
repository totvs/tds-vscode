import { vscode } from "../utilities/vscodeWrapper";
import { VSCodeButton, VSCodeDataGrid, VSCodeDataGridCell, VSCodeDataGridRow, VSCodeDropdown, VSCodeOption, VSCodeTextField } from "@vscode/webview-ui-toolkit/react";

import "./AddServer.css";
import Page, { IPageAction } from "../components/page";
import ErrorBoundary from "../components/errorBoundary";
import PopupMessage from "../components/popup-message";

interface IIncludeRowData {
  id: number;
  path: string;
}

declare module "react" {
  interface InputHTMLAttributes<T> extends HTMLAttributes<T> {
    webkitdirectory?: string;
    directory?: string;
  }
}
export default function App() {

  const includeData: IIncludeRowData[] = [
    { id: 0, path: "folder 1" },
    { id: 1, path: "folder 2" },
    { id: 2, path: "folder 3" },
  ];

  const actions: IPageAction[] = [
    {
      caption: "Save",
      appearance: "secondary",
      action: () => { }
    },
    {
      caption: "Save/Close",
      appearance: "primary",
      action: () => { }
    }
  ];

  return (
    <main>
      <ErrorBoundary>
        <Page title="Add Server"
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
            <VSCodeTextField name="serverName" placeholder="Local Server | Production Server">
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
            <input type="file" name="btn-FileInclude" webkitdirectory="" directory="" />
          </section>

          <VSCodeDataGrid id="includeGrid" grid-template-columns="30px">
            {includeData.map((row) => (
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
