import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Alta from './pages/Alta';
import Contacto from './pages/Contacto';
import Header from './components/Header';
import CartModal from './components/CartModal';
import { ProductProvider } from './context/ProductContext';
import Footer from './components/Footer';
import Toast from './components/Toast'; // <-- Importa el Toast personalizado
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const App = () => {
  return (
    <ProductProvider>
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
          <Toast /> {/* Aquí lo agregas */}
          <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
        </div>
      </Router>
    </ProductProvider>
  );
};

export default App;
