import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Heart, MapPin, Bed, Bath, Maximize, ArrowRight, RefreshCw, AlertCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useCurrency } from '../context/CurrencyContext';

// We import the CSS needed for the new page layout
import './CommunitiesPage.css';

const CommunitiesPage = () => {
    const { t, i18n } = useTranslation();
    const [properties, setProperties] = useState([]);
    const [activeTab, setActiveTab] = useState('dubai');
    const [activeFilter, setActiveFilter] = useState('all');
    const [favorites, setFavorites] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const { formatPrice: globalFormatPrice } = useCurrency();

    const tabs = [
        { id: 'dubai', label: t('explore.dubaiTitle') || 'Dubai' },
        { id: 'abu dhabi', label: t('explore.abudhabiTitle') || 'Abu Dhabi' },
        { id: 'ras al khaimah', label: t('explore.rakTitle') || 'Ras Al Khaimah' }
    ];

    const filterTabs = [
        { id: 'all', label: t('hotProps.tabAll') || 'All Properties' },
        { id: 'sell', label: t('hotProps.tabSale') || 'Sale' },
        { id: 'rent', label: t('hotProps.tabRent') || 'Rent' },
        { id: 'new', label: t('hotProps.tabNew') || 'New Projects' }
    ];

    const fetchProperties = async (city, filter = 'all') => {
        setIsLoading(true);
        setError(null);
        try {
            const params = new URLSearchParams({ search: city, pageSize: 12 });
            if (filter !== 'all') {
                params.append('type', filter);
            }
            const url = `/api/properties?${params.toString()}`;

            const response = await fetch(url);
            if (!response.ok) {
                throw new Error('Failed to fetch properties');
            }
            const data = await response.json();
            const items = data.items || (Array.isArray(data) ? data : []);
            setProperties(items);
        } catch (err) {
            setError(t('hotProps.connError') || 'Unable to load properties right now.');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchProperties(activeTab, activeFilter);
    }, [activeTab, activeFilter]);

    const toggleFavorite = (id) => {
        setFavorites({ ...favorites, [id]: !favorites[id] });
    };

    const formatPrice = (price, currency = 'AED', period = null) => {
        return globalFormatPrice(price, currency, period || '');
    };

    const LoadingSkeleton = () => (
        <div className="properties-grid communities-grid">
            {[1, 2, 3, 4, 5, 6].map((n) => (
                <div key={n} className="property-card skeleton-card">
                    <div className="property-image-wrapper skeleton-image-wrapper">
                        <div className="skeleton-image pulse"></div>
                    </div>
                    <div className="property-body">
                        <div className="skeleton-title pulse" style={{ height: '24px', width: '70%', marginBottom: '12px' }}></div>
                        <div className="skeleton-price pulse" style={{ height: '20px', width: '40%', marginBottom: '12px' }}></div>
                        <div className="skeleton-desc pulse" style={{ height: '40px', width: '90%', marginBottom: '12px' }}></div>
                        <div className="skeleton-features pulse" style={{ height: '30px', width: '100%', marginBottom: '12px' }}></div>
                        <div className="skeleton-footer pulse" style={{ height: '40px', width: '100%' }}></div>
                    </div>
                </div>
            ))}
        </div>
    );

    const ErrorState = () => (
        <div className="error-container" style={{ textAlign: 'center', padding: '60px' }}>
            <AlertCircle size={48} color="var(--gold-primary)" style={{ marginBottom: '20px' }} />
            <h3 className="error-title" style={{ fontSize: '1.5rem', marginBottom: '10px' }}>{t('hotProps.connError') || 'Connection Error'}</h3>
            <p className="error-text" style={{ color: 'var(--text-muted)', marginBottom: '20px' }}>{error}</p>
            <button className="btn btn-outline error-retry-btn" onClick={() => fetchProperties(activeTab)} style={{ display: 'flex', alignItems: 'center', gap: '8px', margin: '0 auto' }}>
                <RefreshCw size={18} />
                <span>{t('hotProps.retry') || 'Retry'}</span>
            </button>
        </div>
    );

    const heroBgMap = {
        'dubai': '/palm-jumeirah-img.jpg',
        'abu dhabi': '/zayed-national-museum-abu-dhabi-img.jpg',
        'ras al khaimah': '/wynn-al-marjan-img.png'
    };

    const activeBg = heroBgMap[activeTab] || heroBgMap['dubai'];
    const activeLabel = tabs.find(item => item.id === activeTab)?.label || 'Communities';

    return (
        <div className="communities-page animate-fade-in">
            <section className="communities-hero" style={{ backgroundImage: `url(${activeBg})` }}>
                <div className="communities-hero-content">
                    <span className="communities-hero-label">{t('explore.exploreHeader') || 'Explore Communities'}</span>
                    <h1 className="communities-hero-title">{activeLabel}</h1>
                    <p className="communities-hero-desc">
                        Discover the finest properties and most exclusive developments located in {activeLabel}, UAE. 
                        Experience luxury living redefined.
                    </p>
                </div>
            </section>

            <div className="communities-tabs-wrapper">
                <div className="container">
                    <div className="communities-tabs city-tabs">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                className={`community-tab ${activeTab === tab.id ? 'active' : ''}`}
                                onClick={() => {
                                    setActiveTab(tab.id);
                                    setActiveFilter('all'); // Reset filter when city changes
                                }}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    <div className="communities-sub-filters">
                        <div className="sub-filters-inner">
                            {filterTabs.map((filter) => (
                                <button
                                    key={filter.id}
                                    className={`sub-filter-btn ${activeFilter === filter.id ? 'active' : ''}`}
                                    onClick={() => setActiveFilter(filter.id)}
                                >
                                    {filter.label}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <section className="communities-content-area">
                <div className="container">
                    
                    <div className="city-title-wrapper">
                        <h2>{activeLabel} {t('common.properties') || 'Properties'}</h2>
                        <p>{t('buyPage.showing')} {properties.length} {t('common.results') || 'Results'}</p>
                    </div>

                    {isLoading ? (
                        <div className="communities-loading">
                            <LoadingSkeleton />
                        </div>
                    ) : error ? (
                        <ErrorState />
                    ) : (
                        <div className="properties-grid communities-grid animate-fade-in" key={activeTab}>
                            {properties.length === 0 ? (
                                <div className="communities-empty" style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '100px 20px' }}>
                                    <h3>{t('hotProps.noProps') || 'No properties found.'}</h3>
                                    <p>We couldn't find any active listings matching this community.</p>
                                </div>
                            ) : properties.map(property => {
                                const isFav = favorites[property.id] || property.isFavorited;
                                const lang = i18n.language || 'en';
                                return (
                                    <div key={property.id} className="property-card">
                                        <Link to={`/${lang}/property/${property.id}`} className="property-image-wrapper">
                                            <div className="property-image" style={{ backgroundImage: `url(${property.mainImageUrl})` }}></div>
                                            <div className="property-image-overlay"></div>
                                            <div className="property-badges">
                                                <span className="badge-primary" style={{ textTransform: 'capitalize' }}>
                                                    {property.category === 'new' ? 'New' : property.category}
                                                </span>
                                                {property.labels && property.labels.length > 0 && (
                                                    <span className="badge-secondary">
                                                        {property.category === 'new' && property.labels[0].toLowerCase() === 'default tag' ? 'Project' : property.labels[0]}
                                                    </span>
                                                )}
                                            </div>
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
                                            <div className="property-location-tag">
                                                <MapPin size={14} className="location-icon" />
                                                <span>{property.location}</span>
                                            </div>
                                        </Link>

                                        <div className="property-body">
                                            <h3 className="property-title">{property.title}</h3>
                                            <div className="property-price">
                                                {property.category === 'new' ? (
                                                    <>
                                                        <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 'normal', display: 'block', marginBottom: '2px' }}>
                                                            {t('hotProps.startingFrom')}
                                                        </span>
                                                        {formatPrice(property.price, property.currency, '')}
                                                    </>
                                                ) : (
                                                    formatPrice(property.price, property.currency, property.pricePeriod)
                                                )}
                                            </div>
                                            <p className="property-desc">{property.description}</p>
                                            <div className="property-features">
                                                {property.bedrooms > 0 && (
                                                    <div className="feature-pill">
                                                        <Bed size={16} className="feature-icon" />
                                                        <span>{property.bedrooms}</span>
                                                    </div>
                                                )}
                                                {property.bathrooms > 0 && (
                                                    <div className="feature-pill">
                                                        <Bath size={16} className="feature-icon" />
                                                        <span>{property.bathrooms}</span>
                                                    </div>
                                                )}
                                                {property.areaSqft > 0 && (
                                                    <div className="feature-pill">
                                                        <Maximize size={16} className="feature-icon" />
                                                        <span>{property.areaSqft.toLocaleString()} sq ft</span>
                                                    </div>
                                                )}
                                            </div>
                                            <div className="property-footer">
                                                {property.category !== 'new' && (
                                                    <div className="agent-info">
                                                        {property.agentAvatarUrl && (
                                                            <div className="agent-avatar" style={{ backgroundImage: `url(${property.agentAvatarUrl})` }}></div>
                                                        )}
                                                        <span className="agent-name">{property.agentName}</span>
                                                    </div>
                                                )}
                                                <Link to={`/${lang}/property/${property.id}`} className="view-details-btn">
                                                    <span className="gold-text">
                                                        {t('common.viewDetails') || 'View Details'}
                                                    </span>
                                                    <ArrowRight size={16} className="arrow-icon" />
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
};

export default CommunitiesPage;
