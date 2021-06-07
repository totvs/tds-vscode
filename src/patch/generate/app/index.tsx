/*
Copyright 2021 TOTVS S.A

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

  http: //www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/
import * as React from "react";
import * as ReactDOM from "react-dom";

import ErrorBoundary from "../helper/errorBoundary";
import { i18n } from "../helper";
import GeneratePatchPanel from "./generatePatchPanel";

declare global {
  interface Window {
    acquireVsCodeApi(): any;
    initialData: any;
  }
}

const vscode = window.acquireVsCodeApi();
const memento = window.initialData.memento;
const translations = window.initialData.translations;
const generatePathData = window.initialData.generatePathData;

i18n.translations = translations;

ReactDOM.render(
  <ErrorBoundary>
    <GeneratePatchPanel vscode={vscode} memento={memento} initialData={generatePathData}/>
  </ErrorBoundary>,
  document.getElementById("root")
);
