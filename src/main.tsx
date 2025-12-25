import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
// Note: Some AG Grid package versions do not export a separate quartz-dark CSS entry.
// We keep a single theme import and drive dark styling via CSS variables (see src/index.css).

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
