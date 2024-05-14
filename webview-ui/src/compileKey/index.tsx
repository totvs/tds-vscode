import React from "react";
import { createRoot } from "react-dom/client";
import CompileKeyView from "./compileKeyView";
import { sendReady, tdsVscode } from "@totvs/tds-webtoolkit";

tdsVscode.l10n.translations = window.translations;

const root = createRoot(document.getElementById("root")!);
root.render(
  <React.StrictMode>
    <CompileKeyView />
  </React.StrictMode>,
);

sendReady();
