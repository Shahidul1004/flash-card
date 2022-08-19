import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { render } from "react-dom";
const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById("root")
);
