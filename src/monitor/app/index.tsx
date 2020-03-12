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
ReactDOM.render(
  <MonitorView  vscode={vscode}/>,
  document.getElementById("root")
);

