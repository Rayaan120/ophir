import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MapPin, Bed, Bath, Maximize, Phone, MessageCircle, Mail, ChevronLeft } from 'lucide-react';
import './PropertyDetails.css';

const PropertyDetails = () => {
    const { id } = useParams();
    const [property, setProperty] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeImage, setActiveImage] = useState(null);

    useEffect(() => {
        const fetchPropertyDetails = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const response = await fetch(`/api/properties/${id}`);
                if (!response.ok) {
                    if (response.status === 404) {
                        throw new Error('Property not found');
                    }
                    throw new Error('Failed to fetch property details');
                }
                const data = await response.json();
                setProperty(data);
                setActiveImage(data.mainImageUrl);
            } catch (err) {
                setError(err.message || 'Unable to load property details.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchPropertyDetails();
    }, [id]);

    const formatPrice = (price, currency = 'AED', period = '') => {
        if (!price) return 'Price on Request';
        const formattedPrice = new Intl.NumberFormat('en-AE').format(price);
        return `${currency} ${formattedPrice}${period}`;
    };

    if (isLoading) return (
        <div className="pd-loading">
            <div className="pd-loading-spinner"></div>
            <h3>Loading luxury property details...</h3>
        </div>
    );

    if (error || !property) return (
        <div className="pd-error">
            <h2>{error || 'Properties unavailable'}</h2>
            <p>We could not find the property you are looking for.</p>
            <Link to="/" className="pd-error-btn">Return Back</Link>
        </div>
    );

    // dynamicDetails is now provided securely by the backend API 

    const displayPricePrefix = property.listingType === 'NEW' ? 'Starting from ' : '';
    const badgeLabel = property.listingType === 'NEW' ? 'New Project' : `For ${property.listingType.toLowerCase()}`;

    return (
        <div className="property-details-page animate-fade-in">
            {/* Hero Section */}
            <section className="pd-hero">
                <div className="pd-hero-bg" style={{ backgroundImage: `url(${activeImage})` }}></div>
                <div className="pd-hero-overlay"></div>
                <div className="pd-hero-content">
                    <div className="pd-hero-left">
                        <Link to={-1} className="pd-badge" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', cursor: 'pointer', background: 'transparent', border: 'none', paddingLeft: 0 }}>
                            <ChevronLeft size={16} /> Back to Search
                        </Link>
                        <br />
                        <span className="pd-badge">{badgeLabel}</span>
                        <h1 className="pd-title">{property.title}</h1>
                        <div className="pd-location">
                            <MapPin size={18} className="pd-location-icon" />
                            <span>{property.location}</span>
                        </div>
                    </div>
                    <div className="pd-hero-right">
                        <span className="pd-price-label">Asking Price</span>
                        <div className="pd-price">
                            {displayPricePrefix && <span style={{ display: 'block', fontSize: '1rem', marginBottom: '4px' }}>{displayPricePrefix}</span>}
                            {formatPrice(property.price, property.currency, property.pricePeriod)}
                        </div>
                    </div>
                </div>
            </section>

            {/* Gallery Strip */}
            {property.gallery && property.gallery.length > 1 && (
                <div className="pd-gallery-strip">
                    {property.gallery.map((imgUrl, idx) => (
                        <div
                            key={idx}
                            className={`pd-thumb ${activeImage === imgUrl ? 'active' : ''}`}
                            style={{ backgroundImage: `url(${imgUrl})` }}
                            onClick={() => setActiveImage(imgUrl)}
                        ></div>
                    ))}
                </div>
            )}

            {/* Main Layout */}
            <div className="pd-container">
                <div className="pd-main-col">
                    {/* Quick Features Row */}
                    <div className="pd-quick-features">
                        {property.bedrooms > 0 && (
                            <div className="pd-feature-item">
                                <Bed size={24} />
                                <span>{property.bedrooms} Beds</span>
                            </div>
                        )}
                        {property.bathrooms > 0 && (
                            <div className="pd-feature-item">
                                <Bath size={24} />
                                <span>{property.bathrooms} Baths</span>
                            </div>
                        )}
                        {property.areaSqft > 0 && (
                            <div className="pd-feature-item">
                                <Maximize size={24} />
                                <span>{property.areaSqft} sq ft</span>
                            </div>
                        )}
                    </div>

                    {/* Property Details Grid */}
                    <div className="pd-section">
                        <h2 className="pd-section-title">Property Details</h2>
                        <div className="pd-details-grid">
                            {(property.dynamicDetails || []).map((detail, idx) => (
                                <div className="pd-detail-row" key={idx}>
                                    <span className="pd-detail-label">{detail.label}</span>
                                    <span className="pd-detail-value">{detail.value || '—'}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Description Block */}
                    {property.description && (
                        <div className="pd-section">
                            <h2 className="pd-section-title">Description</h2>
                            <div className="pd-description-text" dangerouslySetInnerHTML={{ __html: property.description.replace(/\n/g, '<br />') }} />
                        </div>
                    )}
                </div>

                {/* Right Sidebar CTA */}
                <div className="pd-sidebar">
                    <div className="pd-contact-card">
                        <div className="pd-card-type">{badgeLabel}</div>

                        <div className="pd-card-price">
                            {displayPricePrefix && <span style={{ display: 'block', paddingBottom: '4px' }}>{displayPricePrefix}</span>}
                            {formatPrice(property.price, property.currency, property.pricePeriod)}
                        </div>

                        <div className="pd-agent-block">
                            {property.agentAvatarUrl && (
                                <div className="pd-agent-avatar" style={{ backgroundImage: `url(${property.agentAvatarUrl})` }}></div>
                            )}
                            <div className="pd-agent-info">
                                <h4>{property.listedBy}</h4>
                                <p>Ophir Properties Advisor</p>
                            </div>
                        </div>

                        <div className="pd-cta-buttons">
                            <button className="pd-btn pd-btn-primary">
                                <Phone size={18} /> Call Now
                            </button>
                            <button className="pd-btn pd-btn-whatsapp">
                                <MessageCircle size={18} /> WhatsApp
                            </button>
                            <button className="pd-btn pd-btn-secondary">
                                <Mail size={18} /> Enquire Now
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PropertyDetails;
