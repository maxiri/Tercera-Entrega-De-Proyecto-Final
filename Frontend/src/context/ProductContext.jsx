
import React, { createContext, useState, useEffect } from "react";
import * as api from "../services/api";

export const ProductContext = createContext();
export const useProductContext = () => React.useContext(ProductContext);

export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  // Cargar productos desde backend
  const loadProducts = async () => {
    try {
      const data = await api.fetchProducts();
      // Normalizar _id -> id
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

  return (
    <ProductContext.Provider
      value={{
        products,
        setProducts,
        searchTerm,
        setSearchTerm,
        reloadProducts: loadProducts,
        deleteProduct,
        updateProduct,
        createProduct,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};
