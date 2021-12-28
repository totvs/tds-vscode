import * as React from "react";
import * as ReactDOM from "react-dom";

import InpectorPanel from "./inpectorPanel";
import ErrorBoundary from "../helper/errorBoundary";
import { i18n } from "../helper";

declare global {
  interface Window {
    acquireVsCodeApi(): any;
    initialData: any;
  }
}

const vscode = window.acquireVsCodeApi();
const translations = window.initialData.translations;
const options = window.initialData.options;

i18n.translations = translations;

ReactDOM.render(
  <ErrorBoundary>
    <InpectorPanel vscode={vscode} options={options} />
  </ErrorBoundary>,
  document.getElementById("root")
);
