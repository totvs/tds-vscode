import * as React from "react";
import * as ReactDOM from "react-dom";

import "./index.css";
import MonitorView from "./monitorView";

interface Props {
  value:string;
  name:string;
}

declare global {
  interface Window {
    acquireVsCodeApi(): any;
    initialData: any;
  }
}

const vscode = window.acquireVsCodeApi();
//vscode={vscode} initialData={window.initialData}
ReactDOM.render(
  <MonitorView  />,
  document.getElementById("root")
);

