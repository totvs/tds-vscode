import React from "react";
import PatchGenerateView from "./patchGenerateView";
import { createRoot } from "react-dom/client";
import "../css/main.css"
import { sendReady } from "@totvs/tds-webtoolkit";

const root = createRoot(document.getElementById("root")!);
root.render(
  <React.StrictMode>
    <PatchGenerateView />
  </React.StrictMode>,
);

sendReady();