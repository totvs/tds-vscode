import * as React from "react";
import * as ReactDOM from "react-dom";
import MonitorPanel from "./monitorPanel";
import { ServerItem } from "../../serverItemProvider";

declare global {
  interface Window {
    acquireVsCodeApi(): any;
    initialData: any;
  }
}

const vscode = window.acquireVsCodeApi();
const speed = window.initialData.speed;

ReactDOM.render(
  <MonitorPanel vscode={vscode}  speed={speed}/>,
  document.getElementById("root")
  );
