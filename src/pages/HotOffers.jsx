import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Calendar, MessageCircle, Sparkles } from 'lucide-react';
import './HotOffers.css';

const HotOffers = () => {
    const { t, i18n } = useTranslation();
    const offerImages = [
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

            <main className="hot-offers-showcase">
                <div className="hot-offers-showcase-header">
                    <span className="hot-offers-kicker"><Sparkles size={16} /> Curated Hot Offers</span>
                    <h2>Limited Opportunities, Presented in Full</h2>
                    <p>
                        Explore the complete offer visuals exactly as intended, with every detail visible before
                        connecting with our advisory team.
                    </p>
                </div>

                <div className="hot-offer-gallery">
                    {offerImages.map((offer, index) => (
                        <article key={offer.src} className={`hot-offer-image-card hot-offer-image-card-${index + 1}`}>
                            <div className="hot-offer-card-label">
                                <span className="hot-offer-index">0{index + 1}</span>
                                <div>
                                    <p>{offer.meta}</p>
                                    <h3>{offer.title}</h3>
                                </div>
                            </div>
                            <figure className="hot-offer-image-frame">
                                <img src={offer.src} alt={offer.title} />
                            </figure>
                        </article>
                    ))}
                </div>
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
                            <a href="https://wa.me/9717758953106" target="_blank" rel="noreferrer" className="btn-hot-premium">
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
