import React, { useState, useEffect } from 'react';
import api from '../api/api';
import VinylCard from '../components/VinylCard';

const Home = () => {
    const [vinyls, setVinyls] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filters, setFilters] = useState({
        minPrice: '',
        maxPrice: '',
        minYear: '',
        maxYear: '',
        sort: 'created_desc'
    });
    const [showFilters, setShowFilters] = useState(false);
    const [loading, setLoading] = useState(true);

    const fetchVinyls = async (query = '', currentFilters = filters) => {
        try {
            setLoading(true);
            const params = new URLSearchParams();
            if (query) params.append('q', query);
            if (currentFilters.minPrice) params.append('minPrice', currentFilters.minPrice);
            if (currentFilters.maxPrice) params.append('maxPrice', currentFilters.maxPrice);
            if (currentFilters.minYear) params.append('minYear', currentFilters.minYear);
            if (currentFilters.maxYear) params.append('maxYear', currentFilters.maxYear);
            if (currentFilters.sort) params.append('sort', currentFilters.sort);

            const res = await api.get(`/vinyls?${params.toString()}`);
            setVinyls(res.data);
        } catch (error) {
            console.error('Error fetching vinyls:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchVinyls(searchTerm, filters);
    }, []);

    const handleSearch = (e) => {
        e.preventDefault();
        fetchVinyls(searchTerm, filters);
    };

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({ ...prev, [name]: value }));
    };

    const applyFilters = () => {
        fetchVinyls(searchTerm, filters);
    };

    return (
        <div className="home-card fade-in">
            <section className="hero">
                <h1>Discover <span className="gradient-text">Rare Vinyls</span></h1>
                <p>The ultimate marketplace for music enthusiasts. Buy, sell, and explore the best records from around the world.</p>
                
                <div className="search-section">
                    <form onSubmit={handleSearch} className="search-form">
                        <input 
                            type="text" 
                            placeholder="Search by artist or album..." 
                            className="main-search glass-panel"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <button type="submit" className="btn-primary search-btn">Search</button>
                    </form>
                    <button 
                        className="btn-secondary btn-filter" 
                        onClick={() => setShowFilters(!showFilters)}
                    >
                        {showFilters ? 'Hide Filters' : 'Show Filters'}
                    </button>

                    {showFilters && (
                        <div className="filter-panel glass-panel slide-down">
                            <div className="filter-group">
                                <label>Price Range</label>
                                <div className="range-inputs">
                                    <input type="number" name="minPrice" placeholder="Min £" value={filters.minPrice} onChange={handleFilterChange} />
                                    <span>-</span>
                                    <input type="number" name="maxPrice" placeholder="Max £" value={filters.maxPrice} onChange={handleFilterChange} />
                                </div>
                            </div>
                            <div className="filter-group">
                                <label>Release Year</label>
                                <div className="range-inputs">
                                    <input type="number" name="minYear" placeholder="Start Year" value={filters.minYear} onChange={handleFilterChange} />
                                    <span>-</span>
                                    <input type="number" name="maxYear" placeholder="End Year" value={filters.maxYear} onChange={handleFilterChange} />
                                </div>
                            </div>
                            <div className="filter-group">
                                <label>Sort By</label>
                                <select name="sort" value={filters.sort} onChange={handleFilterChange}>
                                    <option value="created_desc">Newest First</option>
                                    <option value="price_asc">Price: Low to High</option>
                                    <option value="price_desc">Price: High to Low</option>
                                    <option value="year_desc">Year: Newest</option>
                                    <option value="year_asc">Year: Oldest</option>
                                </select>
                            </div>
                            <button onClick={applyFilters} className="btn-primary" style={{ width: '100%', marginTop: '10px' }}>Apply Filters</button>
                        </div>
                    )}
                </div>
            </section>
            
            <h2 style={{ marginBottom: '2rem', fontSize: '2rem', textAlign: 'center' }}>
                {searchTerm || (filters.minPrice || filters.maxPrice || filters.minYear || filters.maxYear) ? 'Search Results' : 'Recent Listings'}
            </h2>
            
            {loading ? (
                <p style={{textAlign: 'center', color: 'var(--text-muted)'}}>Loading gems...</p>
            ) : (
                <div className="vinyl-grid">
                    {vinyls.length > 0 ? (
                        vinyls.map((vinyl, index) => (
                            <div key={vinyl.id} style={{ animationDelay: `${index * 0.1}s` }} className="slide-up">
                                <VinylCard vinyl={vinyl} />
                            </div>
                        ))
                    ) : (
                        <p style={{textAlign: 'center', width: '100%'}}>No vinyls found.</p>
                    )}
                </div>
            )}
            {/* Advertisement Placeholder (Assignment Requirement) */}
            <div className="ad-placeholder-section" style={{ marginTop: '3rem', textAlign: 'center', opacity: 0.7 }}>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Sponsored Content</p>
                <div style={{ 
                    background: 'rgba(255, 255, 255, 0.05)', 
                    border: '1px dashed var(--border-color)', 
                    borderRadius: '8px', 
                    padding: '2rem',
                    maxWidth: '800px',
                    margin: '0 auto',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexDirection: 'column'
                }}>
                    <h3 style={{ color: 'var(--primary)' }}>Your Ad Here</h3>
                    <p>Reach thousands of vinyl enthusiasts.</p>
                </div>
            </div>
        </div>
    );
};

export default Home;
