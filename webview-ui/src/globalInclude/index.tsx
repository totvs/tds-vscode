import React from "react";
import { createRoot } from "react-dom/client";
import "../css/main.css"
import GlobalInclude from "./globalInclude";

const root = createRoot(document.getElementById("root")!);
root.render(
  <React.StrictMode>
    <GlobalInclude />
  </React.StrictMode>,
);
