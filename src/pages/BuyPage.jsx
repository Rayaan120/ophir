import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Heart, MapPin, Bed, Bath, Maximize, ArrowRight, Search } from 'lucide-react';
import { useCurrency } from '../context/CurrencyContext';
import './BuyPage.css';
import './ListingCTA.css';

const BuyPage = () => {
    const { t, i18n } = useTranslation();
    const navigate = useNavigate();
    // States
    const [properties, setProperties] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [totalItems, setTotalItems] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const [favorites, setFavorites] = useState({});
    const { formatPrice: globalFormatPrice, selectedCurrency } = useCurrency();

    // Pagination & Filter States
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState('');
    const [searchInput, setSearchInput] = useState(''); // for local input
    const [propertyType, setPropertyType] = useState('All');
    const [bedrooms, setBedrooms] = useState('Any');
    const [priceRange, setPriceRange] = useState('Any');
    const [sortBy, setSortBy] = useState('Newest');

    const resultsRef = useRef(null);
    const location = useLocation();

    const fetchProperties = async (urlSearch) => {
        setIsLoading(true);
        setError(null);
        try {
            // Merge URL params with state params — URL params take priority on initial load
            const urlParams = new URLSearchParams(urlSearch || location.search);
            const effectiveSearch = urlParams.get('search') || search || '';
            const effectiveType = urlParams.get('propertyType') || (propertyType !== 'All' ? propertyType : null);
            const effectiveBedrooms = urlParams.get('bedrooms') || (bedrooms !== 'Any' ? bedrooms : null);
            const effectivePriceRange = urlParams.get('priceRange') || (priceRange !== 'Any' ? priceRange : null);

            const params = new URLSearchParams({
                type: 'sell',
                page: page,
                pageSize: 12
            });
            if (effectiveSearch) params.append('search', effectiveSearch);
            if (effectiveType && effectiveType !== 'All') params.append('propertyType', effectiveType);
            if (effectiveBedrooms && effectiveBedrooms !== 'Any') params.append('bedrooms', effectiveBedrooms);

            if (effectivePriceRange && effectivePriceRange !== 'Any') {
                if (effectivePriceRange === '≤1M') params.append('priceMax', 1000000);
                else if (effectivePriceRange === '1M-3M') { params.append('priceMin', 1000000); params.append('priceMax', 3000000); }
                else if (effectivePriceRange === '3M-5M') { params.append('priceMin', 3000000); params.append('priceMax', 5000000); }
                else if (effectivePriceRange === '5M+') params.append('priceMin', 5000000);
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
            setError(t('buyPage.errorLoad'));
            setProperties([]);
        } finally {
            setIsLoading(false);
        }
    };

    // Sync URL params into React state AND trigger fetch in one combined effect
    useEffect(() => {
        const params = new URLSearchParams(location.search);
        let hasFilters = false;

        if (params.has('search')) { setSearch(params.get('search')); setSearchInput(params.get('search')); hasFilters = true; }
        if (params.has('propertyType')) { setPropertyType(params.get('propertyType')); hasFilters = true; }
        if (params.has('bedrooms')) { setBedrooms(params.get('bedrooms')); hasFilters = true; }
        if (params.has('priceRange')) { setPriceRange(params.get('priceRange')); hasFilters = true; }

        // Pass current location.search directly so the fetch uses the right values immediately
        fetchProperties(location.search);

        if (hasFilters && resultsRef.current) {
            setTimeout(() => {
                const y = resultsRef.current.getBoundingClientRect().top + window.scrollY - 100;
                window.scrollTo({ top: y, behavior: 'smooth' });
            }, 500);
        }
    }, [location.search]);

    useEffect(() => {
        // Only re-fetch when state-based filters change (user interacts with on-page filters)
        // Skip if this was just triggered by URL parsing (location.search handles that already)
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
        return globalFormatPrice(price, currency);
    };

    return (
        <div className="buy-page animate-fade-in">
            {/* Hero Section */}
            <section className="buy-hero">
                <div className="buy-hero-content">
                    <span className="hero-label">{t('buyPage.heroLabel')}</span>
                    <h1 className="hero-title">{t('buyPage.heroTitle')}</h1>
                    <p className="hero-subtext">{t('buyPage.heroSubtext')}</p>
                    <div className="hero-stats">
                        <span>{t('buyPage.stat1')}</span>
                        <span>{t('buyPage.stat2')}</span>
                        <span>{t('buyPage.stat3')}</span>
                    </div>
                </div>
            </section>

            {/* Filter Bar */}
            <section className="buy-filters-container">
                <form className="filters-grid" onSubmit={handleSearchSubmit}>
                    <div className="filter-group search-group">
                        <label className="filter-label">{t('buyPage.filterSearch')}</label>
                        <div className="filter-input-wrapper">
                            <Search size={18} className="search-icon" />
                            <input
                                type="text"
                                className="filter-input with-icon"
                                placeholder={t('buyPage.filterPlaceholder')}
                                value={searchInput}
                                onChange={(e) => setSearchInput(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="filter-group">
                        <label className="filter-label">{t('buyPage.filterType')}</label>
                        <div className="select-wrapper">
                            <select className="filter-select" value={propertyType} onChange={handleFilterChange(setPropertyType)}>
                                <option value="All">{t('buyPage.optAll')}</option>
                                <option value="Apartment">{t('buyPage.optApartment')}</option>
                                <option value="Villa">{t('buyPage.optVilla')}</option>
                                <option value="Townhouse">{t('buyPage.optTownhouse')}</option>
                                <option value="Penthouse">{t('buyPage.optPenthouse')}</option>
                                <option value="Plot">{t('buyPage.optPlot')}</option>
                            </select>
                        </div>
                    </div>

                    <div className="filter-group">
                        <label className="filter-label">{t('buyPage.filterBedrooms')}</label>
                        <div className="select-wrapper">
                            <select className="filter-select" value={bedrooms} onChange={handleFilterChange(setBedrooms)}>
                                <option value="Any">{t('buyPage.optAny')}</option>
                                <option value="Studio">{t('buyPage.optStudio')}</option>
                                <option value="1">1</option>
                                <option value="2">2</option>
                                <option value="3">3</option>
                                <option value="4+">4+</option>
                            </select>
                        </div>
                    </div>

                    <div className="filter-group">
                        <label className="filter-label">{t('buyPage.filterPrice')}</label>
                        <div className="select-wrapper">
                            <select className="filter-select" value={priceRange} onChange={handleFilterChange(setPriceRange)}>
                                <option value="Any">{t('buyPage.optAny')}</option>
                                <option value="≤1M">≤1M</option>
                                <option value="1M-3M">1M-3M</option>
                                <option value="3M-5M">3M-5M</option>
                                <option value="5M+">5M+</option>
                            </select>
                        </div>
                    </div>

                </form>
            </section>

            {/* Content / Results */}
            <section className="buy-content" ref={resultsRef}>
                <div className="results-header">
                    <div className="results-count">
                        {t('buyPage.showing')} <span>{properties.length > 0 ? ((page - 1) * 12 + 1) : 0} - {Math.min(page * 12, totalItems)}</span> {t('buyPage.of')} <span>{totalItems}</span> {t('buyPage.resultsLabel')}
                    </div>
                    <div className="sort-group">
                        <label className="filter-label">{t('buyPage.sortBy')}</label>
                        <div className="select-wrapper">
                            <select className="filter-select" value={sortBy} onChange={handleFilterChange(setSortBy)}>
                                <option value="Newest">{t('buyPage.sortNewest')}</option>
                                <option value="Price: Low to High">{t('buyPage.sortPriceLow')}</option>
                                <option value="Price: High to Low">{t('buyPage.sortPriceHigh')}</option>
                            </select>
                        </div>
                    </div>
                </div>

                {isLoading ? (
                    <div className="loading-state">
                        <div className="loading-spinner"></div>
                        <p>{t('buyPage.loading')}</p>
                    </div>
                ) : error ? (
                    <div className="empty-state">
                        <p>{error}</p>
                    </div>
                ) : properties.length === 0 ? (
                    <div className="empty-state">
                        <p>{t('buyPage.noResults')}</p>
                    </div>
                ) : (
                    <>
                        <div className="buy-grid">
                            {properties.map(property => {
                                const isFav = favorites[property.id] || property.isFavorited;
                                return (
                                    <div key={property.id} className="buy-card">
                                        {/* Image Section */}
                                        <Link to={`/${i18n.language}/property/${property.id}`} className="card-img-wrapper">
                                            <img src={property.mainImageUrl} alt={property.title} />
                                            <div className="card-overlay"></div>

                                            {/* Badges */}
                                            <div className="card-badges">
                                                <span className="badge-sale">{t('buyPage.badgeSale')}</span>
                                                {property.labels && property.labels.length > 0 && (
                                                    <span className="badge-type">{property.labels[0]}</span>
                                                )}
                                            </div>

                                            {/* Heart */}
                                            <div
                                                className={`favorite-btn ${isFav ? 'active' : ''}`}
                                                style={{ position: 'absolute', top: '15px', right: '15px', zIndex: 3, cursor: 'pointer' }}
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    e.stopPropagation();
                                                    toggleFavorite(property.id);
                                                }}
                                            >
                                                <Heart size={18} fill={isFav ? "#d4af37" : "none"} color={isFav ? "#d4af37" : "#fff"} />
                                            </div>
                                        </Link>

                                        {/* Body */}
                                        <div className="card-body">
                                            <div className="card-location">
                                                <MapPin size={14} />
                                                <span>{property.location}</span>
                                            </div>

                                            <h3 className="card-title">{property.title}</h3>

                                            <div className="card-price">
                                                {property.price ? formatPrice(property.price, property.currency) : t('buyPage.priceOnRequest')}
                                            </div>

                                            {/* Features */}
                                            <div className="card-features">
                                                {property.bedrooms > 0 && (
                                                    <div className="feature-item">
                                                        <Bed size={16} />
                                                        <span>{property.bedrooms} {t('buyPage.bed')}</span>
                                                    </div>
                                                )}
                                                {property.bathrooms > 0 && (
                                                    <div className="feature-item">
                                                        <Bath size={16} />
                                                        <span>{property.bathrooms} {t('buyPage.bath')}</span>
                                                    </div>
                                                )}
                                                {property.areaSqft > 0 && (
                                                    <div className="feature-item">
                                                        <Maximize size={16} />
                                                        <span>{property.areaSqft} {t('buyPage.sqft')}</span>
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
                                                    <span className="agent-name">{property.agentName || t('buyPage.ophirConsultant')}</span>
                                                </div>
                                                <Link to={`/${i18n.language}/property/${property.id}`} className="view-details-btn">
                                                    <span className="gold-text">{t('buyPage.viewDetails')}</span>
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
                                    {t('buyPage.previous')}
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
                                    {t('buyPage.next')}
                                </button>
                            </div>
                        )}
                    </>
                )}
            </section>
            
            {/* SEO Listing CTA */}
            <section className="listing-final-cta" style={{ backgroundImage: "url('/buy1/buy.png')" }}>
                <div className="cta-overlay"></div>
                <div className="cta-container">
                    <div className="cta-content">
                        <span className="cta-label">{t('buyPage.cta.label')}</span>
                        <h2 className="cta-title">{t('buyPage.cta.title')}</h2>
                        <p className="cta-desc">{t('buyPage.cta.desc')}</p>
                        <div className="cta-buttons">
                            <button className="gold-filled-btn" onClick={() => navigate(`/${i18n.language}/contact`)}>
                                {t('buyPage.cta.btn1')}
                            </button>
                            <button className="gold-filled-btn" onClick={() => window.open('https://wa.me/9717758953106', '_blank')}>
                                {t('buyPage.cta.btn2')}
                            </button>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default BuyPage;
