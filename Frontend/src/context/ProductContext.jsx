import React, { createContext, useState, useEffect, useRef } from 'react';

export const ProductContext = createContext();
export const useProductContext = () => React.useContext(ProductContext); // <-- ✅ Añadido

export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState(() => {
    const storedCart = localStorage.getItem('cart');
    return storedCart ? JSON.parse(storedCart) : [];
  });
  const [toastMessage, setToastMessage] = useState('');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const toastTimeoutRef = useRef(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch('https://686ee02191e85fac429f37e2.mockapi.io/Productos');
        const data = await res.json();
        setProducts(data);
      } catch (error) {
        console.error('Error al obtener productos', error);
      }
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product) => {
    let message = '';

    setCart((prevCart) => {
      const existing = prevCart.find((item) => item.id === product.id);

      if (existing) {
        if (existing.quantity + 1 > product.stock) {
          message = `No hay suficiente stock de ${product.nombre}`;
          return prevCart;
        }
        message = `${product.nombre} agregado al carrito`;
        return prevCart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        if (product.stock < 1) {
          message = `No hay stock disponible de ${product.nombre}`;
          return prevCart;
        }
        message = `${product.nombre} agregado al carrito`;
        return [...prevCart, { ...product, quantity: 1 }];
      }
    });

    if (toastTimeoutRef.current) {
      clearTimeout(toastTimeoutRef.current);
    }

    setToastMessage(message);

    toastTimeoutRef.current = setTimeout(() => {
      setToastMessage('');
      toastTimeoutRef.current = null;
    }, 2000);
  };

  const deleteProduct = async (id) => {
    try {
      const res = await fetch(`https://686ee02191e85fac429f37e2.mockapi.io/Productos/${id}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Error al eliminar producto');
      setProducts((prev) => prev.filter((p) => p.id !== id));
    } catch (error) {
      console.error(error);
    }
  };

  const updateProduct = (updatedProduct) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === updatedProduct.id ? updatedProduct : p))
    );
  };

  const toggleCart = () => {
    setIsCartOpen(!isCartOpen);
  };

  const finalizePurchase = () => {
    setCart([]);
    setToastMessage('¡Gracias por tu compra!');
    setIsCartOpen(false);
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
        isCartOpen,
        toggleCart,
        toastMessage,
        setToastMessage,
        finalizePurchase,
        searchTerm,
        setSearchTerm,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};
