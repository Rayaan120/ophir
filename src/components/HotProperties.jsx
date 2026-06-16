import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Heart, MapPin, Bed, Bath, Maximize, ArrowRight, RefreshCw, AlertCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useCurrency } from '../context/CurrencyContext';
import './HotProperties.css';

const hotOfferImages = [
    {
        src: '/hot offers/1.PNG',
        title: 'Signature Waterfront Residences',
        meta: 'Featured release'
    },
    {
        src: '/hot offers/2.PNG',
        title: 'Limited Release Investment Homes',
        meta: 'Investor selection'
    },
    {
        src: '/hot offers/3.PNG',
        title: 'Private Lifestyle Collection',
        meta: 'Premium availability'
    },
    {
        src: '/hot offers/5.PNG',
        title: 'Four Projects, Real Incentives',
        meta: 'Imtiaz Developments'
    },
    {
        src: '/hot offers/4.PNG',
        title: 'Near-Ready Units in Established Community',
        meta: 'Nshama limited release'
    }
];

const HotProperties = () => {
    const { t, i18n } = useTranslation();
    const [properties, setProperties] = useState([]);
    const [activeFilter, setActiveFilter] = useState('hot');
    const [favorites, setFavorites] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const { formatPrice: globalFormatPrice } = useCurrency();
    const [hotCarouselIndex, setHotCarouselIndex] = useState(0);
    const [visibleItemsCount, setVisibleItemsCount] = useState(3);

    useEffect(() => {
        const updateCount = () => {
            if (window.innerWidth <= 600) {
                setVisibleItemsCount(1);
            } else if (window.innerWidth <= 1024) {
                setVisibleItemsCount(2);
            } else {
                setVisibleItemsCount(3);
            }
        };
        updateCount();
        window.addEventListener('resize', updateCount);
        return () => window.removeEventListener('resize', updateCount);
    }, []);

    useEffect(() => {
        setHotCarouselIndex(prev => Math.min(prev, Math.max(0, hotOfferImages.length - visibleItemsCount)));
    }, [visibleItemsCount]);

    const nextHotSlide = () => {
        if (hotCarouselIndex < hotOfferImages.length - visibleItemsCount) {
            setHotCarouselIndex(prev => prev + 1);
        }
    };

    const prevHotSlide = () => {
        if (hotCarouselIndex > 0) {
            setHotCarouselIndex(prev => prev - 1);
        }
    };

    const tabs = [
        { id: 'hot', label: t('hotProps.tabHot') },
        { id: 'all', label: t('hotProps.tabAll') },
        { id: 'sale', label: t('hotProps.tabSale') },
        { id: 'rent', label: t('hotProps.tabRent') },
        { id: 'new', label: t('hotProps.tabNew') }
    ];

    const fetchProperties = async (filter) => {
        setIsLoading(true);
        setError(null);
        try {
            if (filter === 'hot') {
                setProperties([]);
                return;
            }

            let url = '/api/properties';
            if (filter === 'sale') url += '?type=sell';
            else if (filter === 'rent') url += '?type=rent';
            else if (filter === 'new') url += '?type=new';

            const response = await fetch(url);
            if (!response.ok) {
                throw new Error('Failed to fetch properties');
            }
            const data = await response.json();
            const items = data.items || (Array.isArray(data) ? data : []);
            setProperties(items.slice(0, 6));
        } catch (err) {
            setError('Unable to load properties right now.');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchProperties(activeFilter);
        if (activeFilter === 'hot') {
            setHotCarouselIndex(0);
        }
    }, [activeFilter]);

    const toggleFavorite = (id) => {
        setFavorites({ ...favorites, [id]: !favorites[id] });
    };

    // Use global formatPrice but align signature to how this component passes arguments
    const formatPrice = (price, currency = 'AED', period = null) => {
        return globalFormatPrice(price, currency, period || '');
    };

    // Loading Skeleton Component
    const LoadingSkeleton = () => (
        <div className="properties-grid">
            {[1, 2, 3].map((n) => (
                <div key={n} className="property-card skeleton-card">
                    <div className="skeleton-image pulse"></div>
                    <div className="property-body">
                        <div className="skeleton-title pulse"></div>
                        <div className="skeleton-price pulse"></div>
                        <div className="skeleton-desc pulse"></div>
                        <div className="skeleton-features pulse"></div>
                        <div className="skeleton-footer pulse"></div>
                    </div>
                </div>
            ))}
        </div>
    );

    // Error State Component
    const ErrorState = () => (
        <div className="error-container">
            <AlertCircle size={40} className="error-icon" />
            <h3 className="error-title">{t('hotProps.connError')}</h3>
            <p className="error-text">{error}</p>
            <button className="btn btn-outline error-retry-btn" onClick={fetchProperties}>
                <RefreshCw size={16} />
                <span>{t('hotProps.retry')}</span>
            </button>
        </div>
    );

    return (
        <section className="hot-properties-section section-padding">
            <div className="container">
                <div className="hot-properties-wrapper rounded-container">

                    {/* Header */}
                    <div className="hot-properties-header">
                        <div className="header-left">
                            <h2 className="section-title">{t('hotProps.title')}</h2>
                            <div className="gold-accent-line-thin"></div>
                        </div>

                        {/* Filter Tabs */}
                        <div className="hot-properties-tabs">
                            {tabs.map((tab) => (
                                <button
                                    key={tab.id}
                                    className={`filter-tab ${tab.id === 'hot' ? 'tab-hot' : ''} ${activeFilter === tab.id ? 'active' : ''}`}
                                    onClick={() => setActiveFilter(tab.id)}
                                >
                                    {tab.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Content Area */}
                    {activeFilter === 'hot' ? (
                        <div className="hot-carousel-wrapper animate-fade-in">
                            <div className="hot-carousel-container">
                                <button 
                                    className="hot-carousel-btn prev"
                                    onClick={prevHotSlide}
                                    disabled={hotCarouselIndex === 0}
                                    aria-label="Previous slide"
                                >
                                    <ChevronLeft size={24} />
                                </button>
                                <div className="hot-carousel-window">
                                    <div 
                                        className="hot-carousel-track"
                                        style={{ 
                                            transform: `translateX(-${hotCarouselIndex * (100 / visibleItemsCount)}%)` 
                                        }}
                                    >
                                        {hotOfferImages.map((offer, index) => (
                                            <div 
                                                key={offer.src} 
                                                className="hot-carousel-slide"
                                                style={{ flex: `0 0 ${100 / visibleItemsCount}%` }}
                                            >
                                                <Link
                                                    to={`/${i18n.language}/hot-offers`}
                                                    className="home-hot-offer-card"
                                                    style={{ margin: 0, height: '100%' }}
                                                >
                                                    <div className="home-hot-offer-label">
                                                        <span className="home-hot-offer-index">0{index + 1}</span>
                                                        <div>
                                                            <p>{offer.meta}</p>
                                                            <h3>{offer.title}</h3>
                                                        </div>
                                                    </div>
                                                    <figure className="home-hot-offer-frame">
                                                        <img src={offer.src} alt={offer.title} />
                                                    </figure>
                                                </Link>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <button 
                                    className="hot-carousel-btn next"
                                    onClick={nextHotSlide}
                                    disabled={hotCarouselIndex >= hotOfferImages.length - visibleItemsCount}
                                    aria-label="Next slide"
                                >
                                    <ChevronRight size={24} />
                                </button>
                            </div>
                            
                            {/* Dots Indicator */}
                            {hotOfferImages.length > visibleItemsCount && (
                                <div className="hot-carousel-dots">
                                    {Array.from({ length: hotOfferImages.length - visibleItemsCount + 1 }).map((_, idx) => (
                                        <button
                                            key={idx}
                                            className={`hot-carousel-dot ${hotCarouselIndex === idx ? 'active' : ''}`}
                                            onClick={() => setHotCarouselIndex(idx)}
                                            aria-label={`Go to slide ${idx + 1}`}
                                        />
                                    ))}
                                </div>
                            )}
                        </div>
                    ) : isLoading ? (
                        <LoadingSkeleton />
                    ) : error ? (
                        <ErrorState />
                    ) : (
                        <div className="properties-grid animate-fade-in" key={activeFilter}>
                            {properties.length === 0 ? (
                                <div className="no-properties-message" style={{ textAlign: 'center', color: '#c4c4c4', padding: '2rem', gridColumn: '1 / -1' }}>
                                    {t('hotProps.noProps')}
                                </div>
                            ) : properties.map(property => {
                                const isFav = favorites[property.id] || property.isFavorited;
                                return (
                                    <div key={property.id} className="property-card">

                                        {/* Image Section */}
                                        <Link to={`/${i18n.language}/property/${property.id}`} className="property-image-wrapper">
                                            <div className="property-image" style={{ backgroundImage: `url(${property.mainImageUrl})` }}></div>
                                            <div className="property-image-overlay"></div>

                                            {/* Top Left Badges */}
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

                                            {/* Top Right Heart */}
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

                                            {/* Bottom Left Location */}
                                            <div className="property-location-tag">
                                                <MapPin size={14} className="location-icon" />
                                                <span>{property.location}</span>
                                            </div>
                                        </Link>

                                        {/* Body Section */}
                                        <div className="property-body">
                                            <h3 className="property-title">{property.title}</h3>
                                            <div className="property-price">
                                                {property.category === 'new' || activeFilter === 'new' ? (
                                                    <>
                                                        <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 'normal', display: 'block', marginBottom: '2px' }}>{t('hotProps.startingFrom')}</span>
                                                        {formatPrice(property.price, property.currency, '')}
                                                    </>
                                                ) : (
                                                    formatPrice(property.price, property.currency, property.pricePeriod)
                                                )}
                                            </div>
                                            <p className="property-desc">{property.description}</p>

                                            {/* Features */}
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

                                            {/* Footer */}
                                            <div className="property-footer">
                                                {property.category !== 'new' && 
                                                 property.category !== 'rent' && 
                                                 !property.isHot && 
                                                 !['new', 'rent', 'hot'].includes(activeFilter) && (
                                                    <div className="agent-info">
                                                        {property.agentAvatarUrl && (
                                                            <div className="agent-avatar" style={{ backgroundImage: `url(${property.agentAvatarUrl})` }}></div>
                                                        )}
                                                        <span className="agent-name">{property.agentName}</span>
                                                    </div>
                                                )}
                                                <Link to={`/${i18n.language}/property/${property.id}`} className="view-details-btn">
                                                    <span className="gold-text">{t('common.viewDetails')}</span>
                                                    <ArrowRight size={16} className="arrow-icon" />
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}

                    {/* Bottom CTA */}
                    <div className="properties-cta-container">
                        <button 
                            className={`btn btn-outline properties-cta-btn ${activeFilter === 'hot' ? 'btn-view-hot' : ''}`}
                            onClick={() => {
                                if (activeFilter === 'hot') {
                                    navigate(`/${i18n.language}/hot-offers`);
                                } else if (activeFilter === 'rent') {
                                    navigate(`/${i18n.language}/rent`);
                                } else if (activeFilter === 'new') {
                                    navigate(`/${i18n.language}/new-projects`);
                                } else {
                                    navigate(`/${i18n.language}/buy`);
                                }
                            }}
                        >
                            <span className="gold-text">
                                {activeFilter === 'hot' 
                                    ? (i18n.language === 'ar' ? 'عرض العروض الحصرية' : 'View Hot Offers') 
                                    : t('hotProps.viewAll')}
                            </span>
                        </button>
                    </div>

                </div>
            </div>
        </section>
    );
};

export default HotProperties;
