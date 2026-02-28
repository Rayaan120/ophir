import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Heart, MapPin, Calendar, Building2, ArrowRight, Search, Pickaxe, Bed } from 'lucide-react';
import './NewProjectsPage.css';

const NewProjectsPage = () => {
    // States
    const [properties, setProperties] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [totalItems, setTotalItems] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const [favorites, setFavorites] = useState({});

    // Extracted Dropdown Options
    const [availableDevelopers, setAvailableDevelopers] = useState([]);
    const [availableLocations, setAvailableLocations] = useState([]);

    // Pagination & Filter States
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState('');
    const [searchInput, setSearchInput] = useState('');
    const [developerFilter, setDeveloperFilter] = useState('All Developers');
    const [locationFilter, setLocationFilter] = useState('All Locations');
    const [statusFilter, setStatusFilter] = useState('All Status');
    const [sortBy, setSortBy] = useState('Newest Launches');

    const resultsRef = useRef(null);

    const fetchProperties = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const params = new URLSearchParams({
                type: 'new',
                page: page,
                pageSize: 12
            });

            // Note: The backend currently doesn't natively support dynamic developer/location/status filtering via query string natively in Pixxi,
            // so we pass what we can or rely on a global fetch + client-side filter if needed. 
            // For now, assuming backend handles standard 'search' correctly.
            if (search) params.append('search', search);

            if (sortBy === 'Price: Low to High') params.append('sort', 'price-asc');
            else if (sortBy === 'Price: High to Low') params.append('sort', 'price-desc');
            else params.append('sort', 'newest'); // Maps to "Newest Launches" / "Handover: Soonest First" roughly

            const response = await fetch(`/api/properties?${params.toString()}`);
            if (!response.ok) throw new Error('Failed to fetch new projects');

            const data = await response.json();

            // Client-Side Filtration for fields not natively queryable via standard Pixxi endpoint
            let filteredItems = data.items || [];

            // Extract unique developers and locations for the dropdowns (from the current fetched batch)
            // Ideally, the backend would provide a master list, but building from current data works.
            const devs = new Set(filteredItems.map(p => p.developerName).filter(Boolean));
            const locs = new Set(filteredItems.map(p => p.location?.split(',')[0].trim()).filter(Boolean));

            setAvailableDevelopers([...Array.from(devs)].sort());
            setAvailableLocations([...Array.from(locs)].sort());

            // Apply strict client-side filters on the returned batch if selected
            if (developerFilter !== 'All Developers') {
                filteredItems = filteredItems.filter(p => p.developerName === developerFilter);
            }
            if (locationFilter !== 'All Locations') {
                filteredItems = filteredItems.filter(p => p.location?.includes(locationFilter));
            }
            if (statusFilter !== 'All Status') {
                const searchStatus = statusFilter === 'Under Construction' ? 'ACTIVE' :
                    statusFilter === 'Launched' ? 'ACTIVE' : statusFilter;
                // Currently Pixxi sets all valid as 'ACTIVE', so manual map may be identical. 
                // But we filter based on exact string if Pixxi provides varied statuses.
                if (statusFilter !== 'Launched' && statusFilter !== 'Under Construction') {
                    filteredItems = filteredItems.filter(p => p.status === searchStatus);
                }
            }

            setProperties(filteredItems);
            setTotalItems(data.total || 0); // Note: total might visually drift slightly due to client side filtering
            setTotalPages(data.totalPages || 1);

        } catch (err) {
            setError('Unable to load new projects right now.');
            setProperties([]);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchProperties();
    }, [page, search, sortBy, developerFilter, locationFilter, statusFilter]);

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
                const y = resultsRef.current.getBoundingClientRect().top + window.scrollY - 100;
                window.scrollTo({ top: y, behavior: 'smooth' });
            }
        }
    };

    const toggleFavorite = (id) => {
        setFavorites({ ...favorites, [id]: !favorites[id] });
    };

    const formatPrice = (price, currency = 'AED') => {
        if (price === null || price === undefined || price === 0) return 'Price on Application';
        const formattedPrice = new Intl.NumberFormat('en-AE').format(price);
        return `${currency} ${formattedPrice}`;
    };

    return (
        <div className="new-projects-page animate-fade-in">
            {/* Hero Section */}
            <section className="new-projects-hero">
                <div className="np-hero-content">
                    <span className="np-hero-label">Ophir New Projects</span>
                    <h1 className="np-hero-title">Discover New & Off-Plan Developments</h1>
                    <p className="np-hero-subtext">Explore carefully curated new launches, prime off-plan opportunities, and future-ready communities across the UAE.</p>
                    <div className="np-hero-highlights">
                        <span>Off-plan launches</span>
                        <span>Flexible payment plans</span>
                        <span>Visionary architecture</span>
                    </div>
                </div>
            </section>

            {/* Filter Bar */}
            <section className="np-filters-container">
                <form className="np-filters-grid" onSubmit={handleSearchSubmit}>
                    <div className="np-filter-group search-group">
                        <label className="np-filter-label">Search</label>
                        <div className="np-input-wrapper">
                            <Search size={18} className="np-search-icon" />
                            <input
                                type="text"
                                className="np-filter-input with-icon"
                                placeholder="Search by project name or keyword..."
                                value={searchInput}
                                onChange={(e) => setSearchInput(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="np-filter-group">
                        <label className="np-filter-label">Developer</label>
                        <select className="np-filter-select" value={developerFilter} onChange={handleFilterChange(setDeveloperFilter)}>
                            <option>All Developers</option>
                            {availableDevelopers.map(dev => (
                                <option key={dev} value={dev}>{dev}</option>
                            ))}
                        </select>
                    </div>

                    <div className="np-filter-group">
                        <label className="np-filter-label">Location</label>
                        <select className="np-filter-select" value={locationFilter} onChange={handleFilterChange(setLocationFilter)}>
                            <option>All Locations</option>
                            {availableLocations.map(loc => (
                                <option key={loc} value={loc}>{loc}</option>
                            ))}
                        </select>
                    </div>

                    <div className="np-filter-group">
                        <label className="np-filter-label">Status</label>
                        <select className="np-filter-select" value={statusFilter} onChange={handleFilterChange(setStatusFilter)}>
                            <option>All Status</option>
                            <option>Launched</option>
                            <option>Under Construction</option>
                            <option>Completed</option>
                        </select>
                    </div>
                </form>
            </section>

            {/* Results Section */}
            <section className="np-content" ref={resultsRef}>
                <div className="np-results-header">
                    <div className="np-results-count">
                        Showing <span>{properties.length > 0 ? ((page - 1) * 12 + 1) : 0} - {Math.min(page * 12, totalItems)}</span> of <span>{totalItems}</span> Off-Plan Projects
                    </div>
                    <div className="np-sort-group">
                        <label className="np-filter-label">Sort By:</label>
                        <select className="np-filter-select" value={sortBy} onChange={handleFilterChange(setSortBy)}>
                            <option>Newest Launches</option>
                            <option>Price: Low to High</option>
                            <option>Price: High to Low</option>
                            <option>Handover: Soonest First</option>
                        </select>
                    </div>
                </div>

                {isLoading ? (
                    <div className="loading-state">
                        <div className="loading-spinner"></div>
                        <p>Loading premier developments...</p>
                    </div>
                ) : error ? (
                    <div className="empty-state">
                        <p>{error}</p>
                    </div>
                ) : properties.length === 0 ? (
                    <div className="empty-state">
                        <p>No new projects match your exact selection. Try adjusting your filters.</p>
                    </div>
                ) : (
                    <>
                        <div className="np-grid">
                            {properties.map(property => {
                                const isFav = favorites[property.id] || property.isFavorited;
                                return (
                                    <div key={property.id} className="np-card">

                                        <div className="np-card-img-wrapper">
                                            <img src={property.mainImageUrl} alt={property.title} />
                                            <div className="np-card-overlay"></div>

                                            <div className="np-card-badges">
                                                <span className="np-badge-primary">New Project</span>
                                                {property.labels && property.labels.length > 0 && (
                                                    <span className="np-badge-secondary">{property.labels[0]}</span>
                                                )}
                                            </div>

                                            <div
                                                className={`favorite-btn ${isFav ? 'active' : ''}`}
                                                style={{ position: 'absolute', top: '15px', right: '15px', zIndex: 3, cursor: 'pointer' }}
                                                onClick={() => toggleFavorite(property.id)}
                                            >
                                                <Heart size={18} fill={isFav ? "#d4af37" : "none"} color={isFav ? "#d4af37" : "#fff"} />
                                            </div>
                                        </div>

                                        <div className="np-card-body">
                                            {property.developerName && (
                                                <div className="np-card-developer">By {property.developerName}</div>
                                            )}

                                            <div className="np-card-location">
                                                <MapPin size={14} />
                                                <span>{property.location}</span>
                                            </div>

                                            <h3 className="np-card-title">{property.title}</h3>

                                            <div className="np-card-price">
                                                <span className="np-price-label">Starting From</span>
                                                {formatPrice(property.price, property.currency)}
                                            </div>

                                            <div className="np-card-features">
                                                {property.handoverDate && (
                                                    <div className="np-feature-chip active">
                                                        <Calendar size={15} />
                                                        <span>Handover {property.handoverDate}</span>
                                                    </div>
                                                )}
                                                {property.status && (
                                                    <div className="np-feature-chip">
                                                        <Pickaxe size={15} />
                                                        <span>{property.status === 'ACTIVE' ? 'Launched' : property.status}</span>
                                                    </div>
                                                )}
                                                {property.bedroomRange && (
                                                    <div className="np-feature-chip">
                                                        <Bed size={15} />
                                                        <span>{property.bedroomRange} Beds</span>
                                                    </div>
                                                )}
                                            </div>

                                            <div className="np-card-footer">
                                                <div className="np-card-agent">
                                                    {property.agentAvatarUrl ? (
                                                        <div className="np-agent-pic" style={{ backgroundImage: `url(${property.agentAvatarUrl})` }}></div>
                                                    ) : (
                                                        <div className="np-agent-pic" style={{ backgroundColor: '#333' }}></div>
                                                    )}
                                                    <span className="np-agent-name">{property.agentName || 'Ophir Advisory'}</span>
                                                </div>
                                                <Link to={`/property/${property.id}`} className="np-card-btn">
                                                    View Details
                                                    <ArrowRight size={16} />
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

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

export default NewProjectsPage;
