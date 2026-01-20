import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const Cart = () => {
    const { cart, removeFromCart, clearCart } = useCart();
    const navigate = useNavigate();

    const total = cart.reduce((sum, item) => sum + Number(item.price), 0).toFixed(2);

    const handleCheckout = () => {
        if (cart.length === 0) return;
        if (window.confirm(`Simulate checkout for £${total}?`)) {
            clearCart();
            alert('Checkout successful! (Simulation)');
            navigate('/');
        }
    };

    return (
        <div className="container fade-in">
            <h1 className="gradient-text" style={{ marginTop: '2rem' }}>Your Shopping Bag</h1>
            
            {cart.length === 0 ? (
                <div style={{ textAlign: 'center', margin: '4rem 0' }}>
                    <p style={{ fontSize: '1.2rem', color: 'var(--text-muted)' }}>Your bag is empty.</p>
                    <Link to="/" className="btn-primary" style={{ marginTop: '1rem', display: 'inline-block', textDecoration: 'none' }}>Start Digging</Link>
                </div>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '2rem', marginTop: '2rem' }}>
                    <div className="cart-items">
                        {cart.map((item, index) => (
                            <div key={`${item.id}-${index}`} className="glass-panel" style={{ display: 'flex', gap: '1rem', padding: '1rem', marginBottom: '1rem', alignItems: 'center' }}>
                                <img 
                                    src={item.image_url && !item.image_url.startsWith('http') ? `http://127.0.0.1:3000${item.image_url}` : item.image_url} 
                                    alt={item.title}
                                    style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '4px' }}
                                />
                                <div style={{ flex: 1 }}>
                                    <h3>{item.title}</h3>
                                    <p style={{ color: 'var(--text-muted)' }}>{item.artist}</p>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <p className="price-tag">£{item.price}</p>
                                    <button 
                                        onClick={() => removeFromCart(item.id)} 
                                        className="btn-link" 
                                        style={{ color: '#ef4444', fontSize: '0.9rem', marginTop: '0.5rem' }}
                                    >
                                        Remove
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="cart-summary glass-card" style={{ height: 'fit-content', padding: '2rem' }}>
                        <h3>Summary</h3>
                        <div style={{ display: 'flex', justifyContent: 'space-between', margin: '1rem 0' }}>
                            <span>Subtotal</span>
                            <span>£{total}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', margin: '1rem 0' }}>
                            <span>Shipping</span>
                            <span>Free</span>
                        </div>
                        <hr style={{ borderColor: 'var(--border-color)', margin: '1rem 0' }} />
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '2rem' }}>
                            <span>Total</span>
                            <span>£{total}</span>
                        </div>
                        <button onClick={handleCheckout} className="btn-primary" style={{ width: '100%' }}>Checkout</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Cart;
