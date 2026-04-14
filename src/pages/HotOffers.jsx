import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';
import { Heart, MapPin, Bed, Bath, Maximize, ArrowRight, Info, Calendar, MessageCircle, Sparkles } from 'lucide-react';
import { useCurrency } from '../context/CurrencyContext';
import './HotOffers.css';

const HotOffers = () => {
    const { t, i18n } = useTranslation();
    const navigate = useNavigate();
    const { formatPrice: globalFormatPrice, selectedCurrency } = useCurrency();

    const [properties, setProperties] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeFilter, setActiveFilter] = useState('All');

    useEffect(() => {
        const fetchHotOffers = async () => {
            setIsLoading(true);
            setError(null);
            try {
                // 1. Fetch the "Hot" properties (matches homepage)
                const hotRes = await fetch('/api/properties?hot=true');
                const hotData = hotRes.ok ? await hotRes.json() : { items: [] };
                const hotItems = hotData.items || (Array.isArray(hotData) ? hotData : []);

                // 2. Fetch specific properties for Sale
                const sellRes = await fetch('/api/properties?type=sell&pageSize=4');
                const sellData = sellRes.ok ? await sellRes.json() : { items: [] };
                const sellItems = sellData.items || [];

                // 3. Fetch specific properties for New Projects
                const newRes = await fetch('/api/properties?type=new&pageSize=4');
                const newData = newRes.ok ? await newRes.json() : { items: [] };
                const newItems = newData.items || [];

                // 4. Fetch additional general properties
                const extraRes = await fetch('/api/properties?pageSize=10'); 
                const extraData = extraRes.ok ? await extraRes.json() : { items: [] };
                const extraItems = extraData.items || [];

                // Combine them
                const rawCombined = [...hotItems, ...sellItems, ...newItems, ...extraItems];

                // Filter out duplicates
                const uniqueProps = [];
                const seenIds = new Set();
                for (const p of rawCombined) {
                    if (!seenIds.has(p.id)) {
                        seenIds.add(p.id);
                        uniqueProps.push(p);
                    }
                }

                setProperties(uniqueProps);
            } catch (err) {
                console.error("Hot Offers Fetch Error:", err);
                setError(t('buyPage.errorLoad'));
            } finally {
                setIsLoading(false);
            }
        };

        fetchHotOffers();
    }, [t]);

    const formatPrice = (price, currency = 'AED') => {
        if (price === null || price === undefined) return t('hotOffersPage.priceOnRequest');
        return globalFormatPrice(price, currency);
    };

    // Derived Data
    const displayProperties = properties.filter(p => {
        if (activeFilter === 'All') return true;
        if (activeFilter === 'Sale' && (p.type === 'sell' || p.category === 'sale' || p.category === 'sell')) return true;
        if (activeFilter === 'Rent' && (p.type === 'rent' || p.category === 'rent')) return true;
        if (activeFilter === 'New Projects' && (p.isOffPlan || p.category === 'new')) return true;
        // Fallback checks just in case data shape varies
        if (activeFilter === 'Sale' && p.pricePeriod === null) return true;
        if (activeFilter === 'Rent' && p.pricePeriod) return true;
        return false;
    });

    const featuredOffer = displayProperties.length > 0 ? displayProperties[0] : null;
    const gridOffers = displayProperties.length > 1 ? displayProperties.slice(1) : [];

    return (
        <div className="hot-offers-page animate-fade-in">
            {/* 1. Hero Section */}
            <section className="hot-offers-hero">
                <div className="hot-offers-hero-content">
                    <span className="hot-badge">{t('hotOffersPage.heroBadge')}</span>
                    <h1 className="hot-offers-title">{t('hotOffersPage.heroTitle')}</h1>
                    <p className="hot-offers-subtext">{t('hotOffersPage.heroSubtext')}</p>
                    <div className="hot-offers-stats">
                        <span>{t('hotOffersPage.stat1')}</span>
                        <span>{t('hotOffersPage.stat2')}</span>
                        <span>{t('hotOffersPage.stat3')}</span>
                    </div>
                </div>
            </section>

            {/* 2. Monthly Note */}
            <div className="hot-offers-note">
                <div className="note-inner">
                    <Info size={16} className="note-icon" />
                    {t('hotOffersPage.monthlyUpdate')}
                </div>
            </div>

            {/* Main Content Area */}
            <main className="hot-offers-main">
                
                {/* Optional Filters */}
                {properties.length > 0 && (
                    <div className="hot-offers-filters">
                        {['All', 'Sale', 'Rent', 'New Projects'].map(filter => (
                            <button 
                                key={filter}
                                className={`hot-filter-btn ${activeFilter === filter ? 'active' : ''}`}
                                onClick={() => setActiveFilter(filter)}
                            >
                                {t(filter === 'All' ? 'hotOffersPage.optAll' 
                                 : filter === 'Sale' ? 'hotOffersPage.optSale' 
                                 : filter === 'Rent' ? 'hotOffersPage.optRent' 
                                 : 'hotOffersPage.optNew')}
                            </button>
                        ))}
                    </div>
                )}

                {isLoading ? (
                    <div className="hot-loading">
                        <div className="hot-spinner"></div>
                        <p>{t('buyPage.loading') || 'Loading...'}</p>
                    </div>
                ) : error ? (
                    <div className="hot-offers-empty">
                        <p>{error}</p>
                    </div>
                ) : displayProperties.length === 0 ? (
                    <div className="hot-offers-empty">
                        <p>{t('hotOffersPage.noOffers')}</p>
                        <Link to={`/${i18n.language}/buy`} className="btn-primary-red" style={{ flex: 'none', display: 'inline-block' }}>
                            {t('hotOffersPage.browseAll')}
                        </Link>
                    </div>
                ) : (
                    <>
                        {/* Featured Spotlight (1st Property) */}
                        {featuredOffer && (
                            <div className="featured-spotlight">
                                <div className="featured-img-col">
                                    <img src={featuredOffer.mainImageUrl} alt={featuredOffer.title} />
                                    <div className="featured-badges">
                                        <span className="badge-featured-red">{t('hotOffersPage.badgeHot')}</span>
                                        {featuredOffer.labels && featuredOffer.labels.length > 0 && (
                                            <span className="badge-featured-dark">{featuredOffer.labels[0]}</span>
                                        )}
                                    </div>
                                </div>
                                <div className="featured-info-col">
                                    <div className="featured-location">
                                        <MapPin size={16} />
                                        {featuredOffer.location || 'Dubai, UAE'}
                                    </div>
                                    <h2 className="featured-title">{featuredOffer.title}</h2>
                                    <div className="featured-price">
                                        {formatPrice(featuredOffer.price, featuredOffer.currency)}
                                        {featuredOffer.pricePeriod && ` / ${featuredOffer.pricePeriod}`}
                                    </div>
                                    <p className="featured-desc">
                                        {t('hotOffersPage.featuredSubtitle')}
                                    </p>
                                    
                                    <div className="featured-features">
                                        {featuredOffer.bedrooms > 0 && (
                                            <div className="f-item">
                                                <span className="f-item-val"><Bed size={18} /> {featuredOffer.bedrooms}</span>
                                                <span className="f-item-label">{t('hotOffersPage.bed')}</span>
                                            </div>
                                        )}
                                        {featuredOffer.bathrooms > 0 && (
                                            <div className="f-item">
                                                <span className="f-item-val"><Bath size={18} /> {featuredOffer.bathrooms}</span>
                                                <span className="f-item-label">{t('hotOffersPage.bath')}</span>
                                            </div>
                                        )}
                                        {featuredOffer.areaSqft > 0 && (
                                            <div className="f-item">
                                                <span className="f-item-val"><Maximize size={18} /> {featuredOffer.areaSqft}</span>
                                                <span className="f-item-label">{t('hotOffersPage.sqft')}</span>
                                            </div>
                                        )}
                                    </div>

                                    <div className="featured-actions">
                                        <Link to={`/${i18n.language}/property/${featuredOffer.id}`} className="btn-primary-red">
                                            {t('hotOffersPage.viewDetails')}
                                        </Link>
                                        <Link to={`/${i18n.language}/contact`} className="btn-outline-red">
                                            {t('hotOffersPage.enquireNow')}
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Remaining Grid */}
                        {gridOffers.length > 0 && (
                            <div className="hot-offers-grid">
                                {gridOffers.map(property => (
                                    <div key={property.id} className="hot-card">
                                        <div className="hc-img">
                                            <img src={property.mainImageUrl} alt={property.title} />
                                            <div className="hc-badges">
                                                <span className="badge-featured-red" style={{ padding: '4px 8px', fontSize: '0.7rem' }}>
                                                    {t('hotOffersPage.badgeHot')}
                                                </span>
                                                {property.labels && property.labels.length > 0 && (
                                                    <span className="badge-featured-dark" style={{ padding: '4px 8px', fontSize: '0.7rem' }}>
                                                        {property.labels[0]}
                                                    </span>
                                                )}
                                            </div>
                                            <div className="hc-price-tag">
                                                {formatPrice(property.price, property.currency)}
                                                {property.pricePeriod && ` / ${property.pricePeriod}`}
                                            </div>
                                        </div>
                                        <div className="hc-body">
                                            <div className="hc-location">
                                                <MapPin size={14} />
                                                {property.location || 'Dubai, UAE'}
                                            </div>
                                            <h3 className="hc-title">{property.title}</h3>
                                            
                                            <div className="hc-features">
                                                {property.bedrooms > 0 && (
                                                    <span className="hc-feat"><Bed size={14} /> {property.bedrooms} {t('hotOffersPage.bed')}</span>
                                                )}
                                                {property.bathrooms > 0 && (
                                                    <span className="hc-feat"><Bath size={14} /> {property.bathrooms} {t('hotOffersPage.bath')}</span>
                                                )}
                                            </div>

                                            <div className="hc-footer">
                                                <Link to={`/${i18n.language}/property/${property.id}`} className="hc-btn">
                                                    {t('hotOffersPage.viewDetails')} <ArrowRight size={14} />
                                                </Link>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                    <div style={{ width: '28px', height: '28px', borderRadius: '50%', backgroundColor: '#eee', backgroundImage: `url(${property.agentAvatarUrl || ''})`, backgroundSize: 'cover' }}></div>
                                                    <span style={{ fontSize: '0.85rem', color: 'var(--text-color)' }}>{property.agentName || 'Ophir Advisor'}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </>
                )}
            </main>

            {/* Final CTA Section - Consistent with the rest of the site */}
            <section className="listing-final-cta" style={{ backgroundImage: "url('/hot/yacht-club-exterior.jpg')" }}>
                <div className="cta-overlay" style={{ background: "linear-gradient(135deg, rgba(30, 26, 52, 0.95) 0%, rgba(194, 24, 24, 0.2) 100%)" }}></div>
                <div className="cta-container">
                    <div className="cta-content animate-slide-up">

                        <h2 className="cta-title">{t('hotOffersPage.ctaTitle')}</h2>
                        <p className="cta-desc">{t('hotOffersPage.ctaDesc')}</p>
                        
                        <div className="cta-buttons">
                            <Link to={`/${i18n.language}/contact`} className="btn-hot-premium">
                                <Calendar size={18} />
                                <span>{t('hotOffersPage.ctaBtn1')}</span>
                            </Link>
                            <a href="https://wa.me/971000000000" target="_blank" rel="noreferrer" className="btn-hot-outline">
                                <MessageCircle size={18} />
                                <span>{t('hotOffersPage.ctaBtn2')}</span>
                            </a>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default HotOffers;
