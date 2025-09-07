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
import Footer from "./components/Footer";
import Toast from "./components/Toast";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const App = () => {
  return (
    <ProductProvider>
      <CartProvider>
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
            <ToastContainer
              position="top-right"
              autoClose={3000}
              hideProgressBar
            />
          </div>
        </Router>
      </CartProvider>
    </ProductProvider>
  );
};

export default App;
