import React from "react";
import ReactDOM from "react-dom/client";
import ContactUs from "./Contact_us";


const API_URL = import.meta.env.VITE_API_URL;
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ContactUs />
  </React.StrictMode>
);
