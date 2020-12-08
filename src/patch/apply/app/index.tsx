import * as React from "react";
import * as ReactDOM from "react-dom";

import ApplyPatchPanel from "./applyPatchPanel";
import ErrorBoundary from "../helper/errorBoundary";
import { i18n } from "../helper";

declare global {
  interface Window {
    acquireVsCodeApi(): any;
    initialData: any;
  }
}

const vscode = window.acquireVsCodeApi();
const memento = window.initialData.memento;
const translations = window.initialData.translations;

i18n.translations = translations;

ReactDOM.render(
  <ErrorBoundary>
    <ApplyPatchPanel vscode={vscode} memento={memento} />
  </ErrorBoundary>,
  document.getElementById("root")
);
