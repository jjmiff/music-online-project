import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/api';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
    const [myVinyls, setMyVinyls] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();

    useEffect(() => {
        const fetchMyVinyls = async () => {
            try {
                // Currently API /vinyls returns all. A real app would filter by user or have /my-vinyls endpoint.
                // For prototype, I'll fetch request and filter client side or implement /my-vinyls.
                // Let's implement client side filter for simplicity as I can check seller_id
                const res = await api.get('/vinyls');
                const filtered = res.data.filter(v => v.seller_id === user.id);
                setMyVinyls(filtered);
            } catch (error) {
                console.error('Error fetching dashboard:', error);
            } finally {
                setLoading(false);
            }
        };
        if (user) {
            fetchMyVinyls();
        }
    }, [user]);

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this listing?')) {
            try {
                await api.delete(`/vinyls/${id}`);
                setMyVinyls(myVinyls.filter(v => v.id !== id));
            } catch {
                alert('Failed to delete');
            }
        }
    };

    return (
        <div className="dashboard-container">
            <div className="dashboard-header">
                <h2>My Listings</h2>
                <Link to="/add-vinyl" className="btn-primary">Add New Vinyl</Link>
            </div>
            
            {loading ? <p>Loading...</p> : (
                <div className="dashboard-table-wrapper">
                    <table className="dashboard-table">
                        <thead>
                            <tr>
                                <th>Title</th>
                                <th>Artist</th>
                                <th>Price</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {myVinyls.map(vinyl => (
                                <tr key={vinyl.id}>
                                    <td>{vinyl.title}</td>
                                    <td>{vinyl.artist}</td>
                                    <td>£{vinyl.price}</td>
                                    <td>
                                        <Link to={`/edit-vinyl/${vinyl.id}`} className="btn-small">Edit</Link>
                                        <button onClick={() => handleDelete(vinyl.id)} className="btn-small btn-danger">Delete</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {myVinyls.length === 0 && <p>No listings yet.</p>}
                </div>
            )}
        </div>
    );
};

export default Dashboard;
