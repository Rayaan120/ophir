import { useState, useEffect } from 'react';
import { Heart, MapPin, Bed, Bath, Maximize, ArrowRight, RefreshCw, AlertCircle } from 'lucide-react';
import './HotProperties.css';

const HotProperties = () => {
    const [properties, setProperties] = useState([]);
    const [activeTab, setActiveTab] = useState('All Properties');
    const [favorites, setFavorites] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const tabs = ['All Properties', 'Sale', 'Rent', 'Commercial'];

    const fetchProperties = async () => {
        setIsLoading(true);
        setError(null);
        try {
            // Simulated fetch to the requested PixxiCRM endpoint
            const response = await fetch('/api/properties?hot=true');
            if (!response.ok) {
                throw new Error('Failed to fetch properties');
            }
            const data = await response.json();
            setProperties(data);
        } catch (err) {
            // For demonstration purposes, if the API doesn't exist, we fall back to the error state.
            // Alternatively, one could use mock data here if a visual preview is desired despite the missing backend.
            setError('Unable to load properties right now.');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchProperties();
    }, []);

    const toggleFavorite = (id) => {
        setFavorites({ ...favorites, [id]: !favorites[id] });
    };

    const formatPrice = (price, currency = 'AED', period = null) => {
        const formattedPrice = new Intl.NumberFormat('en-AE').format(price);
        return `${currency} ${formattedPrice}${period ? ` ${period}` : ''}`;
    };

    const filteredProperties = properties.filter(property => {
        const filterCat = activeTab.toLowerCase();
        if (filterCat === 'all properties') return true;
        return property.category && property.category.toLowerCase() === filterCat;
    });

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
            <h3 className="error-title">Connection Error</h3>
            <p className="error-text">{error}</p>
            <button className="btn btn-outline error-retry-btn" onClick={fetchProperties}>
                <RefreshCw size={16} />
                <span>Retry</span>
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
                            <h2 className="section-title">Browse Hot Properties</h2>
                            <div className="gold-accent-line-thin"></div>
                        </div>

                        {/* Filter Tabs */}
                        <div className="hot-properties-tabs">
                            {tabs.map((tab) => (
                                <button
                                    key={tab}
                                    className={`filter-tab ${activeTab === tab ? 'active' : ''}`}
                                    onClick={() => setActiveTab(tab)}
                                >
                                    {tab}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Content Area */}
                    {isLoading ? (
                        <LoadingSkeleton />
                    ) : error ? (
                        <ErrorState />
                    ) : (
                        <div className="properties-grid animate-fade-in" key={activeTab}>
                            {filteredProperties.map(property => {
                                const isFav = favorites[property.id] || property.isFavorited;
                                return (
                                    <div key={property.id} className="property-card">

                                        {/* Image Section */}
                                        <div className="property-image-wrapper">
                                            <div className="property-image" style={{ backgroundImage: `url(${property.mainImageUrl})` }}></div>
                                            <div className="property-image-overlay"></div>

                                            {/* Top Left Badges */}
                                            <div className="property-badges">
                                                <span className="badge-primary" style={{ textTransform: 'capitalize' }}>{property.category}</span>
                                                {property.labels && property.labels.length > 0 && (
                                                    <span className="badge-secondary">{property.labels[0]}</span>
                                                )}
                                            </div>

                                            {/* Top Right Heart */}
                                            <div
                                                className={`favorite-btn ${isFav ? 'active' : ''}`}
                                                onClick={() => toggleFavorite(property.id)}
                                            >
                                                <Heart size={18} fill={isFav ? "#d4af37" : "none"} color={isFav ? "#d4af37" : "#fff"} />
                                            </div>

                                            {/* Bottom Left Location */}
                                            <div className="property-location-tag">
                                                <MapPin size={14} className="location-icon" />
                                                <span>{property.location}</span>
                                            </div>
                                        </div>

                                        {/* Body Section */}
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
                                                        <span>{property.bedrooms}</span>
                                                    </div>
                                                )}
                                                {property.bathrooms > 0 && (
                                                    <div className="feature-pill">
                                                        <Bath size={16} className="feature-icon" />
                                                        <span>{property.bathrooms}</span>
                                                    </div>
                                                )}
                                                {property.areaSqft && (
                                                    <div className="feature-pill">
                                                        <Maximize size={16} className="feature-icon" />
                                                        <span>{property.areaSqft.toLocaleString()} sq ft</span>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Footer */}
                                            <div className="property-footer">
                                                <div className="agent-info">
                                                    {property.agentAvatarUrl ? (
                                                        <div className="agent-avatar" style={{ backgroundImage: `url(${property.agentAvatarUrl})` }}></div>
                                                    ) : (
                                                        <div className="agent-avatar fallback-avatar"></div>
                                                    )}
                                                    <span className="agent-name">{property.agentName}</span>
                                                </div>
                                                <button className="view-details-btn">
                                                    View Details
                                                    <ArrowRight size={16} className="arrow-icon" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}

                    {/* Bottom CTA */}
                    <div className="properties-cta-container">
                        <button className="btn btn-outline properties-cta-btn" onClick={() => window.location.href = '/properties'}>
                            View All Properties
                        </button>
                    </div>

                </div>
            </div>
        </section>
    );
};

export default HotProperties;
