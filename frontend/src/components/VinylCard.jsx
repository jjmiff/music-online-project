import React from 'react';
import { Link } from 'react-router-dom';

const VinylCard = ({ vinyl }) => {
    const getImageUrl = (url) => {
        if (!url) return null;
        if (url.startsWith('http')) return url;
        // Optimization: Use thumbnail if available
        let finalUrl = `http://127.0.0.1:3000${url}`;
        if (finalUrl.endsWith('-large.webp')) {
            finalUrl = finalUrl.replace('-large.webp', '-thumb.webp');
        }
        return finalUrl;
    };

    const imageUrl = getImageUrl(vinyl.image_url);

    return (
        <div className="vinyl-card glass-card">
            {imageUrl ? (
                <img src={imageUrl} alt={vinyl.title} className="vinyl-image" />
            ) : (
                <div className="vinyl-placeholder">No Image</div>
            )}
            <div className="vinyl-info">
                <h3>{vinyl.title}</h3>
                <p className="artist">{vinyl.artist}</p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <p className="price">£{vinyl.price}</p>
                    <Link to={`/vinyl/${vinyl.id}`} className="btn-outline" style={{ fontSize: '0.8rem', padding: '0.4rem 1rem' }}>View</Link>
                </div>
            </div>
        </div>
    );
};

export default VinylCard;
