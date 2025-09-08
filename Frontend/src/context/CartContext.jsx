// src/context/CartContext.jsx
import React, { createContext, useState, useEffect, useRef, useContext } from "react";
import * as api from "../services/api";

export const CartContext = createContext();
export const useCartContext = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    try {
      const stored = localStorage.getItem("cart");
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState("info"); // success | error | info
  const toastTimeoutRef = useRef(null);

  // Guardar carrito en localStorage
  useEffect(() => {
    try {
      localStorage.setItem("cart", JSON.stringify(cart));
    } catch {}
  }, [cart]);

  const showToast = (message, type = "info") => {
    if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
    setToastMessage(message);
    setToastType(type);
    toastTimeoutRef.current = setTimeout(() => {
      setToastMessage("");
      setToastType("info");
      toastTimeoutRef.current = null;
    }, 3000);
  };

  const addToCart = (product) => {
    if (!product) return;

    setCart((prev) => {
      const existing = prev.find((it) => it.id === product.id);
      if (existing) {
        if (existing.quantity + 1 > (product.stock ?? 999999)) {
          showToast(`⚠️ No hay suficiente stock de ${product.nombre}`, "error");
          return prev;
        }
        showToast(`✅ ${product.nombre} agregado al carrito 🛒`, "success");
        return prev.map((it) =>
          it.id === product.id ? { ...it, quantity: it.quantity + 1 } : it
        );
      } else {
        if ((product.stock ?? 1) < 1) {
          showToast(`⚠️ No hay stock disponible de ${product.nombre}`, "error");
          return prev;
        }
        showToast(`✅ ${product.nombre} agregado al carrito 🛒`, "success");
        return [...prev, { ...product, quantity: 1 }];
      }
    });
  };

  const removeFromCart = (id) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
    showToast("🗑️ Producto eliminado del carrito", "info");
  };

  const updateQuantity = (id, quantity) => {
    setCart((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, quantity: Math.max(1, quantity) } : item
      )
    );
  };

  const toggleCart = () => setIsCartOpen((v) => !v);

  const finalizePurchase = async (customer = {}) => {
    try {
      const items = cart.map((it) => ({
        productId: it.id,
        nombre: it.nombre,
        precio: it.precio,
        quantity: it.quantity,
      }));
      const res = await api.sendCart(items, customer);
      setCart([]);
      showToast("🎉 ¡Compra finalizada con éxito!", "success");
      console.log("Carrito guardado:", res);
    } catch (err) {
      console.error("Error al enviar carrito:", err);
      showToast("❌ Error al finalizar compra", "error");
      throw err;
    }
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        setCart,
        addToCart,
        removeFromCart,
        updateQuantity,
        isCartOpen,
        toggleCart,
        toastMessage,
        setToastMessage,
        toastType,
        finalizePurchase,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
