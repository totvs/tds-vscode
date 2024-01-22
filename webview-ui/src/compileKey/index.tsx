import React from "react";
import { createRoot } from "react-dom/client";
import "../css/main.css"
import CompileKeyView from "./compileKeyView";

const root = createRoot(document.getElementById("root")!);
root.render(
  <React.StrictMode>
    <CompileKeyView />
  </React.StrictMode>,
);
