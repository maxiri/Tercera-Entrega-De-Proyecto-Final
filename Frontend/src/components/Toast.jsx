
import React from "react";
import { useToast } from "../context/ToastContext";

const Toast = () => {
  const { toast } = useToast();

  if (!toast.message) return null;

  return (
    <div
      style={{
        position: "fixed",
        bottom: "20px",
        right: "20px",
        background:
          toast.type === "success"
            ? "green"
            : toast.type === "error"
            ? "red"
            : "#333",
        color: "#fff",
        padding: "10px 20px",
        borderRadius: "5px",
        zIndex: 9999,
        boxShadow: "0 2px 6px rgba(0,0,0,0.3)",
        transition: "opacity 0.3s ease",
      }}
    >
      {toast.message}
    </div>
  );
};

export default Toast;
