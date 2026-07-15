import React from "react";
import ReactDOM from "react-dom/client";
import NewAdmin from "./NewAdmin";


const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <NewAdmin />
  </React.StrictMode>
);
