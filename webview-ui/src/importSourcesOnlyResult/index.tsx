import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import { sendReady } from "@totvs/tds-webtoolkit";

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById("root")
);

sendReady();
