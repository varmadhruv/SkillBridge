import React from "react";
import ReactDOM from "react-dom/client";
import { Toaster } from "react-hot-toast";
import App from "./App.jsx";


const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
    <Toaster position="bottom-left" />
  </React.StrictMode>
);
