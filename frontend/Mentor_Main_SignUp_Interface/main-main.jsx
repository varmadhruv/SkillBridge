import React from "react";
import ReactDOM from "react-dom/client";
import { Toaster } from "react-hot-toast";
import MainLogin from "./MainLogin";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Toaster position="bottom-left" />
    <MainLogin />
  </React.StrictMode>
);
