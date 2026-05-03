import React from "react";
import ReactDOM from "react-dom/client";
import { Toaster } from "react-hot-toast";
import Consent from "./Consent";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Toaster position="bottom-left" />
    <Consent />
  </React.StrictMode>
);

