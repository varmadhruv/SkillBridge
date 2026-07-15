import React from "react";
import ReactDOM from "react-dom/client";
import Validation from "./Validation";


const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Validation />
  </React.StrictMode>
);
