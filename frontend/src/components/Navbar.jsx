import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext'; // Correct import placement

const Navbar = () => {
    const navigate = useNavigate();
    const { user, logout } = useAuth();
    const { cartCount } = useCart();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="navbar">
            <div className="container">
                <Link to="/" className="logo">Music Online</Link>
                <div className="nav-links">
                    <Link to="/" className="nav-link">Home</Link>
                    
                    {/* Shopping Bag Icon with Badge */}
                    <div style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', marginLeft: '1rem', marginRight: '1rem' }}>
                        <Link to="/cart" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--text-color)' }}>
                                <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
                                <line x1="3" y1="6" x2="21" y2="6"></line>
                                <path d="M16 10a4 4 0 0 1-8 0"></path>
                            </svg>
                        </Link>
                        {cartCount > 0 && (
                            <span style={{
                                position: 'absolute',
                                top: '-8px',
                                right: '-8px',
                                background: 'var(--primary)',
                                color: 'white',
                                borderRadius: '50%',
                                padding: '0.1rem 0.4rem',
                                fontSize: '0.7rem',
                                fontWeight: 'bold'
                            }}>
                                {cartCount}
                            </span>
                        )}
                    </div>

                    {user ? (
                        <>
                            {user.role === 'admin' && <Link to="/admin" className="nav-link">Admin</Link>}
                            <Link to="/dashboard" className="nav-link">Dashboard</Link>
                            <button onClick={handleLogout} className="btn-link">Logout</button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="nav-link">Login</Link>
                            <Link to="/register" className="btn-primary" style={{ marginLeft: '1rem', textDecoration: 'none' }}>Get Started</Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
