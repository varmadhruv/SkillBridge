import React from "react";
import ReactDOM from "react-dom/client";
import { Toaster } from "react-hot-toast";
import StudentLogin from "./StudentLogin";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Toaster position="bottom-left" />
    <StudentLogin />
  </React.StrictMode>
);

