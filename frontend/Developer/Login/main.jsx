import React from "react";
import ReactDOM from "react-dom/client";
import Login from "./Login";


const API_URL = import.meta.env.VITE_API_URL;
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Login />
  </React.StrictMode>
);
