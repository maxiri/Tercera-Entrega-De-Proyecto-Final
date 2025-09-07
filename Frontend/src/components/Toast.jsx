import React, { useContext, useEffect, useState } from 'react';
import { ProductContext } from '../context/ProductContext';

const Toast = () => {
  const { toastMessage, setToastMessage } = useContext(ProductContext);
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (toastMessage) {
      setShow(true);
      const timer = setTimeout(() => {
        setShow(false);
        setTimeout(() => setToastMessage(''), 300); // limpiar mensaje tras animación
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [toastMessage, setToastMessage]);

  if (!toastMessage && !show) return null;

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        background: '#333',
        color: '#fff',
        padding: '10px 20px',
        borderRadius: '5px',
        zIndex: 9999,
        opacity: show ? 1 : 0,
        visibility: show ? 'visible' : 'hidden',
        transition: 'opacity 0.3s ease',
        pointerEvents: show ? 'auto' : 'none',
      }}
    >
      {toastMessage}
    </div>
  );
};

export default Toast;
