import React from "react";
import ReactDOM from "react-dom/client";
import AboutUs from "./About_us";


const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AboutUs />
  </React.StrictMode>
);
