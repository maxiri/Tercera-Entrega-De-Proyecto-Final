import React, { useContext, useState, useMemo } from 'react';
import { ProductContext } from '../context/ProductContext';
import ProductModal from '../components/ProductModal';
import '../scss/pages/_home.scss';

const Home = () => {
  const { products, addToCart } = useContext(ProductContext);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [sortOption, setSortOption] = useState('');
  const [searchText, setSearchText] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');

  // Obtener categorías únicas
  const categories = useMemo(() => {
    const cats = products.map((p) => p.categoria).filter(Boolean);
    return [...new Set(cats)].sort();
  }, [products]);

  // Filtrar por texto y categoría con protección ante valores undefined
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchCategory = categoryFilter === '' || product.categoria === categoryFilter;
      // Protección para evitar error si product.nombre es undefined
      const matchText = product.nombre?.toLowerCase().includes(searchText.toLowerCase());
      return matchCategory && matchText;
    });
  }, [products, categoryFilter, searchText]);

  // Ordenar filtrados
  const sortedProducts = useMemo(() => {
    let sorted = [...filteredProducts];
    switch (sortOption) {
      case 'price-asc':
        sorted.sort((a, b) => a.precio - b.precio);
        break;
      case 'price-desc':
        sorted.sort((a, b) => b.precio - a.precio);
        break;
      case 'name-asc':
        sorted.sort((a, b) => a.nombre.localeCompare(b.nombre));
        break;
      case 'name-desc':
        sorted.sort((a, b) => b.nombre.localeCompare(a.nombre));
        break;
      case 'stock-asc':
        sorted.sort((a, b) => a.stock - b.stock);
        break;
      case 'stock-desc':
        sorted.sort((a, b) => b.stock - a.stock);
        break;
      default:
        break;
    }
    return sorted;
  }, [filteredProducts, sortOption]);

  const handleCardClick = (product) => setSelectedProduct(product);

  const handleAddToCartAndClose = () => {
    addToCart(selectedProduct);
    setSelectedProduct(null);
  };

  return (
    <div className="home-container">
      <div className="toolbar">
        <h1 className="page-title">Lista de Productos</h1>

        <div className="filters">
          <input
            type="text"
            placeholder="Buscar por nombre..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="input-search"
            title="Buscar productos por nombre"
          />

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="select-category"
            title="Filtrar por categoría"
          >
            <option value="">Todas las categorías</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>

          <select
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
            className="select-sort"
            title="Ordenar productos"
          >
            <option value="">Ordenar por</option>
            <option value="price-asc">Precio: menor a mayor</option>
            <option value="price-desc">Precio: mayor a menor</option>
            <option value="name-asc">Nombre: A-Z</option>
            <option value="name-desc">Nombre: Z-A</option>
            <option value="stock-asc">Stock: menor a mayor</option>
            <option value="stock-desc">Stock: mayor a menor</option>
          </select>
        </div>
      </div>

      <div className="product-grid">
        {sortedProducts.length === 0 ? (
          <p>No se encontraron productos que coincidan.</p>
        ) : (
          sortedProducts.map((product) => (
            <div
              key={product.id}
              className="product-card"
              onClick={() => handleCardClick(product)}
              title={`Ver detalles de ${product.nombre}`}
            >
              <img
                src={product.foto || 'https://placehold.co/150x150?text=Sin+imagen'}
                alt={product.nombre}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'https://placehold.co/150x150?text=Sin+imagen';
                }}
              />
              <h3>{product.nombre}</h3>
              <p>{product.descripcionCorta}</p>
              <p><strong>${product.precio}</strong></p>
              <p>Stock: {product.stock}</p>
            </div>
          ))
        )}
      </div>

      {selectedProduct && (
        <ProductModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onAddToCart={handleAddToCartAndClose}
        />
      )}
    </div>
  );
};

export default Home;
