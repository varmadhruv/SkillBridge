import React from "react";
import ReactDOM from "react-dom/client";
import { Toaster } from "react-hot-toast";
import StudentLogin from "./StudentLogin";


const API_URL = import.meta.env.VITE_API_URL;
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Toaster position="bottom-left" />
    <StudentLogin />
  </React.StrictMode>
);

