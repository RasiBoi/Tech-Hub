import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { ThemeProvider } from './context/ThemeContext';
import BrandLoader from './components/BrandLoader';
import Copilot from './components/Copilot';
import Home from './pages/Home';
import BecomeSeller from './pages/BecomeSeller';
import Category from './pages/Category';
import Product from './pages/Product';
import Cart from './pages/Cart';
import Login from './pages/Login';
import Vendors from './pages/Vendors';
import VendorStore from './pages/VendorStore';
import About from './pages/About';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminMultiAgent from './pages/admin/AdminMultiAgent';
import VendorPortal from './pages/vendor/VendorPortal';
import CustomerPortal from './pages/customer/CustomerPortal';
import DisputeSupport from './pages/DisputeSupport';
import { ProtectedRoute } from './routes/ProtectedRoute';
import ScrollToTop from './components/ScrollToTop';


export default function App() {
  const [booting, setBooting] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setBooting(false), 2800);
    return () => clearTimeout(t);
  }, []);

  return (
    <ThemeProvider>
      <AuthProvider>
        <CartProvider>
          <AnimatePresence>{booting && <BrandLoader key="boot" />}</AnimatePresence>
          <Router>
            <ScrollToTop />
          <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/become-seller" element={<BecomeSeller />} />
          <Route path="/login" element={<Login />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/vendors" element={<Vendors />} />
          <Route path="/vendors/:vendorId" element={<VendorStore />} />
          <Route path="/about" element={<About />} />
          <Route path="/category/:categoryName" element={<Category />} />
          <Route path="/product/:productId" element={<Product />} />
          <Route 
            path="/admin" 
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminDashboard />
              </ProtectedRoute>
            } 
          />
          <Route
            path="/admin/multi-agent"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminMultiAgent />
              </ProtectedRoute>
            }
          />
          <Route 
            path="/vendor" 
            element={
              <ProtectedRoute allowedRoles={['vendor']}>
                <VendorPortal />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/portal" 
            element={
              <ProtectedRoute allowedRoles={['customer', 'vendor', 'admin']}>
                <CustomerPortal />
              </ProtectedRoute>
            } 
          />
          <Route
            path="/support"
            element={
              <ProtectedRoute allowedRoles={['customer', 'vendor', 'admin']}>
                <DisputeSupport />
              </ProtectedRoute>
            }
          />
          </Routes>
          <Copilot />

        </Router>
      </CartProvider>
    </AuthProvider>
  </ThemeProvider>
  );
}
