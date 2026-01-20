import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminDashboard from './pages/AdminDashboard';
import AdminUserDetail from './pages/AdminUserDetail';
import Dashboard from './pages/Dashboard';
import AddEditVinyl from './pages/AddEditVinyl';
import VinylDetails from './pages/VinylDetails';
import Cart from './pages/Cart';
import Footer from './components/Footer';

function App() {
  return (
    <Router>
      <AuthProvider>
        <CartProvider>
          <div className="app-container">
            <Navbar />
            <main className="main-content">
              {/* React Router switches the page component based on the URL */}
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="/admin/user/:id" element={<AdminUserDetail />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/add-vinyl" element={<AddEditVinyl />} />
                <Route path="/edit-vinyl/:id" element={<AddEditVinyl />} />
                <Route path="/vinyl/:id" element={<VinylDetails />} />
                <Route path="/cart" element={<Cart />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </CartProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
