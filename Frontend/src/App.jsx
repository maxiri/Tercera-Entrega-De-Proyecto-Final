// src/App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Alta from "./pages/Alta";
import Contacto from "./pages/Contacto";
import Header from "./components/Header";
import CartModal from "./components/CartModal";
import { ProductProvider } from "./context/ProductContext";
import { CartProvider } from "./context/CartContext";
import { ToastProvider } from "./context/ToastContext";
import Footer from "./components/Footer";
import Toast from "./components/Toast";

const App = () => {
  return (
    <ProductProvider>
      <CartProvider>
        <ToastProvider>
          <Router>
            <div className="app-container">
              <Header />
              <CartModal />
              <main className="main-content">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/alta" element={<Alta />} />
                  <Route path="/contacto" element={<Contacto />} />
                </Routes>
              </main>
              <Footer />
              <Toast />
            </div>
          </Router>
        </ToastProvider>
      </CartProvider>
    </ProductProvider>
  );
};

export default App;
