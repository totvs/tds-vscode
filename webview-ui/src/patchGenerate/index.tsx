import React from "react";
import PatchGenerateView from "./patchGenerateView";
import { createRoot } from "react-dom/client";
import { sendReady, tdsVscode, ErrorBoundary } from "@totvs/tds-webtoolkit";

tdsVscode.l10n.translations = window.translations;

const root = createRoot(document.getElementById("root")!);
root.render(
  <React.StrictMode>
    <ErrorBoundary>
      <PatchGenerateView />
    </ErrorBoundary>
  </React.StrictMode>,
);

sendReady();