import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api/api';
import { useCart } from '../context/CartContext'; // Correct import placement

const VinylDetails = () => {
    const { id } = useParams();
    const [vinyl, setVinyl] = useState(null);
    const [loading, setLoading] = useState(true);
    const { addToCart } = useCart();

    useEffect(() => {
        const fetchVinyl = async () => {
            try {
                const res = await api.get(`/vinyls/${id}`);
                setVinyl(res.data);
            } catch (error) {
                console.error('Error fetching details:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchVinyl();
    }, [id]);

    const getImageUrl = (url) => {
        if (!url) return null;
        if (url.startsWith('http')) return url;
        return `http://127.0.0.1:3000${url}`;
    };

    if (loading) return <p className="container">Loading...</p>;
    if (!vinyl) return <p className="container">Vinyl not found.</p>;

    const imageUrl = getImageUrl(vinyl.image_url);

    return (
        <div className="vinyl-details-container">
            <div className="details-card fade-in">
                <div className="details-image">
                    {imageUrl ? (
                        <img src={imageUrl} alt={vinyl.title} />
                    ) : (
                        <div className="placeholder-large">No Vinyl Image</div>
                    )}
                </div>
                <div className="details-info">
                    <div>
                        <h1 className="details-title gradient-text">{vinyl.title}</h1>
                        <h2 className="artist-name">by {vinyl.artist}</h2>
                        
                        <div className="badges-row">
                            <span className="type-badge">{vinyl.type.toUpperCase()}</span>
                            <span className="type-badge">YEAR: {new Date(vinyl.release_date).getFullYear()}</span>
                            <span className="price-tag">£{vinyl.price}</span>
                        </div>
                    </div>

                    <div className="details-section">
                        <h3>About the Album</h3>
                        <p className="description-text">{vinyl.description || "No description provided."}</p>
                    </div>

                    <div className="details-section">
                        <div className="meta-grid">
                            <div className="meta-item">
                                <span className="meta-label">Released</span>
                                <span className="meta-value">{new Date(vinyl.release_date).toLocaleDateString('en-GB')}</span>
                            </div>
                            <div className="meta-item">
                                <span className="meta-label">Seller</span>
                                <span className="meta-value">{vinyl.seller_name}</span>
                            </div>
                        </div>
                    </div>

                    <div className="action-buttons">
                        <Link to="/" className="btn-back">← Back to Search</Link>
                        <button className="btn-primary" onClick={() => addToCart(vinyl)}>Add to Bag</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VinylDetails;
