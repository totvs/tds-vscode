import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import { sendReady } from "../utilities/common-command-webview";

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById("root")
);

sendReady();
