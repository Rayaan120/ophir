import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Heart, MapPin, Bed, Bath, Maximize, ArrowRight, Search } from 'lucide-react';
import './RentPage.css';

const RentPage = () => {
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

    const fetchRentals = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const params = new URLSearchParams({
                type: 'rent',
                page: page,
                pageSize: 12
            });
            if (search) params.append('search', search);
            if (propertyType !== 'All') params.append('propertyType', propertyType);
            if (bedrooms !== 'Any') params.append('bedrooms', bedrooms);

            if (priceRange !== 'Any') {
                if (priceRange === '≤100k') params.append('priceMax', 100000);
                else if (priceRange === '100k-200k') { params.append('priceMin', 100000); params.append('priceMax', 200000); }
                else if (priceRange === '200k-400k') { params.append('priceMin', 200000); params.append('priceMax', 400000); }
                else if (priceRange === '400k+') params.append('priceMin', 400000);
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
            setError('Unable to load rental properties right now.');
            setProperties([]);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchRentals();
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
                // Adjust for navbar offset if needed
                const y = resultsRef.current.getBoundingClientRect().top + window.scrollY - 100;
                window.scrollTo({ top: y, behavior: 'smooth' });
            }
        }
    };

    const toggleFavorite = (id) => {
        setFavorites({ ...favorites, [id]: !favorites[id] });
    };

    const formatPrice = (price, currency = 'AED', period = null) => {
        const formattedPrice = new Intl.NumberFormat('en-AE').format(price);
        return `${currency} ${formattedPrice}${period ? period : ''}`;
    };

    return (
        <div className="rent-page animate-fade-in">
            {/* Hero Section */}
            <section className="rent-hero">
                <div className="rent-hero-content">
                    <span className="hero-label">Ophir Rentals</span>
                    <h1 className="hero-title">Explore Luxury Homes for Rent</h1>
                    <p className="hero-subtext">Discover curated rental properties across Dubai's most prestigious communities, tailored to your elite lifestyle.</p>
                </div>
            </section>

            {/* Filter Bar */}
            <section className="rent-filters-container">
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
                        <label className="filter-label">Price Range</label>
                        <div className="select-wrapper">
                            <select className="filter-select" value={priceRange} onChange={handleFilterChange(setPriceRange)}>
                                <option>Any</option>
                                <option>≤100k</option>
                                <option>100k-200k</option>
                                <option>200k-400k</option>
                                <option>400k+</option>
                            </select>
                        </div>
                    </div>
                </form>
            </section>

            {/* Content / Results */}
            <section className="rent-content" ref={resultsRef}>
                <div className="results-header">
                    <div className="results-count">
                        Showing <span>{properties.length > 0 ? ((page - 1) * 12 + 1) : 0} - {Math.min(page * 12, totalItems)}</span> of <span>{totalItems}</span> Rental Properties
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
                        <p>Loading luxury rentals...</p>
                    </div>
                ) : error ? (
                    <div className="empty-state">
                        <p>{error}</p>
                    </div>
                ) : properties.length === 0 ? (
                    <div className="empty-state">
                        <p>No rental properties found for your selection. Try adjusting your filters.</p>
                    </div>
                ) : (
                    <>
                        <div className="rent-grid">
                            {properties.map(property => {
                                const isFav = favorites[property.id] || property.isFavorited;
                                return (
                                    <div key={property.id} className="property-card">
                                        {/* Image Section */}
                                        <div className="property-image-wrapper">
                                            <div className="property-image" style={{ backgroundImage: `url(${property.mainImageUrl})` }}></div>
                                            <div className="property-image-overlay"></div>

                                            {/* Badges */}
                                            <div className="property-badges">
                                                <span className="badge-primary">Rent</span>
                                                {property.labels && property.labels.length > 0 && (
                                                    <span className="badge-secondary">{property.labels[0]}</span>
                                                )}
                                            </div>

                                            {/* Heart */}
                                            <div
                                                className={`favorite-btn ${isFav ? 'active' : ''}`}
                                                onClick={() => toggleFavorite(property.id)}
                                            >
                                                <Heart size={18} fill={isFav ? "#d4af37" : "none"} color={isFav ? "#d4af37" : "#fff"} />
                                            </div>

                                            {/* Location */}
                                            <div className="property-location-tag">
                                                <MapPin size={14} className="location-icon" />
                                                <span>{property.location}</span>
                                            </div>
                                        </div>

                                        {/* Body */}
                                        <div className="property-body">
                                            <h3 className="property-title">{property.title}</h3>
                                            <div className="property-price">
                                                {formatPrice(property.price, property.currency, property.pricePeriod)}
                                            </div>
                                            <p className="property-desc">{property.description}</p>

                                            {/* Features */}
                                            <div className="property-features">
                                                {property.bedrooms > 0 && (
                                                    <div className="feature-pill">
                                                        <Bed size={16} className="feature-icon" />
                                                        <span>{property.bedrooms} Bed</span>
                                                    </div>
                                                )}
                                                {property.bathrooms > 0 && (
                                                    <div className="feature-pill">
                                                        <Bath size={16} className="feature-icon" />
                                                        <span>{property.bathrooms} Bath</span>
                                                    </div>
                                                )}
                                                {property.areaSqft > 0 && (
                                                    <div className="feature-pill">
                                                        <Maximize size={16} className="feature-icon" />
                                                        <span>{property.areaSqft} sq ft</span>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Footer */}
                                            <div className="property-footer">
                                                <div className="agent-info">
                                                    {property.agentAvatarUrl && (
                                                        <div className="agent-avatar" style={{ backgroundImage: `url(${property.agentAvatarUrl})` }}></div>
                                                    )}
                                                    <span className="agent-name">{property.agentName}</span>
                                                </div>
                                                <Link to={`/property/${property.id}`} className="view-details-btn">
                                                    View Details
                                                    <ArrowRight size={16} className="arrow-icon" />
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
                                            {i > 0 && arr[i - 1] !== p - 1 && <span style={{ color: "var(--text-muted)" }}>...</span>}
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

export default RentPage;
