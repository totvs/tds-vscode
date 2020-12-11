import * as React from "react";
import * as ReactDOM from "react-dom";
import { ErrorBoundary } from "../helper";
import { PatchView } from "./patchView";

declare global {
  interface Window {
    acquireVsCodeApi(): any;
    initialData: any;
  }
}

const vscode = window.acquireVsCodeApi();

ReactDOM.render(
  <ErrorBoundary>
    <PatchView vscode={vscode} />
  </ErrorBoundary>, document.getElementById("root"));
