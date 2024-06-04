import React from "react";
import { createRoot } from "react-dom/client";
import { sendReady, tdsVscode, ErrorBoundary } from "@totvs/tds-webtoolkit";
import PatchGenerateByDifferenceView from "./patchGenerateByDifferenceView";

tdsVscode.l10n.translations = window.translations;

const root = createRoot(document.getElementById("root")!);
//isServerP20OrGreater={window.initialData.isServerP20OrGreater} />
root.render(
  <React.StrictMode>
    <PatchGenerateByDifferenceView />

  </React.StrictMode>,
);

sendReady();