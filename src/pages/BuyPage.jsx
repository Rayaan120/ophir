import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Heart, MapPin, Bed, Bath, Maximize, ArrowRight, Search } from 'lucide-react';
import './BuyPage.css';

const BuyPage = () => {
    // States
    const [properties, setProperties] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [totalItems, setTotalItems] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const [favorites, setFavorites] = useState({});

    // Pagination & Filter States
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState('');
    const [searchInput, setSearchInput] = useState(''); // for local input
    const [propertyType, setPropertyType] = useState('All');
    const [bedrooms, setBedrooms] = useState('Any');
    const [priceRange, setPriceRange] = useState('Any');
    const [sortBy, setSortBy] = useState('Newest');

    const resultsRef = useRef(null);

    const fetchProperties = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const params = new URLSearchParams({
                type: 'sell',
                page: page,
                pageSize: 12
            });
            if (search) params.append('search', search);
            if (propertyType !== 'All') params.append('propertyType', propertyType);
            if (bedrooms !== 'Any') params.append('bedrooms', bedrooms);

            if (priceRange !== 'Any') {
                if (priceRange === '≤1M') params.append('priceMax', 1000000);
                else if (priceRange === '1M-3M') { params.append('priceMin', 1000000); params.append('priceMax', 3000000); }
                else if (priceRange === '3M-5M') { params.append('priceMin', 3000000); params.append('priceMax', 5000000); }
                else if (priceRange === '5M+') params.append('priceMin', 5000000);
            }

            if (sortBy === 'Price: Low to High') params.append('sort', 'price-asc');
            else if (sortBy === 'Price: High to Low') params.append('sort', 'price-desc');
            else params.append('sort', 'newest');

            const response = await fetch(`/api/properties?${params.toString()}`);
            if (!response.ok) throw new Error('Failed to fetch properties');

            const data = await response.json();
            setProperties(data.items || []);
            setTotalItems(data.total || 0);
            setTotalPages(data.totalPages || 1);
        } catch (err) {
            setError('Unable to load properties for sale right now.');
            setProperties([]);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchProperties();
    }, [page, search, propertyType, bedrooms, priceRange, sortBy]);

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        setPage(1);
        setSearch(searchInput);
    };

    const handleFilterChange = (setter) => (e) => {
        setter(e.target.value);
        setPage(1);
    };

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setPage(newPage);
            if (resultsRef.current) {
                // Adjust for navbar offset
                const y = resultsRef.current.getBoundingClientRect().top + window.scrollY - 100;
                window.scrollTo({ top: y, behavior: 'smooth' });
            }
        }
    };

    const toggleFavorite = (id) => {
        setFavorites({ ...favorites, [id]: !favorites[id] });
    };

    const formatPrice = (price, currency = 'AED') => {
        if (price === null || price === undefined) return 'Price on Request';
        const formattedPrice = new Intl.NumberFormat('en-AE').format(price);
        return `${currency} ${formattedPrice}`;
    };

    return (
        <div className="buy-page animate-fade-in">
            {/* Hero Section */}
            <section className="buy-hero">
                <div className="buy-hero-content">
                    <span className="hero-label">Ophir Sales</span>
                    <h1 className="hero-title">Invest in Prime Properties for Sale</h1>
                    <p className="hero-subtext">Discover curated, high-potential real estate investments across Dubai's most prestigious districts.</p>
                    <div className="hero-stats">
                        <span>Curated listings</span>
                        <span>Off-market opportunities</span>
                        <span>Strategic advisory</span>
                    </div>
                </div>
            </section>

            {/* Filter Bar */}
            <section className="buy-filters-container">
                <form className="filters-grid" onSubmit={handleSearchSubmit}>
                    <div className="filter-group search-group">
                        <label className="filter-label">Search</label>
                        <div className="filter-input-wrapper">
                            <Search size={18} className="search-icon" />
                            <input
                                type="text"
                                className="filter-input with-icon"
                                placeholder="Search by area, tower or keyword..."
                                value={searchInput}
                                onChange={(e) => setSearchInput(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="filter-group">
                        <label className="filter-label">Property Type</label>
                        <div className="select-wrapper">
                            <select className="filter-select" value={propertyType} onChange={handleFilterChange(setPropertyType)}>
                                <option>All</option>
                                <option>Apartment</option>
                                <option>Villa</option>
                                <option>Townhouse</option>
                                <option>Penthouse</option>
                                <option>Plot</option>
                            </select>
                        </div>
                    </div>

                    <div className="filter-group">
                        <label className="filter-label">Bedrooms</label>
                        <div className="select-wrapper">
                            <select className="filter-select" value={bedrooms} onChange={handleFilterChange(setBedrooms)}>
                                <option>Any</option>
                                <option>Studio</option>
                                <option>1</option>
                                <option>2</option>
                                <option>3</option>
                                <option>4+</option>
                            </select>
                        </div>
                    </div>

                    <div className="filter-group">
                        <label className="filter-label">Price Range (AED)</label>
                        <div className="select-wrapper">
                            <select className="filter-select" value={priceRange} onChange={handleFilterChange(setPriceRange)}>
                                <option>Any</option>
                                <option>≤1M</option>
                                <option>1M-3M</option>
                                <option>3M-5M</option>
                                <option>5M+</option>
                            </select>
                        </div>
                    </div>
                </form>
            </section>

            {/* Content / Results */}
            <section className="buy-content" ref={resultsRef}>
                <div className="results-header">
                    <div className="results-count">
                        Showing <span>{properties.length > 0 ? ((page - 1) * 12 + 1) : 0} - {Math.min(page * 12, totalItems)}</span> of <span>{totalItems}</span> Properties for Sale
                    </div>
                    <div className="sort-group">
                        <label className="filter-label">Sort By:</label>
                        <div className="select-wrapper">
                            <select className="filter-select" value={sortBy} onChange={handleFilterChange(setSortBy)}>
                                <option>Newest</option>
                                <option>Price: Low to High</option>
                                <option>Price: High to Low</option>
                            </select>
                        </div>
                    </div>
                </div>

                {isLoading ? (
                    <div className="loading-state">
                        <div className="loading-spinner"></div>
                        <p>Loading properties for sale...</p>
                    </div>
                ) : error ? (
                    <div className="empty-state">
                        <p>{error}</p>
                    </div>
                ) : properties.length === 0 ? (
                    <div className="empty-state">
                        <p>No properties found for your selection. Try adjusting your filters.</p>
                    </div>
                ) : (
                    <>
                        <div className="buy-grid">
                            {properties.map(property => {
                                const isFav = favorites[property.id] || property.isFavorited;
                                return (
                                    <div key={property.id} className="buy-card">
                                        {/* Image Section */}
                                        <div className="card-img-wrapper">
                                            <img src={property.mainImageUrl} alt={property.title} />
                                            <div className="card-overlay"></div>

                                            {/* Badges */}
                                            <div className="card-badges">
                                                <span className="badge-sale">For Sale</span>
                                                {property.labels && property.labels.length > 0 && (
                                                    <span className="badge-type">{property.labels[0]}</span>
                                                )}
                                            </div>

                                            {/* Heart */}
                                            <div
                                                className={`favorite-btn ${isFav ? 'active' : ''}`}
                                                style={{ position: 'absolute', top: '15px', right: '15px', zIndex: 3, cursor: 'pointer' }}
                                                onClick={() => toggleFavorite(property.id)}
                                            >
                                                <Heart size={18} fill={isFav ? "#d4af37" : "none"} color={isFav ? "#d4af37" : "#fff"} />
                                            </div>
                                        </div>

                                        {/* Body */}
                                        <div className="card-body">
                                            <div className="card-location">
                                                <MapPin size={14} />
                                                <span>{property.location}</span>
                                            </div>

                                            <h3 className="card-title">{property.title}</h3>

                                            <div className="card-price">
                                                <span className="card-currency">{property.currency}</span>
                                                {property.price ? new Intl.NumberFormat('en-AE').format(property.price) : 'Price on Request'}
                                            </div>

                                            {/* Features */}
                                            <div className="card-features">
                                                {property.bedrooms > 0 && (
                                                    <div className="feature-item">
                                                        <Bed size={16} />
                                                        <span>{property.bedrooms} Bed</span>
                                                    </div>
                                                )}
                                                {property.bathrooms > 0 && (
                                                    <div className="feature-item">
                                                        <Bath size={16} />
                                                        <span>{property.bathrooms} Bath</span>
                                                    </div>
                                                )}
                                                {property.areaSqft > 0 && (
                                                    <div className="feature-item">
                                                        <Maximize size={16} />
                                                        <span>{property.areaSqft} sq ft</span>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Footer */}
                                            <div className="card-footer">
                                                <div className="card-agent">
                                                    {property.agentAvatarUrl ? (
                                                        <div className="agent-pic" style={{ backgroundImage: `url(${property.agentAvatarUrl})` }}></div>
                                                    ) : (
                                                        <div className="agent-pic" style={{ backgroundColor: '#333' }}></div>
                                                    )}
                                                    <span className="agent-name">{property.agentName || 'Ophir Consultant'}</span>
                                                </div>
                                                <Link to={`/property/${property.id}`} className="card-btn">
                                                    View Details
                                                    <ArrowRight size={16} />
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="pagination">
                                <button
                                    className="page-btn page-nav-btn"
                                    onClick={() => handlePageChange(page - 1)}
                                    disabled={page === 1}
                                >
                                    Previous
                                </button>

                                {Array.from({ length: totalPages }, (_, i) => i + 1)
                                    .filter(p => Math.abs(p - page) <= 2 || p === 1 || p === totalPages)
                                    .map((p, i, arr) => (
                                        <React.Fragment key={p}>
                                            {i > 0 && arr[i - 1] !== p - 1 && <span style={{ color: "var(--text-muted, #888)" }}>...</span>}
                                            <button
                                                className={`page-btn ${page === p ? 'active' : ''}`}
                                                onClick={() => handlePageChange(p)}
                                            >
                                                {p}
                                            </button>
                                        </React.Fragment>
                                    ))}

                                <button
                                    className="page-btn page-nav-btn"
                                    onClick={() => handlePageChange(page + 1)}
                                    disabled={page === totalPages}
                                >
                                    Next
                                </button>
                            </div>
                        )}
                    </>
                )}
            </section>
        </div>
    );
};

export default BuyPage;
