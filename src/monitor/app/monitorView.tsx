import React from "react";
import ErrorBoundary2 from "./errorBoundary2";
import { makeStyles, Theme } from "@material-ui/core";
import { CommandAction } from "../command";
import MonitorPanel from "./monitorPanel";


let listener = undefined;

interface IMonitorView {
  vscode: any;
}

export default function MonitorView(props: IMonitorView) {
  const [targetServer, setTargetServer] = React.useState();
  const [titles, setTitles] = React.useState<string[]>([]);

  if (listener === undefined) {
    listener = (event: MessageEvent) => {
      const message = event.data; // The JSON data our extension sent

      switch (message.command) {
        case CommandAction.ToggleServer: {
          setTargetServer(message.current);
          setTitles([
            message.server.name,
            message.server.address + ":" + message.server.port
          ]);

          break;
        }
      }
    };

    window.addEventListener("message", listener);
  }

  return (
    <React.Fragment>
      <ErrorBoundary2>
        <MonitorPanel
          targetServer={targetServer}
          vscode={props.vscode}
          titles={titles}
        />
      </ErrorBoundary2>
    </React.Fragment>
  );
}
