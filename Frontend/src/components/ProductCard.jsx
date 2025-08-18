import React, { useContext } from 'react';
import { ProductContext } from '../context/ProductContext';

const ProductCard = ({ product }) => {
  const { addToCart } = useContext(ProductContext);

  return (
    <div style={styles.card}>
      <img src={product.foto} alt={product.nombre} style={styles.img} />
      <h3>{product.nombre}</h3>
      <p>Precio: ${product.precio}</p>
      <button onClick={() => addToCart(product)}>Agregar al carrito 🛒</button>
    </div>
  );
  
};


const styles = {
  card: {
    border: '1px solid #ccc',
    padding: '16px',
    width: '200px',
    margin: '8px',
    textAlign: 'center'
  },
  img: {
    width: '100%',
    height: '150px',
    objectFit: 'cover'
  }
  
};

export default ProductCard;
