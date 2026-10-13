import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App"; // Note: No curly braces for default import
//import "./index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);