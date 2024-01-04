import React from "react";
import AddServer from "./AddServer";
import { createRoot } from "react-dom/client";
import "../css/main.css"

const root = createRoot(document.getElementById("root")!);
root.render(
  <React.StrictMode>
    <AddServer />
  </React.StrictMode>,
);
