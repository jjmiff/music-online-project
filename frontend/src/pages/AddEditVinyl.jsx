import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../api/api';

const AddEditVinyl = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEdit = !!id;

    const [formData, setFormData] = useState({
        title: '',
        artist: '',
        type: 'album',
        description: '',
        price: '',
        release_date: '',
        image_url: ''
    });
    const [imageFile, setImageFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        if (isEdit) {
            const fetchVinyl = async () => {
                try {
                    const res = await api.get(`/vinyls/${id}`);
                    const v = res.data;
                    // Format date for input type=date
                    const date = v.release_date ? v.release_date.split('T')[0] : '';
                    setFormData({
                        title: v.title,
                        artist: v.artist,
                        type: v.type,
                        description: v.description || '',
                        price: v.price || '',
                        release_date: date,
                        image_url: v.image_url || ''
                    });
                    if (v.image_url) {
                         setPreviewUrl(v.image_url.startsWith('http') ? v.image_url : `http://localhost:3000${v.image_url}`);
                    }
                } catch (error) {
                    console.error("Failed to fetch vinyl details", error);
                    setError('Failed to fetch vinyl details');
                }
            };
            fetchVinyl();
        }
    }, [id, isEdit]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = new FormData();
        data.append('title', formData.title);
        data.append('artist', formData.artist);
        data.append('type', formData.type);
        data.append('description', formData.description);
        data.append('price', formData.price);
        data.append('release_date', formData.release_date);
        if (imageFile) {
            data.append('image', imageFile);
        } else if (formData.image_url) {
             data.append('image_url', formData.image_url);
        }

        try {
            if (isEdit) {
                await api.put(`/vinyls/${id}`, data, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
            } else {
                await api.post('/vinyls', data, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
            }
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.error || 'Operation failed');
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card" style={{ maxWidth: '800px', textAlign: 'left' }}>
                <h2 style={{ textAlign: 'center' }}>{isEdit ? 'Edit Vinyl' : 'Add New Vinyl'}</h2>
                {error && <p className="error">{error}</p>}
                <form onSubmit={handleSubmit} className="auth-form">
                    <div className="form-group">
                        <label>Title</label>
                        <input
                            type="text"
                            name="title"
                            placeholder="Enter album title"
                            value={formData.title}
                            onChange={handleChange}
                            required
                            className="auth-input"
                        />
                    </div>
                    
                    <div className="form-group">
                        <label>Artist</label>
                        <input
                            type="text"
                            name="artist"
                            placeholder="Enter artist name"
                            value={formData.artist}
                            onChange={handleChange}
                            required
                            className="auth-input"
                        />
                    </div>

                    <div className="form-group">
                        <label>Genre / Type</label>
                        <select name="type" value={formData.type} onChange={handleChange} className="input-select">
                            <option value="">Select Genre</option>
                            {genres.map(g => (
                                <option key={g.id} value={g.name}>{g.name}</option>
                            ))}
                            {/* Fallback for legacy types if not in DB */}
                            {!genres.find(g => g.name === 'album') && <option value="album">Album</option>}
                            {!genres.find(g => g.name === 'single') && <option value="single">Single</option>}
                        </select>
                    </div>

                    <div className="form-group">
                        <label>Description (Bio, Album Info)</label>
                        <textarea
                            name="description"
                            placeholder="Write a description..."
                            value={formData.description}
                            onChange={handleChange}
                            rows="5"
                            className="input-textarea"
                        />
                    </div>

                    <div className="form-group" style={{ display: 'flex', gap: '1rem' }}>
                        <div style={{ flex: 1 }}>
                            <label>Price (£)</label>
                            <input
                                type="number"
                                name="price"
                                placeholder="0.00"
                                value={formData.price}
                                onChange={handleChange}
                                step="0.01"
                                className="auth-input"
                            />
                        </div>
                        <div style={{ flex: 1 }}>
                            <label>Release Date</label>
                            <input
                                type="date"
                                name="release_date"
                                value={formData.release_date}
                                onChange={handleChange}
                                className="auth-input"
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Vinyl Cover Image</label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                            style={{ padding: '0.5rem 0' }}
                        />
                        {previewUrl && (
                            <div className="image-preview">
                                <img src={previewUrl} alt="Preview" style={{ maxWidth: '100%', maxHeight: '300px', objectFit: 'contain', borderRadius: '8px' }} />
                            </div>
                        )}
                    </div>

                    <button type="submit" className="auth-btn">{isEdit ? 'Update Vinyl' : 'Add Vinyl'}</button>
                </form>
            </div>
        </div>
    );
};

export default AddEditVinyl;
