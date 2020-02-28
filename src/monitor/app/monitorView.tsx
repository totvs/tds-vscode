import React from "react";
import MonitorTable from "./monitorTable";
import ErrorBoundary2 from "./errorBoundary2";

interface IConfigProps {
  vscode: any;
  initialData: any;
}

export interface IConfigState {
  //config: IServerItem;
}

export let myVscode: any;

export default class MonitorView extends React.Component<
  IConfigProps,
  IConfigState
> {
  constructor(props: any) {
    console.log("MonitorView: constructor.0");

    super(props);

    myVscode = props.vscode; //TODO: rever código. QB

    let oldState = this.props.vscode.getState();
    if (oldState) {
      // console.log("Maintaning old state");
      this.state = oldState;
    } else {
      // console.log("Setting new state");
      let initialData = this.props.initialData;
      this.state = { config: initialData };
      this.props.vscode.setState(this.state);
    }
  }

    render() {
    return (
      <React.Fragment>
        <ErrorBoundary2>
          <MonitorTable />
        </ErrorBoundary2>
      </React.Fragment>
    );
  }



}
