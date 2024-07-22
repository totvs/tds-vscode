import React from "react";
import { createRoot } from "react-dom/client";
import { sendReady, tdsVscode } from "@totvs/tds-webtoolkit";
import ReplayTimelineView from "./replayTimelineView";

tdsVscode.l10n.translations = window.translations;

const root = createRoot(document.getElementById("root")!);
root.render(
  <React.StrictMode>
    <ReplayTimelineView />
  </React.StrictMode>,
);

sendReady();
