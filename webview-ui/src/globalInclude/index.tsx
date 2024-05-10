import React from "react";
import { createRoot } from "react-dom/client";
import "../css/main.css"
import GlobalIncludeView from "./globalIncludeView";
import { sendReady } from "@totvs/tds-webtoolkit";

const root = createRoot(document.getElementById("root")!);
root.render(
  <React.StrictMode>
    <GlobalIncludeView />
  </React.StrictMode>,
);

sendReady();
