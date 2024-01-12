import React from "react";
import PatchGenerateView from "./patchGenerateView";
import { createRoot } from "react-dom/client";
import "../css/main.css"

const root = createRoot(document.getElementById("root")!);
root.render(
  <React.StrictMode>
    <PatchGenerateView />
  </React.StrictMode>,
);
