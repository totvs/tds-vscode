import React from "react";
import AddServer from "./AddServer";
import { createRoot } from "react-dom/client";

const root = createRoot(document.getElementById("root")!);
root.render(
  <React.StrictMode>
    <AddServer />
  </React.StrictMode>,
);
