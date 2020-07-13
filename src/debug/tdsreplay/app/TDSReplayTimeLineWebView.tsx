import * as React from "react";
import ErrorBoundary from "./ErrorBoundary";
import TimeLineTable from "./TimeLineTable";

interface IConfigProps {
  vscode: any;
  initialData: any;
}

export interface IConfigState {
  //config: IServerItem;
}

export default class TDSReplayTimeLineWebView extends React.Component<IConfigProps,IConfigState> {
  private vscode: any;
  constructor(props: any) {
    super(props);
    this.vscode = props.vscode;

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
        <ErrorBoundary>
        <TimeLineTable vscode={this.vscode}/>
        </ErrorBoundary>
      </React.Fragment>
    );
  }
}
