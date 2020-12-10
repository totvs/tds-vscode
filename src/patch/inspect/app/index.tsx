import * as React from "react";
import * as ReactDOM from "react-dom";
import { PatchView } from "./patchView";

declare global {
  interface Window {
    acquireVsCodeApi(): any;
    initialData: any;
  }
}

const vscode = window.acquireVsCodeApi();
//const translations = window.initialData.translations;

//i18n.translations = translations;

ReactDOM.render(<PatchView vscode={vscode} />, document.getElementById("root"));
