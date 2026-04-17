import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
    CheckCircle2,
    ArrowRight
} from 'lucide-react';
import { Link } from 'react-router-dom';
import './ServicesPage.css';

const ServicesPage = () => {
    const { t, i18n } = useTranslation();
    useEffect(() => {
        // Scroll to top on mount is handled by ScrollToTop
    }, []);

    const scrollToSection = (id) => {
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };

    const services = [
        {
            title: t('servicesPage.svc1Title'),
            description: t('servicesPage.svc1Desc'),
            linkId: 'investment-advisory',
            image: '/services/1.png'
        },
        {
            title: t('servicesPage.svc2Title'),
            description: t('servicesPage.svc2Desc'),
            linkId: 'off-plan-access',
            image: '/services/2.png'
        },
        {
            title: t('servicesPage.svc3Title'),
            description: t('servicesPage.svc3Desc'),
            linkId: 'buying-assistance',
            image: '/services/3.png'
        },
        {
            title: t('servicesPage.svc4Title'),
            description: t('servicesPage.svc4Desc'),
            linkId: 'selling-resale',
            image: '/services/4.png'
        },
        {
            title: t('servicesPage.svc5Title'),
            description: t('servicesPage.svc5Desc'),
            linkId: 'property-management',
            image: '/services/6.png'
        },
        {
            title: t('servicesPage.svc6Title'),
            description: t('servicesPage.svc6Desc'),
            linkId: 'golden-visa',
            image: '/services/5.png' // Reusing 4 or keeping Unsplash. Using 4 for now as placeholder for 6.
        }
    ];

    return (
        <div className="services-page">
            {/* 1. Hero Section */}
            <section className="services-hero">
                <div className="services-hero-overlay"></div>
                <div className="services-hero-content animate-fade-in">
                    <div className="hero-text-wrapper">
                        <span className="small-label">{t('servicesPage.heroLabel')}</span>
                        <h1 className="hero-title">
                            <span className="hero-title-main">{t('servicesPage.heroTitle')}</span> <br />
                            <span className="gold-text">{t('servicesPage.heroTitleGold')}</span>
                        </h1>
                        <p className="hero-subtitle">
                            {t('servicesPage.heroSubtitle')}
                        </p>
                        <div className="hero-badges">
                            <span className="hero-badge"><CheckCircle2 size={16} /> {t('servicesPage.heroBadge1')}</span>
                            <span className="hero-badge"><CheckCircle2 size={16} /> {t('servicesPage.heroBadge2')}</span>
                            <span className="hero-badge"><CheckCircle2 size={16} /> {t('servicesPage.heroBadge3')}</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* 2. Services Overview Intro - Unique Redesign */}
            <section className="services-intro section-padding">
                <div className="container">
                    <div className="intro-spotlight-frame">
                        <div className="intro-bg-text">ADVISORY</div>

                        <div className="frame-corners">
                            <span className="corner top-left"></span>
                            <span className="corner top-right"></span>
                            <span className="corner bottom-left"></span>
                            <span className="corner bottom-right"></span>
                        </div>

                        <div className="intro-content-wrapper text-center">
                            <span className="small-label animate-fade-in">{t('servicesPage.introLabel')}</span>
                            <h2 className="section-heading animate-fade-in">
                                {t('servicesPage.introHeading')} <br />
                                <span className="gold-text">{t('servicesPage.introHeadingGold')}</span>
                            </h2>
                            <div className="gold-accent-line"></div>
                            <p className="lead-text section-text animate-fade-in">
                                {t('servicesPage.introText')}
                            </p>
                        </div>
                    </div>
                </div>
            </section>
            {/* 3. Core Services - Asymmetric Bento Matrix */}
            <section className="services-bento-section bg-card section-padding">
                <div className="container">
                    <div className="bento-matrix">
                        {services.map((service, index) => (
                            <div
                                key={index}
                                className={`bento-item bento-item-${index + 1}`}
                                onClick={() => scrollToSection(service.linkId)}
                            >
                                <div
                                    className="bento-bg-image"
                                    style={{ backgroundImage: `url(${service.image})` }}
                                ></div>
                                <div className="bento-overlay"></div>

                                <div className="bento-content">
                                    <div className="bento-header">
                                        <span className="bento-index">0{index + 1}</span>
                                    </div>

                                    <div className="bento-body">
                                        <h3 className="bento-title">
                                            {service.title.includes('&') ?
                                                service.title.split('&').map((text, i, arr) => (
                                                    <span key={i}>
                                                        {text}
                                                        {i < arr.length - 1 && <span className="normal-amp">&</span>}
                                                    </span>
                                                )) :
                                                service.title
                                            }
                                        </h3>
                                        <p className="bento-description">{service.description}</p>
                                    </div>

                                    <div className="bento-footer">
                                        <span className="bento-cta-text">{t('servicesPage.discover')}</span>
                                        <div className="bento-cta-icon">
                                            <ArrowRight size={18} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 4. Detailed Service Breakdown */}
            <section className="service-details section-padding">
                <div className="container">

                    {/* Service 1 */}
                    <div id="investment-advisory" className="service-detail-row text-left">
                        <div className="detail-content">
                            <h2>{t('servicesPage.svc1Title')}</h2>
                            <div className="gold-accent-line"></div>
                            <div className="detail-block">
                                <h4>{t('servicesPage.valueProp')}</h4>
                                <p>{t('servicesPage.svc1ValueProp')}</p>
                            </div>
                            <div className="detail-block">
                                <h4>{t('servicesPage.scope')}</h4>
                                <p>{t('servicesPage.svc1Scope')}</p>
                            </div>
                            <div className="detail-block">
                                <h4>{t('servicesPage.process')}</h4>
                                <p>{t('servicesPage.svc1Process')}</p>
                            </div>
                            <div className="detail-block">
                                <h4>{t('servicesPage.clientBenefits')}</h4>
                                <p>{t('servicesPage.svc1Benefits')}</p>
                            </div>
                        </div>
                        <div className="detail-image-wrapper rounded-container">
                            <img src={services[0].image} alt="Investment Advisory" className="detail-image" />
                        </div>
                    </div>

                    {/* Service 2 */}
                    <div id="off-plan-access" className="service-detail-row reverse text-left">
                        <div className="detail-content">
                            <h2>{t('servicesPage.svc2Title')}</h2>
                            <div className="gold-accent-line"></div>
                            <div className="detail-block">
                                <h4>{t('servicesPage.valueProp')}</h4>
                                <p>{t('servicesPage.svc2ValueProp')}</p>
                            </div>
                            <div className="detail-block">
                                <h4>{t('servicesPage.scope')}</h4>
                                <p>{t('servicesPage.svc2Scope')}</p>
                            </div>
                            <div className="detail-block">
                                <h4>{t('servicesPage.process')}</h4>
                                <p>{t('servicesPage.svc2Process')}</p>
                            </div>
                            <div className="detail-block">
                                <h4>{t('servicesPage.clientBenefits')}</h4>
                                <p>{t('servicesPage.svc2Benefits')}</p>
                            </div>
                        </div>
                        <div className="detail-image-wrapper rounded-container">
                            <img src={services[1].image} alt="Off-Plan Access" className="detail-image" />
                        </div>
                    </div>

                    {/* Service 3 */}
                    <div id="buying-assistance" className="service-detail-row text-left">
                        <div className="detail-content">
                            <h2>{t('servicesPage.svc3Title')}</h2>
                            <div className="gold-accent-line"></div>
                            <div className="detail-block">
                                <h4>{t('servicesPage.valueProp')}</h4>
                                <p>{t('servicesPage.svc3ValueProp')}</p>
                            </div>
                            <div className="detail-block">
                                <h4>{t('servicesPage.scope')}</h4>
                                <p>{t('servicesPage.svc3Scope')}</p>
                            </div>
                            <div className="detail-block">
                                <h4>{t('servicesPage.process')}</h4>
                                <p>{t('servicesPage.svc3Process')}</p>
                            </div>
                            <div className="detail-block">
                                <h4>{t('servicesPage.clientBenefits')}</h4>
                                <p>{t('servicesPage.svc3Benefits')}</p>
                            </div>
                        </div>
                        <div className="detail-image-wrapper rounded-container">
                            <img src={services[2].image} alt="Buying Assistance" className="detail-image" />
                        </div>
                    </div>

                    {/* Service 4 */}
                    <div id="selling-resale" className="service-detail-row reverse text-left">
                        <div className="detail-content">
                            <h2>{t('servicesPage.svc4Title')}</h2>
                            <div className="gold-accent-line"></div>
                            <div className="detail-block">
                                <h4>{t('servicesPage.valueProp')}</h4>
                                <p>{t('servicesPage.svc4ValueProp')}</p>
                            </div>
                            <div className="detail-block">
                                <h4>{t('servicesPage.scope')}</h4>
                                <p>{t('servicesPage.svc4Scope')}</p>
                            </div>
                            <div className="detail-block">
                                <h4>{t('servicesPage.process')}</h4>
                                <p>{t('servicesPage.svc4Process')}</p>
                            </div>
                            <div className="detail-block">
                                <h4>{t('servicesPage.clientBenefits')}</h4>
                                <p>{t('servicesPage.svc4Benefits')}</p>
                            </div>
                        </div>
                        <div className="detail-image-wrapper rounded-container">
                            <img src={services[3].image} alt="Selling & Resale" className="detail-image" />
                        </div>
                    </div>

                    {/* Service 5 */}
                    <div id="property-management" className="service-detail-row text-left">
                        <div className="detail-content">
                            <h2>{t('servicesPage.svc5Title')}</h2>
                            <div className="gold-accent-line"></div>
                            <div className="detail-block">
                                <h4>{t('servicesPage.valueProp')}</h4>
                                <p>{t('servicesPage.svc5ValueProp')}</p>
                            </div>
                            <div className="detail-block">
                                <h4>{t('servicesPage.scope')}</h4>
                                <p>{t('servicesPage.svc5Scope')}</p>
                            </div>
                            <div className="detail-block">
                                <h4>{t('servicesPage.process')}</h4>
                                <p>{t('servicesPage.svc5Process')}</p>
                            </div>
                            <div className="detail-block">
                                <h4>{t('servicesPage.clientBenefits')}</h4>
                                <p>{t('servicesPage.svc5Benefits')}</p>
                            </div>
                        </div>
                        <div className="detail-image-wrapper rounded-container">
                            <img src={services[4].image} alt="Property Management" className="detail-image" />
                        </div>
                    </div>

                    {/* Service 6 */}
                    <div id="golden-visa" className="service-detail-row reverse text-left">
                        <div className="detail-content">
                            <h2>
                                {t('servicesPage.svc6DetailTitle').includes('&') ?
                                    t('servicesPage.svc6DetailTitle').split('&').map((text, i, arr) => (
                                        <span key={i}>
                                            {text}
                                            {i < arr.length - 1 && <span className="normal-amp">&</span>}
                                        </span>
                                    )) :
                                    t('servicesPage.svc6DetailTitle')
                                }
                            </h2>
                            <div className="gold-accent-line"></div>
                            <div className="detail-block">
                                <h4>{t('servicesPage.valueProp')}</h4>
                                <p>{t('servicesPage.svc6ValueProp')}</p>
                            </div>
                            <div className="detail-block">
                                <h4>{t('servicesPage.scope')}</h4>
                                <p>{t('servicesPage.svc6Scope')}</p>
                            </div>
                            <div className="detail-block">
                                <h4>{t('servicesPage.process')}</h4>
                                <p>{t('servicesPage.svc6Process')}</p>
                            </div>
                            <div className="detail-block">
                                <h4>{t('servicesPage.clientBenefits')}</h4>
                                <p>{t('servicesPage.svc6Benefits')}</p>
                            </div>
                        </div>
                        <div className="detail-image-wrapper rounded-container">
                            <img src={services[5].image} alt="Golden Visa" className="detail-image" />
                        </div>
                    </div>

                </div>
            </section>



            {/* 5. Final CTA Section - Aligned with Homepage */}
            <section className="services-cta-horizon">
                <div className="cta-horizon-bg" style={{ backgroundImage: "url('/Dubai Design District 6.jpg')" }}></div>
                <div className="cta-horizon-overlay"></div>

                <div className="container horizon-content animate-fade-in">
                    <div className="horizon-text-box">
                        <span className="small-label animate-fade-in" style={{ textAlign: 'center', margin: '0 auto 16px auto' }}>{t('servicesPage.ctaLabel')}</span>
                        <h2 className="horizon-title animate-reveal">
                            {t('servicesPage.ctaTitle')} <br />
                            {t('servicesPage.ctaWith')} <span className="shimmer-gold">{t('servicesPage.ctaTitleGold')}</span>
                        </h2>
                        <p className="horizon-subtitle animate-fade-in">
                            {t('servicesPage.ctaSubtitle')}
                        </p>
                    </div>

                    <div className="horizon-actions animate-fade-in">
                        <div className="magnetic-wrapper">
                            <Link to={`/${i18n.language}/contact`} className="btn btn-primary cta-magnetic">
                                {t('servicesPage.ctaBtn1')}
                            </Link>
                        </div>
                        <div className="magnetic-wrapper">
                            <Link to={`/${i18n.language}/buy`} className="btn btn-outline cta-magnetic">
                                <span className="gold-text">{t('servicesPage.ctaBtn2')}</span>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default ServicesPage;
