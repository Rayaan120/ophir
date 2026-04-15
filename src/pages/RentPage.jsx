import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Heart, MapPin, Bed, Bath, Maximize, ArrowRight, Search } from 'lucide-react';
import { useCurrency } from '../context/CurrencyContext';
import './RentPage.css';
import './ListingCTA.css';

const RentPage = () => {
    const { t, i18n } = useTranslation();
    const navigate = useNavigate();
    // States
    const [properties, setProperties] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [totalItems, setTotalItems] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const [favorites, setFavorites] = useState({});
    const { formatPrice: globalFormatPrice } = useCurrency();

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

    const fetchRentals = async (urlSearch) => {
        setIsLoading(true);
        setError(null);
        try {
            const urlParams = new URLSearchParams(urlSearch || location.search);
            const effectiveSearch = urlParams.get('search') || search || '';
            const effectiveType = urlParams.get('propertyType') || (propertyType !== 'All' ? propertyType : null);
            const effectiveBedrooms = urlParams.get('bedrooms') || (bedrooms !== 'Any' ? bedrooms : null);
            const effectivePriceRange = urlParams.get('priceRange') || (priceRange !== 'Any' ? priceRange : null);

            const params = new URLSearchParams({
                type: 'rent',
                page: page,
                pageSize: 12
            });
            if (effectiveSearch) params.append('search', effectiveSearch);
            if (effectiveType && effectiveType !== 'All') params.append('propertyType', effectiveType);
            if (effectiveBedrooms && effectiveBedrooms !== 'Any') params.append('bedrooms', effectiveBedrooms);

            if (effectivePriceRange && effectivePriceRange !== 'Any') {
                if (effectivePriceRange === '≤100k') params.append('priceMax', 100000);
                else if (effectivePriceRange === '100k-200k') { params.append('priceMin', 100000); params.append('priceMax', 200000); }
                else if (effectivePriceRange === '200k-400k') { params.append('priceMin', 200000); params.append('priceMax', 400000); }
                else if (effectivePriceRange === '400k+') params.append('priceMin', 400000);
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
            setError(t('rentPage.errorLoad'));
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

        fetchRentals(location.search);

        if (hasFilters && resultsRef.current) {
            setTimeout(() => {
                const y = resultsRef.current.getBoundingClientRect().top + window.scrollY - 100;
                window.scrollTo({ top: y, behavior: 'smooth' });
            }, 500);
        }
    }, [location.search]);

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
        return globalFormatPrice(price, currency, period || '');
    };

    return (
        <div className="rent-page animate-fade-in">
            {/* Hero Section */}
            <section className="rent-hero">
                <div className="rent-hero-content">
                    <span className="hero-label">{t('rentPage.heroLabel')}</span>
                    <h1 className="hero-title">{t('rentPage.heroTitle')}</h1>
                    <p className="hero-subtext">{t('rentPage.heroSubtext')}</p>
                </div>
            </section>

            {/* Filter Bar */}
            <section className="rent-filters-container">
                <form className="filters-grid" onSubmit={handleSearchSubmit}>
                    <div className="filter-group search-group">
                        <label className="filter-label">{t('rentPage.filterSearch')}</label>
                        <div className="filter-input-wrapper">
                            <Search size={18} className="search-icon" />
                            <input
                                type="text"
                                className="filter-input with-icon"
                                placeholder={t('rentPage.filterPlaceholder')}
                                value={searchInput}
                                onChange={(e) => setSearchInput(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="filter-group">
                        <label className="filter-label">{t('rentPage.filterType')}</label>
                        <div className="select-wrapper">
                            <select className="filter-select" value={propertyType} onChange={handleFilterChange(setPropertyType)}>
                                <option value="All">{t('rentPage.optAll')}</option>
                                <option value="Apartment">{t('rentPage.optApartment')}</option>
                                <option value="Villa">{t('rentPage.optVilla')}</option>
                                <option value="Townhouse">{t('rentPage.optTownhouse')}</option>
                                <option value="Penthouse">{t('rentPage.optPenthouse')}</option>
                            </select>
                        </div>
                    </div>

                    <div className="filter-group">
                        <label className="filter-label">{t('rentPage.filterBedrooms')}</label>
                        <div className="select-wrapper">
                            <select className="filter-select" value={bedrooms} onChange={handleFilterChange(setBedrooms)}>
                                <option value="Any">{t('rentPage.optAny')}</option>
                                <option value="Studio">{t('rentPage.optStudio')}</option>
                                <option value="1">1</option>
                                <option value="2">2</option>
                                <option value="3">3</option>
                                <option value="4+">4+</option>
                            </select>
                        </div>
                    </div>

                    <div className="filter-group">
                        <label className="filter-label">{t('rentPage.filterPrice')}</label>
                        <div className="select-wrapper">
                            <select className="filter-select" value={priceRange} onChange={handleFilterChange(setPriceRange)}>
                                <option value="Any">{t('rentPage.optAny')}</option>
                                <option value="≤100k">≤100k</option>
                                <option value="100k-200k">100k-200k</option>
                                <option value="200k-400k">200k-400k</option>
                                <option value="400k+">400k+</option>
                            </select>
                        </div>
                    </div>

                </form>
            </section>

            {/* Content / Results */}
            <section className="rent-content" ref={resultsRef}>
                <div className="results-header">
                    <div className="results-count">
                        {t('rentPage.showing')} <span>{properties.length > 0 ? ((page - 1) * 12 + 1) : 0} - {Math.min(page * 12, totalItems)}</span> {t('rentPage.of')} <span>{totalItems}</span> {t('rentPage.resultsLabel')}
                    </div>
                    <div className="sort-group">
                        <label className="filter-label">{t('rentPage.sortBy')}</label>
                        <div className="select-wrapper">
                            <select className="filter-select" value={sortBy} onChange={handleFilterChange(setSortBy)}>
                                <option value="Newest">{t('rentPage.sortNewest')}</option>
                                <option value="Price: Low to High">{t('rentPage.sortPriceLow')}</option>
                                <option value="Price: High to Low">{t('rentPage.sortPriceHigh')}</option>
                            </select>
                        </div>
                    </div>
                </div>

                {isLoading ? (
                    <div className="loading-state">
                        <div className="loading-spinner"></div>
                        <p>{t('rentPage.loading')}</p>
                    </div>
                ) : error ? (
                    <div className="empty-state">
                        <p>{error}</p>
                    </div>
                ) : properties.length === 0 ? (
                    <div className="empty-state">
                        <p>{t('rentPage.noResults')}</p>
                    </div>
                ) : (
                    <>
                        <div className="rent-grid">
                            {properties.map(property => {
                                const isFav = favorites[property.id] || property.isFavorited;
                                return (
                                    <div key={property.id} className="property-card">
                                        {/* Image Section */}
                                        <Link to={`/${i18n.language}/property/${property.id}`} className="property-image-wrapper">
                                            <div className="property-image" style={{ backgroundImage: `url(${property.mainImageUrl})` }}></div>
                                            <div className="property-image-overlay"></div>

                                            {/* Badges */}
                                            <div className="property-badges">
                                                <span className="badge-primary">{t('rentPage.badgeRent')}</span>
                                                {property.labels && property.labels.length > 0 && (
                                                    <span className="badge-secondary">{property.labels[0]}</span>
                                                )}
                                            </div>

                                            {/* Heart */}
                                            <div
                                                className={`favorite-btn ${isFav ? 'active' : ''}`}
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    e.stopPropagation();
                                                    toggleFavorite(property.id);
                                                }}
                                            >
                                                <Heart size={18} fill={isFav ? "#d4af37" : "none"} color={isFav ? "#d4af37" : "#fff"} />
                                            </div>

                                            {/* Location */}
                                            <div className="property-location-tag">
                                                <MapPin size={14} className="location-icon" />
                                                <span>{property.location}</span>
                                            </div>
                                        </Link>

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
                                                        <span>{property.bedrooms} {t('rentPage.bed')}</span>
                                                    </div>
                                                )}
                                                {property.bathrooms > 0 && (
                                                    <div className="feature-pill">
                                                        <Bath size={16} className="feature-icon" />
                                                        <span>{property.bathrooms} {t('rentPage.bath')}</span>
                                                    </div>
                                                )}
                                                {property.areaSqft > 0 && (
                                                    <div className="feature-pill">
                                                        <Maximize size={16} className="feature-icon" />
                                                        <span>{property.areaSqft} {t('rentPage.sqft')}</span>
                                                    </div>
                                                )}
                                            </div>

                                            <div className="property-footer">
                                                <Link to={`/${i18n.language}/property/${property.id}`} className="view-details-btn">
                                                    <span className="gold-text">{t('rentPage.viewDetails')}</span>
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
                                    {t('rentPage.previous')}
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
                                    {t('rentPage.next')}
                                </button>
                            </div>
                        )}
                    </>
                )}
            </section>

            {/* SEO Listing CTA */}
            <section className="listing-final-cta" style={{ backgroundImage: "url('/rent/rent-cta.png')" }}>
                <div className="cta-overlay"></div>
                <div className="cta-container">
                    <div className="cta-content">
                        <span className="cta-label">{t('rentPage.cta.label')}</span>
                        <h2 className="cta-title">{t('rentPage.cta.title')}</h2>
                        <p className="cta-desc">{t('rentPage.cta.desc')}</p>
                        <div className="cta-buttons">
                            <button className="gold-filled-btn" onClick={() => navigate(`/${i18n.language}/contact`)}>
                                {t('rentPage.cta.btn1')}
                            </button>
                            <button className="gold-outline-btn" onClick={() => window.open('https://wa.me/9717758953106', '_blank')}>
                                {t('rentPage.cta.btn2')}
                            </button>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default RentPage;
