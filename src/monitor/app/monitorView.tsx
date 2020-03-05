import React from "react";
import ErrorBoundary2 from "./errorBoundary2";
import { makeStyles, Theme } from "@material-ui/core";
import { CommandAction } from "../command";
import MonitorPanel from "./monitorPanel";
import IMonitorUser from "../monitorUser";

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
    display: "flex",
    height: 224
  },
  tabs: {
    borderRight: `1px solid ${theme.palette.divider}`
  }
}));

let listener = undefined;

interface IMonitorView {
  vscode: any;
}

export default function MonitorView(props: IMonitorView) {
  const classes = useStyles();
  const [serverList, setServerList] = React.useState([]);
  const [current, setCurrent] = React.useState("");

  if (listener === undefined) {
    listener = (event: any) => {
      const message = event.data; // The JSON data our extension sent

      switch (message.command) {
        case CommandAction.ToggleServer: {
          setServerList(message.data);
          setCurrent(message.current);
          break;
        }
      }
    };

    window.addEventListener("message", listener);
  }

  const server = serverList.find(value => {
    return value.id === current;
  });

  return (
    <React.Fragment>
      <ErrorBoundary2>
        <MonitorPanel server={server} vscode={props.vscode} />
      </ErrorBoundary2>
    </React.Fragment>
  );
}
