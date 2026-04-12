import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams, Link } from 'react-router-dom';
import { MapPin, Bed, Bath, Maximize, Phone, MessageCircle, Mail, ChevronLeft, X, CheckCircle, Info } from 'lucide-react';
import { useCurrency } from '../context/CurrencyContext';
import './PropertyDetails.css';

const PropertyDetails = () => {
    const { i18n } = useTranslation();
    const { id } = useParams();
    const [property, setProperty] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeImage, setActiveImage] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [formStatus, setFormStatus] = useState('idle'); // idle, submitting, success, error
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phone: '',
        message: ''
    });

    const { formatPrice: globalFormatPrice, selectedCurrency } = useCurrency();

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

        // Automated Enquiry Pop-up after 3 seconds
        const timer = setTimeout(() => {
            setShowModal(true);
        }, 3000);

        return () => clearTimeout(timer);
    }, [id]);

    const formatPrice = (price, currency = 'AED', period = '') => {
        return globalFormatPrice(price, currency, period);
    };

    const handleCall = () => {
        const phone = property.agentPhone || '+97145576289';
        window.location.href = `tel:${phone}`;
    };

    const handleWhatsApp = () => {
        // More robust cleaning: remove everything except digits
        const phone = (property.agentPhone || '+97145576289').replace(/\D/g, '');
        const message = `Hello, I'm interested in "${property.title}" (Ref: ${property.id}). Could you please provide more information?`;
        const encodedMessage = encodeURIComponent(message);
        window.open(`https://wa.me/${phone}?text=${encodedMessage}`, '_blank');
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmitEnquiry = async (e) => {
        e.preventDefault();
        setFormStatus('submitting');
        try {
            const response = await fetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formData,
                    interest: `${property.listingType} - ${property.title} (Ref: ${property.id})`,
                    agentEmail: property.agentEmail,
                    agentName: property.listedBy,
                    source: `Property Details Page: ${property.title}`
                })
            });

            if (response.ok) {
                setFormStatus('success');
                setTimeout(() => {
                    setShowModal(false);
                    setFormStatus('idle');
                    setFormData({ fullName: '', email: '', phone: '', message: '' });
                }, 3000);
            } else {
                setFormStatus('error');
            }
        } catch (err) {
            setFormStatus('error');
        }
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
            <Link to={`/${i18n.language}`} className="pd-error-btn">Return Back</Link>
        </div>
    );

    // dynamicDetails is now provided securely by the backend API 

    const displayPricePrefix = property.listingType === 'NEW' ? 'Starting from' : '';
    const badgeLabel = property.listingType === 'NEW' ? 'New Project' : `For ${property.listingType.toLowerCase()}`;

    return (
        <div className="property-details-page">
            <div className="animate-fade-in">
                {/* Hero Section */}
                <section className="pd-hero">
                    <div className="pd-hero-bg" style={{ backgroundImage: `url(${activeImage})` }}></div>
                    <div className="pd-hero-overlay"></div>
                    <div className="pd-hero-content">
                        <div className="pd-hero-left">
                            <Link to={-1} className="pd-back-link">
                                <ChevronLeft size={16} className="pd-back-icon" />
                                <span>Back to Search</span>
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
                            <div className="pd-price-stack">
                                <span className="pd-price-label">Asking Price</span>
                                <div className="pd-price" style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                                    {displayPricePrefix && <span style={{ fontSize: '1rem', marginBottom: '4px' }}>{displayPricePrefix}</span>}
                                    <span>{formatPrice(property.price, property.currency, property.pricePeriod)}</span>
                                    {selectedCurrency !== 'AED' && property.price && (
                                        <span style={{ fontSize: '0.85rem', color: 'rgba(255, 255, 255, 0.7)', marginTop: '4px', fontWeight: 'normal' }}>
                                            Original: AED {new Intl.NumberFormat('en-AE').format(property.price)}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Gallery Strip */}
                {property.gallery && property.gallery.length > 1 && (
                    <div className="pd-gallery-strip">
                        {property.gallery.map((img, index) => (
                            <div
                                key={index}
                                className={`pd-thumb ${activeImage === img ? 'active' : ''}`}
                                style={{ backgroundImage: `url(${img})` }}
                                onClick={() => setActiveImage(img)}
                            ></div>
                        ))}
                    </div>
                )}

                {/* Main Content Sections */}
                <div className="pd-container">
                    <div className="pd-main">
                        {/* Quick Features */}
                        <div className="pd-quick-features">
                            {property.bedrooms !== undefined && (
                                <div className="pd-feature-item">
                                    <Bed size={24} />
                                    <span>{property.bedrooms || 'Studio'} Beds</span>
                                </div>
                            )}
                            {property.bathrooms && (
                                <div className="pd-feature-item">
                                    <Bath size={24} />
                                    <span>{property.bathrooms} Baths</span>
                                </div>
                            )}
                            {property.areaSqft && (
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

                        {/* Currency Disclaimer */}
                        {selectedCurrency !== 'AED' && (
                            <div className="pd-section" style={{ marginTop: '20px', padding: '15px', backgroundColor: 'rgba(212, 175, 55, 0.05)', borderLeft: '3px solid var(--gold-primary)', borderRadius: '4px' }}>
                                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                                    <Info size={20} color="var(--gold-primary)" style={{ flexShrink: 0, marginTop: '2px' }} />
                                    <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                                        Prices shown in <strong>{selectedCurrency}</strong> are approximate and based on latest available exchange rates. All transactions will be processed in the original listing currency (AED).
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Right Sidebar CTA */}
                    <div className="pd-sidebar">
                        <div className="pd-contact-card">
                            <div className="pd-card-type">{badgeLabel}</div>

                            <div className="pd-card-price" style={{ display: 'flex', flexDirection: 'column' }}>
                                {displayPricePrefix && <span style={{ fontSize: '1rem', paddingBottom: '4px' }}>{displayPricePrefix}</span>}
                                <span>{formatPrice(property.price, property.currency, property.pricePeriod)}</span>
                                {selectedCurrency !== 'AED' && property.price && (
                                    <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '4px', fontWeight: 'normal' }}>
                                        Original: AED {new Intl.NumberFormat('en-AE').format(property.price)}
                                    </span>
                                )}
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
                                <button className="pd-btn pd-btn-primary" onClick={handleCall}>
                                    <Phone size={18} /> Call Now
                                </button>
                                <button className="pd-btn pd-btn-whatsapp" onClick={handleWhatsApp}>
                                    <MessageCircle size={18} /> WhatsApp
                                </button>
                                <button className="pd-btn pd-btn-secondary" onClick={() => setShowModal(true)}>
                                    <Mail size={18} /> Enquire Now
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Enquiry Modal */}
            {showModal && (
                <div className="pd-modal-overlay" onClick={() => formStatus !== 'submitting' && setShowModal(false)}>
                    <div className="pd-modal-content" onClick={e => e.stopPropagation()}>
                        <button className="pd-modal-close" onClick={() => setShowModal(false)}>
                            <X size={24} />
                        </button>

                        <div className="pd-modal-header">
                            <p className="pd-modal-subtitle">{property.title}</p>
                        </div>

                        {formStatus === 'success' ? (
                            <div className="pd-form-success animate-fade-in">
                                <CheckCircle size={60} color="var(--gold-primary)" />
                                <h3>Thank You!</h3>
                                <p>Your enquiry has been sent. An advisor will contact you shortly.</p>
                            </div>
                        ) : (
                            <form className="pd-enquiry-form" onSubmit={handleSubmitEnquiry}>
                                <div className="pd-form-group">
                                    <label>Full Name</label>
                                    <input
                                        type="text" name="fullName" required
                                        placeholder="Your name"
                                        value={formData.fullName} onChange={handleInputChange}
                                    />
                                </div>
                                <div className="pd-form-group">
                                    <label>Email Address</label>
                                    <input
                                        type="email" name="email" required
                                        placeholder="name@example.com"
                                        value={formData.email} onChange={handleInputChange}
                                    />
                                </div>
                                <div className="pd-form-group">
                                    <label>Phone Number</label>
                                    <input
                                        type="tel" name="phone" required
                                        placeholder="+971 XX XXX XXXX"
                                        value={formData.phone} onChange={handleInputChange}
                                    />
                                </div>
                                <div className="pd-form-group">
                                    <label>Message</label>
                                    <textarea
                                        name="message" required
                                        placeholder="I'm interested in this property..."
                                        rows="4"
                                        value={formData.message} onChange={handleInputChange}
                                    ></textarea>
                                </div>

                                {formStatus === 'error' && (
                                    <p className="pd-form-error">Something went wrong. Please try again or use WhatsApp.</p>
                                )}

                                <button
                                    type="submit"
                                    className="pd-btn pd-btn-primary"
                                    disabled={formStatus === 'submitting'}
                                >
                                    {formStatus === 'submitting' ? 'Sending...' : 'Send Enquiry'}
                                </button>
                            </form>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default PropertyDetails;
