import React from "react";
import PatchGenerateView from "./patchGenerateView";
import { createRoot } from "react-dom/client";
import { sendReady, tdsVscode, ErrorBoundary } from "@totvs/tds-webtoolkit";
import PatchGenerateFromFolderView from "./patchGenerateFromFolderView";

tdsVscode.l10n.translations = window.translations;

const root = createRoot(document.getElementById("root")!);

if (window.initialData.fromRpo == "true") {
  root.render(
    <React.StrictMode>
      <PatchGenerateView isServerP20OrGreater={window.initialData.isServerP20OrGreater} />
    </React.StrictMode>
  )
} else {
  root.render(
    <React.StrictMode>
      <PatchGenerateFromFolderView isServerP20OrGreater={window.initialData.isServerP20OrGreater} />
    </React.StrictMode>
  )
}


sendReady();