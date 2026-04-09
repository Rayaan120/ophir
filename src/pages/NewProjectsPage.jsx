import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Heart, MapPin, Calendar, Building2, ArrowRight, Search, Pickaxe, Bed } from 'lucide-react';
import { useCurrency } from '../context/CurrencyContext';
import './NewProjectsPage.css';
import './ListingCTA.css';

const NewProjectsPage = () => {
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

    // Extracted Dropdown Options
    const [availableDevelopers, setAvailableDevelopers] = useState([]);
    const [availableEmirates, setAvailableEmirates] = useState([]);
    const [availableAreas, setAvailableAreas] = useState([]);

    // Pagination & Filter States
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState('');
    const [searchInput, setSearchInput] = useState('');
    const [developerFilter, setDeveloperFilter] = useState('All Developers');
    const [emirateFilter, setEmirateFilter] = useState('All Emirates');
    const [areaFilter, setAreaFilter] = useState('All Areas');
    const [sortBy, setSortBy] = useState('Newest Launches');

    // Mapped Filter States (Now directly usable in UI)
    const [propertyType, setPropertyType] = useState('All');
    const [bedrooms, setBedrooms] = useState('Any');
    const [priceRange, setPriceRange] = useState('Any');

    const resultsRef = useRef(null);
    const location = useLocation();

    // Parse URL parameters on mount
    useEffect(() => {
        const params = new URLSearchParams(location.search);
        let hasFilters = false;

        if (params.has('search')) {
            setSearch(params.get('search'));
            setSearchInput(params.get('search'));
            hasFilters = true;
        }
        if (params.has('propertyType')) {
            setPropertyType(params.get('propertyType'));
            hasFilters = true;
        }
        if (params.has('bedrooms')) {
            setBedrooms(params.get('bedrooms'));
            hasFilters = true;
        }
        if (params.has('priceRange')) {
            setPriceRange(params.get('priceRange'));
            hasFilters = true;
        }

        if (hasFilters && resultsRef.current) {
            setTimeout(() => {
                const y = resultsRef.current.getBoundingClientRect().top + window.scrollY - 100;
                window.scrollTo({ top: y, behavior: 'smooth' });
            }, 500);
        }
    }, [location.search]);

    const fetchProperties = async (urlSearch) => {
        setIsLoading(true);
        setError(null);
        try {
            const urlParams = new URLSearchParams(urlSearch || location.search);
            const effectiveSearch = urlParams.get('search') || search || '';
            const effectiveType = urlParams.get('propertyType') || (propertyType !== 'All' ? propertyType : null);
            const effectiveBedrooms = urlParams.get('bedrooms') || (bedrooms !== 'Any' ? bedrooms : null);
            const effectivePriceRange = urlParams.get('priceRange') || (priceRange !== 'Any' ? priceRange : null);

            const params = new URLSearchParams({
                type: 'new',
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
            if (!response.ok) throw new Error('Failed to fetch new projects');

            const data = await response.json();

            let filteredItems = data.items || [];

            const devs = new Set(filteredItems.map(p => p.developerName).filter(Boolean));
            
            const emiratesSet = new Set(filteredItems.map(p => {
                if (!p.location) return null;
                const parts = p.location.split(',');
                return parts.length > 1 ? parts[parts.length - 1].trim() : p.location.trim();
            }).filter(Boolean));
            
            const areasSet = new Set(filteredItems.map(p => p.location?.split(',')[0].trim()).filter(Boolean));

            const PRIORITY_DEVS = [
                'Emaar', 'Nakheel', 'Meraas', 'Expo City Dubai', 'Dubai South',
                'Aldar', 'Tilal al Ghaf', 'Select Group', 'SaaS properties',
                'RAK Properties', 'Nshama', 'Ellington', 'Omnyiat', 'Sobha Realty', 'Damac'
            ];

            const devsList = Array.from(devs);
            const matchedDataDevs = new Set();

            // Map priority list to actual data names if they exist, otherwise keep fixed names
            const orderedPriority = PRIORITY_DEVS.map(priority => {
                const found = devsList.find(d =>
                    d.toLowerCase().includes(priority.toLowerCase()) ||
                    priority.toLowerCase().includes(d.toLowerCase())
                );
                if (found) {
                    matchedDataDevs.add(found);
                    return found;
                }
                return priority;
            });

            // any other devs from data sorted alphabetically
            const remainingDevs = devsList
                .filter(d => !matchedDataDevs.has(d))
                .sort((a, b) => a.localeCompare(b));

            setAvailableDevelopers([...orderedPriority, ...remainingDevs]);
            setAvailableEmirates([...emiratesSet].sort());
            setAvailableAreas([...areasSet].sort());

            if (developerFilter !== 'All Developers') {
                filteredItems = filteredItems.filter(p => {
                    if (!p.developerName) return false;
                    const dev = p.developerName.toLowerCase();
                    const filter = developerFilter.toLowerCase();
                    return dev === filter || dev.includes(filter) || filter.includes(dev);
                });
            }
            if (emirateFilter !== 'All Emirates') {
                filteredItems = filteredItems.filter(p => {
                    if (!p.location) return false;
                    const parts = p.location.split(',');
                    const em = parts.length > 1 ? parts[parts.length - 1].trim() : p.location.trim();
                    return em === emirateFilter;
                });
            }
            if (areaFilter !== 'All Areas') {
                filteredItems = filteredItems.filter(p => {
                    if (!p.location) return false;
                    const area = p.location.split(',')[0].trim();
                    return area === areaFilter;
                });
            }

            setProperties(filteredItems);
            setTotalItems(data.total || 0);
            setTotalPages(data.totalPages || 1);

        } catch (err) {
            setError(t('newProjectsPage.errorLoad'));
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

        fetchProperties(location.search);

        if (hasFilters && resultsRef.current) {
            setTimeout(() => {
                const y = resultsRef.current.getBoundingClientRect().top + window.scrollY - 100;
                window.scrollTo({ top: y, behavior: 'smooth' });
            }, 500);
        }
    }, [location.search]);

    useEffect(() => {
        fetchProperties();
    }, [page, search, sortBy, developerFilter, emirateFilter, areaFilter, propertyType, bedrooms, priceRange]);

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
        if (price === null || price === undefined || price === 0) return t('newProjectsPage.priceOnApplication');
        return globalFormatPrice(price, currency);
    };

    const renderWithAmp = (text) => {
        if (!text || typeof text !== 'string') return text;
        return text.split('&').map((part, i, arr) => (
            <React.Fragment key={i}>
                {part}
                {i < arr.length - 1 && <span className="normal-amp">&</span>}
            </React.Fragment>
        ));
    };

    return (
        <div className="new-projects-page animate-fade-in">
            {/* Hero Section */}
            <section className="new-projects-hero">
                <div className="np-hero-content">
                    <span className="np-hero-label">{renderWithAmp(t('newProjectsPage.heroLabel'))}</span>
                    <h1 className="np-hero-title">{renderWithAmp(t('newProjectsPage.heroTitle'))}</h1>
                    <p className="np-hero-subtext">{renderWithAmp(t('newProjectsPage.heroSubtext'))}</p>
                    <div className="np-hero-highlights">
                        <span>{t('newProjectsPage.stat1')}</span>
                        <span>{t('newProjectsPage.stat2')}</span>
                        <span>{t('newProjectsPage.stat3')}</span>
                    </div>
                </div>
            </section>

            {/* Filter Bar */}
            <section className="np-filters-container">
                <form className="np-filters-grid" onSubmit={handleSearchSubmit}>
                    <div className="np-filter-group search-group">
                        <label className="np-filter-label">{t('newProjectsPage.filterSearch')}</label>
                        <div className="np-input-wrapper">
                            <Search size={18} className="np-search-icon" />
                            <input
                                type="text"
                                className="np-filter-input with-icon"
                                placeholder={t('newProjectsPage.filterPlaceholder')}
                                value={searchInput}
                                onChange={(e) => setSearchInput(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="np-filter-group">
                        <label className="np-filter-label">{t('newProjectsPage.filterDeveloper')}</label>
                        <select className="np-filter-select" value={developerFilter} onChange={handleFilterChange(setDeveloperFilter)}>
                            <option value="All Developers">{t('newProjectsPage.optAllDev')}</option>
                            {availableDevelopers.map(dev => (
                                <option key={dev} value={dev}>{dev}</option>
                            ))}
                        </select>
                    </div>

                    <div className="np-filter-group">
                        <label className="np-filter-label">Emirate</label>
                        <select className="np-filter-select" value={emirateFilter} onChange={handleFilterChange(setEmirateFilter)}>
                            <option value="All Emirates">All Emirates</option>
                            {availableEmirates.map(em => (
                                <option key={em} value={em}>{em}</option>
                            ))}
                        </select>
                    </div>

                    <div className="np-filter-group">
                        <label className="np-filter-label">{t('common.area') || 'Area'}</label>
                        <select className="np-filter-select" value={areaFilter} onChange={handleFilterChange(setAreaFilter)}>
                            <option value="All Areas">All Areas</option>
                            {availableAreas.map(area => (
                                <option key={area} value={area}>{area}</option>
                            ))}
                        </select>
                    </div>

                    <div className="np-filter-group">
                        <label className="np-filter-label">{t('heroSearch.typeLabel') || 'Property Type'}</label>
                        <select className="np-filter-select" value={propertyType} onChange={handleFilterChange(setPropertyType)}>
                            <option value="All">{t('heroSearch.typeAll') || 'All Types'}</option>
                            <option value="Apartment">{t('heroSearch.typeApartment') || 'Apartment'}</option>
                            <option value="Villa">{t('heroSearch.typeVilla') || 'Villa'}</option>
                            <option value="Townhouse">{t('heroSearch.typeTownhouse') || 'Townhouse'}</option>
                            <option value="Penthouse">Penthouse</option>
                            <option value="Plot">Plot</option>
                        </select>
                    </div>

                    <div className="np-filter-group">
                        <label className="np-filter-label">{t('heroSearch.bedsLabel') || 'Bedrooms'}</label>
                        <select className="np-filter-select" value={bedrooms} onChange={handleFilterChange(setBedrooms)}>
                            <option value="Any">{t('heroSearch.bedsAny') || 'Any'}</option>
                            <option value="Studio">Studio</option>
                            <option value="1">1 Bed</option>
                            <option value="2">2 Beds</option>
                            <option value="3">3 Beds</option>
                            <option value="4+">4+ Beds</option>
                        </select>
                    </div>

                    <div className="np-filter-group">
                        <label className="np-filter-label">{t('heroSearch.priceLabel') || 'Price Range'}</label>
                        <select className="np-filter-select" value={priceRange} onChange={handleFilterChange(setPriceRange)}>
                            <option value="Any">{t('heroSearch.priceAny') || 'Any Price'}</option>
                            <option value="≤1M">≤ 1M</option>
                            <option value="1M-3M">1M - 3M</option>
                            <option value="3M-5M">3M - 5M</option>
                            <option value="5M+">5M+</option>
                        </select>
                    </div>
                </form>
            </section>

            {/* Results Section */}
            <section className="np-content" ref={resultsRef}>
                <div className="np-results-header">
                    <div className="np-results-count">
                        {t('newProjectsPage.showing')} <span>{properties.length > 0 ? ((page - 1) * 12 + 1) : 0} - {Math.min(page * 12, totalItems)}</span> {t('newProjectsPage.of')} <span>{totalItems}</span> {t('newProjectsPage.resultsLabel')}
                    </div>
                    <div className="np-sort-group">
                        <label className="np-filter-label">{t('newProjectsPage.sortBy')}</label>
                        <select className="np-filter-select" value={sortBy} onChange={handleFilterChange(setSortBy)}>
                            <option value="Newest Launches">{t('newProjectsPage.sortNewest')}</option>
                            <option value="Price: Low to High">{t('newProjectsPage.sortPriceLow')}</option>
                            <option value="Price: High to Low">{t('newProjectsPage.sortPriceHigh')}</option>
                            <option value="Handover: Soonest First">{t('newProjectsPage.sortHandover')}</option>
                        </select>
                    </div>
                </div>

                {isLoading ? (
                    <div className="loading-state">
                        <div className="loading-spinner"></div>
                        <p>{t('newProjectsPage.loading')}</p>
                    </div>
                ) : error ? (
                    <div className="empty-state">
                        <p>{error}</p>
                    </div>
                ) : properties.length === 0 ? (
                    <div className="empty-state">
                        <p>{t('newProjectsPage.noResults')}</p>
                    </div>
                ) : (
                    <>
                        <div className="np-grid">
                            {properties.map(property => {
                                const isFav = favorites[property.id] || property.isFavorited;
                                return (
                                    <div key={property.id} className="np-card">

                                        <Link to={`/${i18n.language}/property/${property.id}`} className="np-card-img-wrapper">
                                            <img src={property.mainImageUrl} alt={property.title} />
                                            <div className="np-card-overlay"></div>

                                            <div className="np-card-badges">
                                                <span className="np-badge-primary">{t('newProjectsPage.badgeNew')}</span>
                                                {property.labels && property.labels.length > 0 && (
                                                    <span className="np-badge-secondary">{property.labels[0]}</span>
                                                )}
                                            </div>

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

                                        <div className="np-card-body">
                                            {property.developerName && (
                                                <div className="np-card-developer">{t('newProjectsPage.by')} {property.developerName}</div>
                                            )}

                                            <div className="np-card-location">
                                                <MapPin size={14} />
                                                <span>{property.location}</span>
                                            </div>

                                            <h3 className="np-card-title">{property.title}</h3>

                                            <div className="np-card-price">
                                                <span className="np-price-label">{t('newProjectsPage.startingFrom')}</span>
                                                {formatPrice(property.price, property.currency)}
                                            </div>

                                            <div className="np-card-features">
                                                {property.handoverDate && (
                                                    <div className="np-feature-chip active">
                                                        <Calendar size={15} />
                                                        <span>{t('newProjectsPage.handover')} {property.handoverDate}</span>
                                                    </div>
                                                )}
                                                {property.status && (
                                                    <div className="np-feature-chip">
                                                        <Pickaxe size={15} />
                                                        <span>{property.status === 'ACTIVE' ? t('newProjectsPage.launched') : property.status}</span>
                                                    </div>
                                                )}
                                                {property.bedroomRange && (
                                                    <div className="np-feature-chip">
                                                        <Bed size={15} />
                                                        <span>{property.bedroomRange} {t('newProjectsPage.bed')}</span>
                                                    </div>
                                                )}
                                            </div>

                                            <div className="np-card-footer">
                                                <Link to={`/${i18n.language}/property/${property.id}`} className="np-card-btn">
                                                    {t('newProjectsPage.viewDetails')}
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
                                    {t('newProjectsPage.previous')}
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
                                    {t('newProjectsPage.next')}
                                </button>
                            </div>
                        )}
                    </>
                )}
            </section>

            {/* SEO Listing CTA */}
            <section className="listing-final-cta" style={{ backgroundImage: "url('/off/offplan-cta.png')" }}>
                <div className="cta-overlay"></div>
                <div className="cta-container">
                    <div className="cta-content">
                        <span className="cta-label">{t('newProjectsPage.cta.label')}</span>
                        <h2 className="cta-title">{t('newProjectsPage.cta.title')}</h2>
                        <p className="cta-desc">{t('newProjectsPage.cta.desc')}</p>
                        <div className="cta-buttons">
                            <button className="gold-filled-btn" onClick={() => navigate(`/${i18n.language}/contact`)}>
                                {t('newProjectsPage.cta.btn1')}
                            </button>
                            <button className="gold-outline-btn" onClick={() => window.open('https://wa.me/971000000000', '_blank')}>
                                {t('newProjectsPage.cta.btn2')}
                            </button>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default NewProjectsPage;
