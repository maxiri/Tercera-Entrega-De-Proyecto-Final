
const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5000";

export const fetchProducts = async () => {
  const res = await fetch(`${API_BASE}/api/products`);
  if (!res.ok) throw new Error("Error al obtener productos");
  return await res.json();
};

export const createProduct = async (product) => {
  const res = await fetch(`${API_BASE}/api/products`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(product),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: "Error al crear producto" }));
    throw new Error(err.message || "Error al crear producto");
  }
  return await res.json();
};

export const updateProduct = async (id, data) => {
  const res = await fetch(`${API_BASE}/api/products/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: "Error al actualizar producto" }));
    throw new Error(err.message || "Error al actualizar producto");
  }
  return await res.json();
};

export const deleteProduct = async (id) => {
  const res = await fetch(`${API_BASE}/api/products/${id}`, { method: "DELETE" });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: "Error al eliminar producto" }));
    throw new Error(err.message || "Error al eliminar producto");
  }
  return { success: true };
};

export const sendCart = async (items, customer = {}) => {
  const res = await fetch(`${API_BASE}/api/cart`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ items, customer }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: "Error al enviar carrito" }));
    throw new Error(err.message || "Error al enviar carrito");
  }
  return await res.json();
};
