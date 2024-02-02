import React from "react";
import AddServerView from "./addServerView";
import { createRoot } from "react-dom/client";
import "../css/main.css"
import { sendReady } from "../utilities/common-command-webview";

const root = createRoot(document.getElementById("root")!);
root.render(
  <React.StrictMode>
    <AddServerView />
  </React.StrictMode>,
);

sendReady();
