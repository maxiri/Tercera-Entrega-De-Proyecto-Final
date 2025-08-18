import React, { useContext, useEffect } from 'react';
import { ProductContext } from '../context/ProductContext';
import '../scss/base/components/_cartmodal.scss';

const CartModal = () => {
  const { cart, setCart, isCartOpen, toggleCart, finalizePurchase, setToastMessage } = useContext(ProductContext);

  // Guardar carrito en localStorage cada vez que cambia
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  // Cerrar modal con tecla ESC
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape' && isCartOpen) toggleCart();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [toggleCart, isCartOpen]);

  const sumQuantity = (id) => {
    setCart((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          if (item.quantity + 1 > item.stock) {
            setToastMessage(`No hay suficiente stock de ${item.nombre}`);
            return item;
          }
          return { ...item, quantity: item.quantity + 1 };
        }
        return item;
      })
    );
  };

  const subtractQuantity = (id) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.id === id) {
            if (item.quantity === 1) return null; // eliminar si queda 0
            return { ...item, quantity: item.quantity - 1 };
          }
          return item;
        })
        .filter(Boolean)
    );
  };

  const updateQuantity = (id, newQty) => {
    const qty = parseInt(newQty);
    if (isNaN(qty) || qty < 1) return;
    setCart((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          if (qty > item.stock) {
            setToastMessage(`No hay suficiente stock de ${item.nombre}`);
            return item;
          }
          return { ...item, quantity: qty };
        }
        return item;
      })
    );
  };

  const removeFromCart = (id) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const clearCart = () => {
    setCart([]);
  };

  const closeModalOutside = (e) => {
    if (e.target.className === 'modal-overlay') {
      toggleCart();
    }
  };

  const totalPrice = cart.reduce((acc, item) => acc + item.precio * item.quantity, 0);

  if (!isCartOpen) return null;

  return (
    <div className="modal-overlay" onClick={closeModalOutside}>
      <div className="cart-modal">
        <button type="button" className="close-btn" onClick={toggleCart} title="Cerrar carrito">Cerrar ✖️</button>
        <h2>Carrito</h2>
        {cart.length === 0 ? (
          <p>El carrito está vacío.</p>
        ) : (
          <>
            {cart.map((item) => (
              <div key={item.id} className="cart-item">
                <img src={item.foto} alt={item.nombre} />
                <div>
                  <h4>{item.nombre}</h4>
                  <p>Precio: ${item.precio}</p>
                  <p>Subtotal: ${item.precio * item.quantity}</p>
                  <div className="quantity-controls">
                    <button type="button" onClick={() => subtractQuantity(item.id)} title="Restar una unidad">-</button>
                    <input
                      type="number"
                      min="1"
                      max={item.stock}
                      value={item.quantity}
                      onChange={(e) => updateQuantity(item.id, e.target.value)}
                      title="Cantidad"
                    />
                    <button type="button" onClick={() => sumQuantity(item.id)} title="Sumar una unidad">+</button>
                  </div>
                  <button type="button" className="delete-btn" onClick={() => removeFromCart(item.id)} title="Eliminar producto">Eliminar ❌</button>
                </div>
              </div>
            ))}
            <hr />
            <h3>Total: ${totalPrice}</h3>
            <button type="button" className="clear-btn" onClick={clearCart} title="Vaciar todo el carrito">Vaciar carrito</button>
            <button type="button" className="buy-btn" onClick={finalizePurchase} title="Finalizar y confirmar compra">Finalizar compra 🛒</button>
          </>
        )}
      </div>
    </div>
  );
};

export default CartModal;
