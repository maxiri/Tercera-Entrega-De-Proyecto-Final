// src/components/Toast.jsx
import React, { useEffect, useState } from "react";
import { useCartContext } from "../context/CartContext";
import "../scss/base/components/_toast.scss";

const Toast = () => {
  const { toastMessage, setToastMessage, toastType } = useCartContext();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (toastMessage) {
      setVisible(true);
      const timer = setTimeout(() => {
        setVisible(false);
        setTimeout(() => setToastMessage(""), 300);
      }, 2800);

      return () => clearTimeout(timer);
    }
  }, [toastMessage, setToastMessage]);

  if (!toastMessage && !visible) return null;

  return (
    <div className={`toast ${toastType} ${visible ? "show" : "hide"}`}>
      {toastMessage}
    </div>
  );
};

export default Toast;
