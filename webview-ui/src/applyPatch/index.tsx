import React from "react";
import { createRoot } from "react-dom/client";
import { sendReady, tdsVscode } from "@totvs/tds-webtoolkit";
import ApplyPatchView from "./applyPatchView";

tdsVscode.l10n.translations = window.translations;
console.log("Apply Patch View");
console.log(window.translations)

const root = createRoot(document.getElementById("root")!);
root.render(
  <React.StrictMode>
    <ApplyPatchView />
  </React.StrictMode>,
);

sendReady();
