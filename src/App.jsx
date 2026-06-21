import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import Home from './pages/Home';
import BecomeSeller from './pages/BecomeSeller';
import Category from './pages/Category';
import Product from './pages/Product';
import Login from './pages/Login';
import Vendors from './pages/Vendors';
import VendorStore from './pages/VendorStore';
import AdminDashboard from './pages/admin/AdminDashboard';
import VendorPortal from './pages/vendor/VendorPortal';
import { ProtectedRoute } from './routes/ProtectedRoute';


export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/become-seller" element={<BecomeSeller />} />
          <Route path="/login" element={<Login />} />
          <Route path="/vendors" element={<Vendors />} />
          <Route path="/vendors/:vendorId" element={<VendorStore />} />
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
            path="/vendor" 
            element={
              <ProtectedRoute allowedRoles={['vendor']}>
                <VendorPortal />
              </ProtectedRoute>
            } 
          />
        </Routes>

      </Router>
    </AuthProvider>
  </ThemeProvider>
  );
}
