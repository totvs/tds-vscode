import * as React from "react";
import ErrorBoundary from "./ErrorBoundary";
import TimeLineTable from "./TimeLineTable";
import { ICommand, CommandToDA, CommandToPage } from "../Command";

interface IConfigProps {
  vscode: any;
  initialData: any;
}

export interface IConfigState {
  config: any;
}


export default function TDSReplayTimeLineWebView(props: IConfigProps, state: IConfigState) {

  let vscode = props.vscode;

  let oldState = vscode.getState();

  // let initialData =  props.initialData;
  // let initDataKeys =  Object.keys(initialData);
  // let initDataValues =  Object.values(initialData);

  if (oldState) {

    let command: ICommand = {
      action: CommandToDA.GetCurrentState,
      content: {},
    };
    vscode.postMessage(command);

  } else {
    //console.debug("Setting new state");
    let initialData = props.initialData;
    let _state = {
      config: initialData,
      needReload: false,
    };
    vscode.setState(_state);
  }

  return (
    <React.Fragment>
      <ErrorBoundary>
      <TimeLineTable vscode={vscode}/>
      </ErrorBoundary>
    </React.Fragment>
  );
}
