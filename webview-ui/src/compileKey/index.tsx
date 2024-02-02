import React from "react";
import { createRoot } from "react-dom/client";
import "../css/main.css"
import CompileKeyView from "./compileKeyView";
import { sendReady } from "../utilities/common-command-webview";

const root = createRoot(document.getElementById("root")!);
root.render(
  <React.StrictMode>
    <CompileKeyView />
  </React.StrictMode>,
);

sendReady();
