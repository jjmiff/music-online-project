import React, { useEffect, useState } from 'react';
import api from '../api/api';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
    const [stats, setStats] = useState({ users: 0, vinyls: 0, pendingUsers: 0, pendingVinyls: 0 });
    const [allUsers, setAllUsers] = useState([]);
    const [activityLog, setActivityLog] = useState([]);
    const [analytics, setAnalytics] = useState([]);
    const [genres, setGenres] = useState([]);
    const [pendingUsers, setPendingUsers] = useState([]);
    const [pendingVinyls, setPendingVinyls] = useState([]);
    const [tab, setTab] = useState('overview'); // overview, users, vinyls, allUsers
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (!user || user.role !== 'admin') {
            navigate('/');
            return;
        }
        fetchData();
    }, [user, navigate]);

    const fetchData = async () => {
        try {
            setLoading(true);
            const usersRes = await api.get('/admin/users');
            const vinylsRes = await api.get('/admin/vinyls');
            // Fetch Activity silently (non-blocking if it fails)
            try {
                const activityRes = await api.get('/admin/activity');
                setActivityLog(activityRes.data);
            } catch (e) {
                console.warn('Failed to load activity log', e);
            }

            try {
                const analyticsRes = await api.get('/admin/analytics/search');
                setAnalytics(analyticsRes.data);
            } catch (e) {
                console.warn('Failed to load analytics', e);
            }

            try {
                const genresRes = await api.get('/genres');
                setGenres(genresRes.data);
            } catch (e) {
                console.warn('Failed to load genres', e);
            }
            
            const users = usersRes.data;
            const vinyls = vinylsRes.data;

            setAllUsers(users);
            setStats({
                users: users.length,
                vinyls: vinyls.length,
                pendingUsers: users.filter(u => u.status === 'pending').length,
                pendingVinyls: vinyls.filter(v => v.status === 'pending').length
            });

            setPendingUsers(users.filter(u => u.status === 'pending'));
            setPendingVinyls(vinyls.filter(v => v.status === 'pending'));
        } catch (error) {
            console.error('Error fetching admin data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleUserAction = async (id, action) => {
        try {
            await api.put(`/admin/users/${id}/${action}`);
            fetchData();
        } catch (error) {
            alert('Action failed');
        }
    };

    const handleVinylAction = async (id, action) => {
        try {
            await api.put(`/admin/vinyls/${id}/${action}`);
            fetchData();
        } catch (error) {
            alert('Action failed');
        }
    };

    return (
        <div className="dashboard-container">
            <div className="dashboard-header">
                <h2>Admin Hub</h2>
                <div style={{display: 'flex', gap: '1rem'}}>
                    <button className={`btn-small ${tab === 'overview' ? 'btn-primary' : 'btn-outline'}`} onClick={() => setTab('overview')}>Overview</button>
                    <button className={`btn-small ${tab === 'users' ? 'btn-primary' : 'btn-outline'}`} onClick={() => setTab('users')}>
                        Review Users {stats.pendingUsers > 0 && `(${stats.pendingUsers})`}
                    </button>
                    <button className={`btn-small ${tab === 'vinyls' ? 'btn-primary' : 'btn-outline'}`} onClick={() => setTab('vinyls')}>
                        Review Vinyls {stats.pendingVinyls > 0 && `(${stats.pendingVinyls})`}
                    </button>
                    <button className={`btn-small ${tab === 'allUsers' ? 'btn-primary' : 'btn-outline'}`} onClick={() => setTab('allUsers')}>
                        All Users
                    </button>
                    <button className={`btn-small ${tab === 'activity' ? 'btn-primary' : 'btn-outline'}`} onClick={() => setTab('activity')}>
                        Activity Log
                    </button>
                    <button className={`btn-small ${tab === 'analytics' ? 'btn-primary' : 'btn-outline'}`} onClick={() => setTab('analytics')}>
                        Analytics
                    </button>
                    <button className={`btn-small ${tab === 'settings' ? 'btn-primary' : 'btn-outline'}`} onClick={() => setTab('settings')}>
                        Settings
                    </button>
                </div>
            </div>
            
            {loading ? <p>Loading...</p> : (
                <>
                    {tab === 'overview' && (
                        <div className="filter-panel" style={{ width: '100%', maxWidth: '100%', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))' }}>
                            <div className="glass-panel" style={{ padding: '2rem', textAlign: 'center' }}>
                                <h3>Total Users</h3>
                                <p className="price-tag">{stats.users}</p>
                            </div>
                            <div className="glass-panel" style={{ padding: '2rem', textAlign: 'center' }}>
                                <h3>Pending Users</h3>
                                <p className="price-tag" style={{ color: stats.pendingUsers > 0 ? 'var(--secondary)' : 'var(--text-muted)' }}>{stats.pendingUsers}</p>
                            </div>
                            <div className="glass-panel" style={{ padding: '2rem', textAlign: 'center' }}>
                                <h3>Total Listings</h3>
                                <p className="price-tag">{stats.vinyls}</p>
                            </div>
                            <div className="glass-panel" style={{ padding: '2rem', textAlign: 'center' }}>
                                <h3>Pending Listings</h3>
                                <p className="price-tag" style={{ color: stats.pendingVinyls > 0 ? 'var(--secondary)' : 'var(--text-muted)' }}>{stats.pendingVinyls}</p>
                            </div>
                        </div>
                    )}

                    {tab === 'users' && (
                        <div className="dashboard-table-wrapper">
                            <h3 style={{ padding: '1rem' }}>Pending User Approvals</h3>
                            {pendingUsers.length === 0 ? <p style={{ padding: '1rem' }}>No pending users.</p> : (
                                <table className="dashboard-table">
                                    <thead>
                                        <tr>
                                            <th>Username</th>
                                            <th>Email</th>
                                            <th>Role</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {pendingUsers.map(u => (
                                            <tr key={u.id}>
                                                <td>{u.username}</td>
                                                <td>{u.email}</td>
                                                <td>{u.role}</td>
                                                <td>
                                                    <button onClick={() => handleUserAction(u.id, 'approve')} className="btn-small">Approve</button>
                                                    <button onClick={() => handleUserAction(u.id, 'reject')} className="btn-small btn-danger">Reject</button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                        </div>
                    )}
                    
                    {tab === 'vinyls' && (
                         <div className="dashboard-table-wrapper">
                            <h3 style={{ padding: '1rem' }}>Pending Vinyl Approvals</h3>
                            {pendingVinyls.length === 0 ? <p style={{ padding: '1rem' }}>No pending vinyls.</p> : (
                                <table className="dashboard-table">
                                    <thead>
                                        <tr>
                                            <th>Image</th>
                                            <th>Title</th>
                                            <th>Artist</th>
                                            <th>Seller</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {pendingVinyls.map(v => (
                                            <tr key={v.id}>
                                                <td>
                                                    {v.image_url ? (
                                                        <img src={v.image_url.startsWith('http') ? v.image_url : `http://127.0.0.1:3000${v.image_url}`} alt="cover" style={{width: '50px', height: '50px', borderRadius: '4px', objectFit: 'cover'}} />
                                                    ) : 'N/A'}
                                                </td>
                                                <td>{v.title}</td>
                                                <td>{v.artist}</td>
                                                <td>{v.seller_id}</td>
                                                <td>
                                                    <button onClick={() => handleVinylAction(v.id, 'approve')} className="btn-small">Approve</button>
                                                    <button onClick={() => handleVinylAction(v.id, 'reject')} className="btn-small btn-danger">Reject</button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                        </div>
                    )}

                    {tab === 'allUsers' && (
                        <div className="dashboard-table-wrapper">
                            <h3 style={{ padding: '1rem' }}>All Registered Users</h3>
                            <table className="dashboard-table">
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>Username</th>
                                        <th>Email</th>
                                        <th>Role</th>
                                        <th>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {allUsers.map(u => (
                                        <tr key={u.id}>
                                            <td>{u.id}</td>
                                            <td>
                                                <button 
                                                    onClick={() => navigate(`/admin/user/${u.id}`)}
                                                    className="btn-link"
                                                    style={{ background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer', textDecoration: 'underline' }}
                                                >
                                                    {u.username}
                                                </button>
                                            </td>
                                            <td>{u.email}</td>
                                            <td>{u.role}</td>
                                            <td>
                                                <span style={{
                                                    padding: '0.2rem 0.5rem',
                                                    borderRadius: '4px',
                                                    background: u.status === 'approved' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(236, 72, 153, 0.2)',
                                                    color: u.status === 'approved' ? '#10b981' : '#ec4899'
                                                }}>
                                                    {u.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}


                    {tab === 'activity' && (
                        <div className="dashboard-table-wrapper">
                            <h3 style={{ padding: '1rem' }}>Recent System Activity</h3>
                            <table className="dashboard-table">
                                <thead>
                                    <tr>
                                        <th>Time</th>
                                        <th>Event Type</th>
                                        <th>Details</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {activityLog.map((log, index) => (
                                        <tr key={index}>
                                            <td style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                                                {new Date(log.date).toLocaleString()}
                                            </td>
                                            <td>
                                                <span className={`status-badge ${
                                                    log.type === 'SALE' ? 'approved' : 
                                                    log.type === 'USER_JOINED' ? 'pending' : 'rejected' 
                                                }`}>
                                                    {log.type}
                                                </span>
                                            </td>
                                            <td>{log.message}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            {activityLog.length === 0 && <p style={{ padding: '1rem' }}>No recent activity.</p>}
                        </div>
                    )}

                    {tab === 'analytics' && (
                        <div className="dashboard-table-wrapper">
                             {/* ... existing analytics table ... */}
                             {analytics.length === 0 ? <p style={{ padding: '1rem' }}>No search data yet.</p> : (
                                <table className="dashboard-table">
                                    <thead>
                                        <tr>
                                            <th>Rank</th>
                                            <th>Search Term</th>
                                            <th>Total Searches</th>
                                            <th>Last Searched</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {analytics.map((item, index) => (
                                            <tr key={item.term}>
                                                <td>{index + 1}</td>
                                                <td style={{ fontWeight: 'bold', color: 'var(--primary)' }}>{item.term}</td>
                                                <td>{item.search_count}</td>
                                                <td>{new Date(item.last_searched_at).toLocaleDateString()}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                             )}
                        </div>
                    )}

                    {tab === 'settings' && (
                        <div className="dashboard-table-wrapper" style={{ padding: '2rem' }}>
                            <h3 style={{ marginBottom: '1rem' }}>Platform Configuration</h3>
                            
                            <div style={{ marginBottom: '2rem' }}>
                                <h4>Manage Genres</h4>
                                <p style={{ color: 'var(--text-muted)', marginBottom: '1rem' }}>Add or remove genres available in the "Add Vinyl" form.</p>
                                
                                <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
                                    <input 
                                        type="text" 
                                        placeholder="New Genre Name" 
                                        id="newGenreInput"
                                        className="auth-input"
                                        style={{ maxWidth: '300px' }}
                                    />
                                    <button 
                                        className="btn-primary"
                                        onClick={async () => {
                                            const input = document.getElementById('newGenreInput');
                                            if (!input.value) return;
                                            try {
                                                await api.post('/genres', { name: input.value });
                                                input.value = '';
                                                // Refresh genres logic would ideally be here, but we can just reload or fetch
                                                alert('Genre added!');
                                                fetchData(); // Re-fetch data 
                                            } catch (e) {
                                                alert('Failed to add genre');
                                            }
                                        }}
                                    >
                                        Add Genre
                                    </button>
                                </div>

                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                                    {genres.map(g => (
                                        <span key={g.id} style={{ 
                                            background: 'rgba(255, 255, 255, 0.05)', 
                                            padding: '0.5rem 1rem', 
                                            borderRadius: '20px', 
                                            display: 'flex', 
                                            alignItems: 'center', 
                                            gap: '0.5rem',
                                            border: '1px solid var(--border-light)'
                                        }}>
                                            {g.name}
                                            <button 
                                                onClick={async () => {
                                                    if(window.confirm(`Delete genre "${g.name}"?`)) {
                                                        try {
                                                            await api.delete(`/genres/${g.id}`);
                                                            fetchData();
                                                        } catch(e) { alert('Failed to delete'); }
                                                    }
                                                }}
                                                style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: '1.2rem', lineHeight: 1 }}
                                            >
                                                ×
                                            </button>
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default AdminDashboard;
