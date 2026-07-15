import React from "react";
import ReactDOM from "react-dom/client";
import Help from "./Help";


const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Help />
  </React.StrictMode>
);
