import { vscode } from "../utilities/vscodeWrapper";
import { VSCodeButton, VSCodeDataGrid, VSCodeDataGridCell, VSCodeDataGridRow, VSCodeDropdown, VSCodeOption, VSCodeTextField } from "@vscode/webview-ui-toolkit/react";

import "./AddServer.css";
import Page from "../components/page";
import ErrorBoundary from "../components/errorBoundary";
import PopupMessage from "../components/popup-message";

interface IIncludeRowData {
  path: string;
}
export default function App() {

  function showInfoMessage(event: any, message: string) {
    console.dir(event);
    console.log(message);
  }

  function handleHowdyClick() {
    vscode.postMessage({
      command: "hello",
      text: "Hey there partner! 🤠",
    });
  }

  const includeData: IIncludeRowData[] = [
    { path: "folder 1" },
    { path: "folder 2" },
    { path: "folder 3" },
  ];

  return (
    <main>
      <ErrorBoundary>
        <Page title="Add Server"
          linkToDoc="[Registro de Servidores]servers.md#registro-de-servidores"
        >
          <section className="dropdown-container">
            <label htmlFor="serverType">Server Type</label>
            <VSCodeDropdown name="serverType">
              <VSCodeOption value="totvs_server_protheus">Protheus (Adv/PL)</VSCodeOption>
              <VSCodeOption value="totvs_server_logix">Logix (4GL)</VSCodeOption>
              <VSCodeOption value="totvs_server_totvstec">TOTVS Tec (Adv/PL e 4GL)</VSCodeOption>
              <span slot="end" className="codicon codicon-info"
                onMouseOver={(event) => showInfoMessage(event, "Ajuda")}
              ></span>
            </VSCodeDropdown>
          </section>

          <PopupMessage id="x" message="Ajuda" />

          <section className="text-field-container">
            <label htmlFor="serverName">Server Name</label>
            <VSCodeTextField name="serverName"
              placeholder="Local Server | Production Server">
              <span slot="end" className="codicon codicon-info"
                onMouseOver={(event) => showInfoMessage(event, "Ajuda")}
              ></span>
            </VSCodeTextField>

          </section>

          <section className="text-field-container">
            <label htmlFor="address">Address</label>
            <VSCodeTextField name="address"
              placeholder="127.0.0.1 | localhost | myServer">
              <span slot="end" className="codicon codicon-info"
                onMouseOver={(event) => showInfoMessage(event, "Ajuda")}
              ></span>
            </VSCodeTextField>
          </section>

          <section className="text-field-container">
            <label htmlFor="port">Port</label>
            <VSCodeTextField name="port"
              placeholder="1234">
              <span slot="end" className="codicon codicon-info"
                onMouseOver={(event) => showInfoMessage(event, "Ajuda")}
              ></span>
            </VSCodeTextField>
          </section>

          <p>Include directories</p>
          <input type="file" name="btn-FileInclude" />

          <VSCodeDataGrid id="includeGrid"
            grid-template-columns="30px"
          >
            <VSCodeDataGridRow row-type="header">
              <VSCodeDataGridCell cell-type="columnheader" grid-column="1">&nbsp;</VSCodeDataGridCell>
              <VSCodeDataGridCell cell-type="columnheader" grid-column="2">Path</VSCodeDataGridCell>
            </VSCodeDataGridRow>
            {includeData.map(row => (
              <VSCodeDataGridRow>
                <VSCodeDataGridCell grid-column="1">
                  <span className="codicon codicon-close"></span>
                </VSCodeDataGridCell>
                <VSCodeDataGridCell grid-column="2">{row.path}</VSCodeDataGridCell>
              </VSCodeDataGridRow>
            ))}
          </VSCodeDataGrid>

          <VSCodeButton onClick={handleHowdyClick}>Howdy!</VSCodeButton>
        </Page>
      </ErrorBoundary>
    </main >
  );
}
