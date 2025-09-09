
import React from "react";
import { useCartContext } from "../context/CartContext"; 
import "../scss/base/components/_card.scss";

const ProductCard = ({ product }) => {
  const { addToCart } = useCartContext();

  return (
    <div className="card">
      <img
        src={product.foto || "https://placehold.co/150x150?text=Sin+imagen"}
        alt={product.nombre}
        onError={(e) => {
          e.target.onerror = null;
          e.target.src = "https://placehold.co/150x150?text=Sin+imagen";
        }}
      />
      <h3>{product.nombre}</h3>
      <p>Precio: ${product.precio}</p>
      <button onClick={() => addToCart(product)}>Agregar al carrito 🛒</button>
    </div>
  );
};

export default ProductCard;
