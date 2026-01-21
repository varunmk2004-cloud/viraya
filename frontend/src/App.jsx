import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './components/Toast';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import ProductDetail from './pages/ProductDetail';
import CartPage from './pages/CartPage';
import Checkout from './pages/Checkout';
import Login from './pages/Login';
import Register from './pages/Register';
import RentalRequest from './pages/RentalRequest';
import AdminDashboard from './pages/AdminDashboard';
import AdminLogin from './pages/AdminLogin';
import ContactUs from './pages/ContactUs';
import AboutUs from './pages/AboutUs';
import MyOrders from './pages/MyOrders';
import PrivateRoute from './components/PrivateRoute';
import AdminRoute from './components/AdminRoute';
// Delivery feature removed for simplicity

export default function App() {
  const location = useLocation();
  const isAdminPage = location.pathname.startsWith('/admin') && location.pathname !== '/admin/login';
  return (
    <AuthProvider>
      <ToastProvider>
        <div className="min-vh-100 luxury-bg" style={{ position: 'relative', marginTop: 0, paddingTop: 0 }}>
          {!isAdminPage && <Navbar />}
          <main style={{ paddingTop: isAdminPage ? '0px' : '70px' }}>
            <div className="container" style={{ position: 'relative', paddingTop: '0.5rem', paddingBottom: '1rem' }}>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/product/:id" element={<ProductDetail />} />
                <Route path="/cart" element={<CartPage />} />
                <Route
                  path="/checkout"
                  element={
                    <PrivateRoute>
                      <Checkout />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/rental/:id"
                  element={
                    <PrivateRoute>
                      <RentalRequest />
                    </PrivateRoute>
                  }
                />
                <Route path="/login" element={<Login />} />
                <Route path="/admin/login" element={<AdminLogin />} />
                <Route path="/register" element={<Register />} />
                <Route path="/about" element={<AboutUs />} />
                <Route path="/contact" element={<ContactUs />} />
                <Route
                  path="/orders"
                  element={
                    <PrivateRoute>
                      <MyOrders />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/admin"
                  element={
                    <AdminRoute>
                      <AdminDashboard />
                    </AdminRoute>
                  }
                />
                {/* Delivery route removed */}
              </Routes>
            </div>
          </main>
        </div>
      </ToastProvider>
    </AuthProvider>
  );
}
