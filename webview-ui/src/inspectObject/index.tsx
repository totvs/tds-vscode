import React from "react";
import { createRoot } from "react-dom/client";
import { sendReady, tdsVscode } from "@totvs/tds-webtoolkit";
import InspectObjectView from "./inspectObjectView";

tdsVscode.l10n.translations = window.translations;

console.log("***********************", window.initialData);

const root = createRoot(document.getElementById("root")!);
root.render(
  <React.StrictMode>
    <InspectObjectView
      inspector={window.initialData.inspector}
      isServerP20OrGreater={window.initialData.isServerP20OrGreater} />
  </React.StrictMode>,
);

sendReady();