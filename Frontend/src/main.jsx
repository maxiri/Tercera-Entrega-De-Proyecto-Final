// src/main.jsx
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { ToastProvider } from "./context/ToastContext"; // 👈 Importar ToastProvider
import Toast from "./components/Toast"; // 👈 Importar Toast global
import "./scss/main.scss";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ToastProvider>
      <App />
      <Toast /> {/* 👈 Ahora el Toast vive directamente dentro del provider */}
    </ToastProvider>
  </React.StrictMode>
);
