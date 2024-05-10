import React from "react";
import { createRoot } from "react-dom/client";
import "../css/main.css"
import { sendReady } from "@totvs/tds-webtoolkit";
import ApplyPatchView from "./applyPatchView";

const root = createRoot(document.getElementById("root")!);
root.render(
  <React.StrictMode>
    <ApplyPatchView />
  </React.StrictMode>,
);

sendReady();
