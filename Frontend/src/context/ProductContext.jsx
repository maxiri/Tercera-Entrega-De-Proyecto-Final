// src/context/ProductContext.jsx
import React, { createContext, useEffect, useRef, useState } from "react";
import * as api from "../services/api";

export const ProductContext = createContext();
export const useProductContext = () => React.useContext(ProductContext);

export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState(() => {
    try {
      const stored = localStorage.getItem("cart");
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });
  const [toastMessage, setToastMessage] = useState("");
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const toastTimeoutRef = useRef(null);

  // Cargar productos desde backend
  const loadProducts = async () => {
    try {
      const data = await api.fetchProducts();
      // mapear _id => id para homogeneizar el frontend
      const normalized = data.map((p) => ({
        ...p,
        id: p._id || p.id,
      }));
      setProducts(normalized);
    } catch (err) {
      console.error("Error al obtener productos:", err);
      setProducts([]);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  // Persistencia carrito
  useEffect(() => {
    try {
      localStorage.setItem("cart", JSON.stringify(cart));
    } catch {}
  }, [cart]);

  const addToCart = (product) => {
    if (!product) return;
    let message = "";

    setCart((prev) => {
      const existing = prev.find((it) => it.id === product.id);
      if (existing) {
        if (existing.quantity + 1 > (product.stock ?? 999999)) {
          message = `No hay suficiente stock de ${product.nombre}`;
          return prev;
        }
        message = `${product.nombre} agregado al carrito`;
        return prev.map((it) => (it.id === product.id ? { ...it, quantity: it.quantity + 1 } : it));
      } else {
        if ((product.stock ?? 1) < 1) {
          message = `No hay stock disponible de ${product.nombre}`;
          return prev;
        }
        message = `${product.nombre} agregado al carrito`;
        return [...prev, { ...product, quantity: 1 }];
      }
    });

    if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
    setToastMessage(message);
    toastTimeoutRef.current = setTimeout(() => {
      setToastMessage("");
      toastTimeoutRef.current = null;
    }, 2000);
  };

  const deleteProduct = async (id) => {
    try {
      await api.deleteProduct(id);
      setProducts((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      console.error("Error al eliminar producto:", err);
      throw err;
    }
  };

  const updateProduct = async (id, updatedProduct) => {
    try {
      const updated = await api.updateProduct(id, updatedProduct);
      // normalized _id -> id
      const normalized = { ...updated, id: updated._id || updated.id };
      setProducts((prev) => prev.map((p) => (p.id === id ? normalized : p)));
      return normalized;
    } catch (err) {
      console.error("Error al actualizar producto:", err);
      throw err;
    }
  };

  const createProduct = async (productData) => {
    try {
      const saved = await api.createProduct(productData);
      const normalized = { ...saved, id: saved._id || saved.id };
      setProducts((prev) => [...prev, normalized]);
      return normalized;
    } catch (err) {
      console.error("Error al crear producto:", err);
      throw err;
    }
  };

  const toggleCart = () => setIsCartOpen((v) => !v);

  const finalizePurchase = async (customer = {}) => {
    // esperar a enviar carrito al backend (ruta /api/cart)
    try {
      const items = cart.map((it) => ({
        productId: it.id, // cart model expects ObjectId referencing products
        nombre: it.nombre,
        precio: it.precio,
        quantity: it.quantity,
      }));
      const res = await api.sendCart(items, customer);
      setCart([]);
      setToastMessage("Compra registrada. Gracias!");
      console.log("Carrito guardado:", res);
    } catch (err) {
      console.error("Error al enviar carrito:", err);
      setToastMessage("Error al finalizar compra");
      throw err;
    }
  };

  return (
    <ProductContext.Provider
      value={{
        products,
        setProducts,
        cart,
        setCart,
        addToCart,
        deleteProduct,
        updateProduct,
        createProduct,
        isCartOpen,
        toggleCart,
        toastMessage,
        setToastMessage,
        finalizePurchase,
        searchTerm,
        setSearchTerm,
        reloadProducts: loadProducts,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};
