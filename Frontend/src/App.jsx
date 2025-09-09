// src/App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ProductProvider } from "./context/ProductContext";
import { CartProvider } from "./context/CartContext";
import { ToastProvider } from "./context/ToastContext";

import Home from "./pages/Home";
import Alta from "./pages/Alta";
import Contacto from "./pages/Contacto";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Toast from "./components/Toast";
import CartModal from "./components/CartModal"; 

const App = () => {
  return (
    <Router>
      <ToastProvider>
        <ProductProvider>
          <CartProvider>
            <Header />
            <CartModal /> {}
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/alta" element={<Alta />} />
              <Route path="/contacto" element={<Contacto />} />
            </Routes>
            <Footer />
            <Toast />
          </CartProvider>
        </ProductProvider>
      </ToastProvider>
    </Router>
  );
};

export default App;
