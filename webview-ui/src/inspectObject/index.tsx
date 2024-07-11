import React from "react";
import { createRoot } from "react-dom/client";
import { sendReady, tdsVscode } from "@totvs/tds-webtoolkit";
import ObjectInspectorView from "./objectInspectorView";

tdsVscode.l10n.translations = window.translations;

const root = createRoot(document.getElementById("root")!);
root.render(
  <React.StrictMode>
    <ObjectInspectorView
      inspector={window.initialData.inspector}
      isServerP20OrGreater={window.initialData.isServerP20OrGreater} />
  </React.StrictMode>,
);

sendReady();