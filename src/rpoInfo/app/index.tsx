import * as React from "react";
import * as ReactDOM from "react-dom";

import RpoInfoPanel from "./rpoInfoPanel";
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
const memento = {};

i18n.translations = translations;

ReactDOM.render(
  <ErrorBoundary>
    <RpoInfoPanel vscode={vscode} memento={memento} />
  </ErrorBoundary>,
  document.getElementById("root")
);
