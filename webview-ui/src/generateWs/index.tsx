import React from "react";
import { createRoot } from "react-dom/client";
import "../css/main.css"
import GenerateWsView from "./generateWsView";

const root = createRoot(document.getElementById("root")!);
root.render(
  <React.StrictMode>
    <GenerateWsView />
  </React.StrictMode>,
);
