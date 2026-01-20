import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api/api';

const AdminUserDetail = () => {
    const { id } = useParams();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDetails = async () => {
            try {
                const res = await api.get(`/admin/users/${id}/details`);
                setData(res.data);
            } catch (error) {
                console.error('Error fetching user details:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchDetails();
    }, [id]);

    if (loading) return <p className="container">Loading user profile...</p>;
    if (!data) return <p className="container">User not found.</p>;

    const { user, inventory, stats } = data;

    return (
        <div className="container fade-in">
            <Link to="/admin" className="btn-back">← Back to Admin Hub</Link>
            
            <div className="glass-card" style={{ marginTop: '1rem', padding: '2rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <h1 className="gradient-text">{user.username}</h1>
                    <span className={`status-badge ${user.status}`}>{user.status}</span>
                </div>
                <p><strong>Email:</strong> {user.email}</p>
                <p><strong>Role:</strong> {user.role}</p>
                <p><strong>Total Inventory Value:</strong> <span className="price-tag">£{stats.totalValue}</span></p>
            </div>

            <div className="stats-grid" style={{ marginTop: '2rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                <div className="glass-panel" style={{ textAlign: 'center', padding: '1.5rem' }}>
                    <h3>Total Items</h3>
                    <p className="price-tag">{stats.totalItems}</p>
                </div>
                <div className="glass-panel" style={{ textAlign: 'center', padding: '1.5rem' }}>
                    <h3>Approved</h3>
                    <p className="price-tag" style={{ color: '#10b981' }}>{stats.approvedItems}</p>
                </div>
                <div className="glass-panel" style={{ textAlign: 'center', padding: '1.5rem' }}>
                    <h3>Pending</h3>
                    <p className="price-tag" style={{ color: '#ec4899' }}>{stats.pendingItems}</p>
                </div>
            </div>

            <h2 style={{ marginTop: '3rem' }}>Inventory</h2>
            <div className="dashboard-table-wrapper">
                <table className="dashboard-table">
                    <thead>
                        <tr>
                            <th>Image</th>
                            <th>Title</th>
                            <th>Price</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {inventory.map(item => (
                            <tr key={item.id}>
                                <td>
                                    {item.image_url ? (
                                        <img 
                                            src={item.image_url.startsWith('http') ? item.image_url : `http://127.0.0.1:3000${item.image_url}`} 
                                            alt={item.title} 
                                            style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '4px' }}
                                        />
                                    ) : 'N/A'}
                                </td>
                                <td>
                                    <Link to={`/vinyl/${item.id}`} style={{ color: 'var(--text-color)', textDecoration: 'none' }}>
                                        {item.title}
                                    </Link>
                                </td>
                                <td>£{item.price}</td>
                                <td>
                                    <span className={`status-badge ${item.status}`}>{item.status}</span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {inventory.length === 0 && <p style={{ padding: '1rem' }}>No items listed.</p>}
            </div>
        </div>
    );
};

export default AdminUserDetail;
