import React from "react";
import { createRoot } from "react-dom/client";
import { sendReady, tdsVscode } from "@totvs/tds-webtoolkit";
import InspectObjectView from "./inspectObjectView";

tdsVscode.l10n.translations = window.translations;

const root = createRoot(document.getElementById("root")!);
root.render(
  <React.StrictMode>
    <InspectObjectView
      objectsInspector={window.initialData.objectsInspector}
      isServerP20OrGreater={window.initialData.isServerP20OrGreater} />
  </React.StrictMode>,
);

sendReady();