import * as React from "react";
import * as ReactDOM from "react-dom";
import "./index.css";
import TDSReplayTimeLineWebView from "./TDSReplayTimeLineWebView";

interface Props {
  value:string,
  name:string
}

declare global {
  interface Window {
    acquireVsCodeApi(): any;
    initialData: any;
  }
}

const vscode = window.acquireVsCodeApi();
const initialData = window.initialData;

ReactDOM.render(
  <TDSReplayTimeLineWebView vscode={vscode} initialData={initialData}/>,
  document.getElementById("root")
);

