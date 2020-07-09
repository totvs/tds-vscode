import * as React from "react";
import * as ReactDOM from "react-dom";
import MonitorPanel from "./monitorPanel";

declare global {
  interface Window {
    acquireVsCodeApi(): any;
    initialData: any;
  }
}

const vscode = window.acquireVsCodeApi();
const memento = window.initialData.memento;

ReactDOM.render(
  <MonitorPanel vscode={vscode} memento={memento}/>,
  document.getElementById("root")
  );
