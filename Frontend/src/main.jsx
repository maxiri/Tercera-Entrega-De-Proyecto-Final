
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { ToastProvider } from "./context/ToastContext";
import Toast from "./components/Toast";
import "./scss/main.scss";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ToastProvider>
      <App />
      <Toast /> {}
    </ToastProvider>
  </React.StrictMode>
);
