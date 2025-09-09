
import React from "react";
import { useCartContext } from "../context/CartContext"; 
import "../scss/base/components/_ProductModal.scss";

const ProductModal = ({ product, onClose }) => {
  const { addToCart } = useCartContext();

  if (!product) return null;

  return (
    <div
      className="product-modal-overlay"
      onClick={(e) => {
        if (e.target.className === "product-modal-overlay" && onClose) onClose();
      }}
    >
      <div className="product-modal-content" role="dialog" aria-modal="true">
        <button className="modal-close" onClick={onClose} aria-label="Cerrar">
          ✖️
        </button>

        <img
          src={product.foto || "https://placehold.co/400x250?text=Sin+imagen"}
          alt={product.nombre}
          className="modal-image"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = "https://placehold.co/400x250?text=Sin+imagen";
          }}
        />

        <h2 className="modal-title">{product.nombre}</h2>
        <p className="modal-description">
          {product.descripcionLarga || product.descripcionCorta || ""}
        </p>

        <p className="modal-price">
          <strong>Precio: ${product.precio}</strong>
        </p>

        <button
          className="modal-add-to-cart"
          onClick={() => addToCart(product)}
        >
          Agregar al carrito 🛒
        </button>
      </div>
    </div>
  );
};

export default ProductModal;
