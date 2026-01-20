import React, { createContext, useState, useContext, useEffect } from 'react';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
    // Initialize state from LocalStorage so data survives page refreshes
    // This is how we make the shopping bag "Persistent"
    const [cart, setCart] = useState(() => {
        try {
            const saved = localStorage.getItem('cart');
            return saved ? JSON.parse(saved) : [];
        } catch {
            return [];
        }
    });

    // Every time 'cart' changes, save it back to LocalStorage
    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cart));
    }, [cart]);

    const addToCart = (item) => {
        setCart(prev => {
            const existing = prev.find(i => i.id === item.id);
            if (existing) {
                // Determine logic for duplicates. For vinyls, maybe just Qty + 1
                return prev.map(i => i.id === item.id ? { ...i, qty: (i.qty || 1) + 1 } : i);
            }
            return [...prev, { ...item, qty: 1 }];
        });
        // Simple feedback (could be toast)
        window.alert(`Added "${item.title}" to your simulated bag!`);
    };

    const removeFromCart = (id) => {
        setCart(prev => prev.filter(item => item.id !== id));
    };

    const clearCart = () => setCart([]);

    const cartCount = cart.reduce((acc, item) => acc + (item.qty || 1), 0);

    return (
        <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart, cartCount }}>
            {children}
        </CartContext.Provider>
    );
};
