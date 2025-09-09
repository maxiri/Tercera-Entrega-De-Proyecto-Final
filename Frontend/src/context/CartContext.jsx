
import React, { createContext, useState, useEffect, useRef, useContext } from "react";
import * as api from "../services/api";
import { useToast } from "./ToastContext";

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
  const { showToast } = useToast();
  const toastTimeoutRef = useRef(null);

  
  useEffect(() => {
    try {
      localStorage.setItem("cart", JSON.stringify(cart));
    } catch {}
  }, [cart]);

  const addToCart = (product) => {
    if (!product) return;

    let message = "";
    let type = "info";

    setCart((prev) => {
      const existing = prev.find((it) => it.id === product.id);

      if (existing) {
        if (existing.quantity + 1 > (product.stock ?? 999999)) {
          message = `⚠️ No hay suficiente stock de ${product.nombre}`;
          type = "error";
          return prev;
        }
        message = `✅ ${product.nombre} agregado al carrito 🛒`;
        type = "success";
        return prev.map((it) =>
          it.id === product.id ? { ...it, quantity: it.quantity + 1 } : it
        );
      } else {
        if ((product.stock ?? 1) < 1) {
          message = `⚠️ No hay stock disponible de ${product.nombre}`;
          type = "error";
          return prev;
        }
        message = `✅ ${product.nombre} agregado al carrito 🛒`;
        type = "success";
        return [...prev, { ...product, quantity: 1 }];
      }
    });

    if (message) {
      setTimeout(() => {
        showToast(message, type);
      }, 0);
    }
  };

  const removeFromCart = (id) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
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
        finalizePurchase,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
