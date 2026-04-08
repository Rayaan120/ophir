import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import './ExplorePrimeCommunities.css';

const ExplorePrimeCommunities = () => {
    const [activeId, setActiveId] = useState(1);
    const { t, i18n } = useTranslation();
    const navigate = useNavigate();
    const trackRef = useRef(null);

    const communities = [
        {
            id: 1,
            name: t('explore.dubaiTitle'),
            tagline: t('explore.dubaiTagline'),
            desc: t('explore.dubaiDesc'),
            img: '/palm-jumeirah-img.jpg',
            listings: t('explore.dubaiListings')
        },
        {
            id: 2,
            name: t('explore.abudhabiTitle'),
            tagline: t('explore.abudhabiTagline'),
            desc: t('explore.abudhabiDesc'),
            img: '/zayed-national-museum-abu-dhabi-img.jpg',
            listings: t('explore.abudhabiListings')
        },
        {
            id: 3,
            name: t('explore.rakTitle'),
            tagline: t('explore.rakTagline'),
            desc: t('explore.rakDesc'),
            img: '/wynn-al-marjan-img.png',
            listings: t('explore.rakListings')
        }
    ];

    const nextSlide = () => {
        setActiveId((prev) => (prev % communities.length) + 1);
        if (trackRef.current) {
            trackRef.current.scrollBy({ left: 350, behavior: 'smooth' });
        }
    };

    const prevSlide = () => {
        setActiveId((prev) => (prev - 2 + communities.length) % communities.length + 1);
        if (trackRef.current) {
            trackRef.current.scrollBy({ left: -350, behavior: 'smooth' });
        }
    };

    return (
        <section className="explore-prime-showcase">
            <div className="container relative z-10 h-full">
                <div className="explore-prime-grid">
                    
                    {/* Left: Dark Static Content Panel */}
                    <div className="ep-left-panel fade-in">
                        <div className="ep-accent-line-top"></div>
                        
                        <div className="ep-content-inner">
                            <h2 className="ep-main-title tracking-widest uppercase">
                                {t('explore.exploreHeader')}
                            </h2>
                            <p className="ep-main-desc text-gray-300 leading-relaxed">
                                {t('explore.exploreDesc')}
                            </p>

                            <div className="ep-btn-wrapper mt-8">
                                <button className="btn btn-primary cinematic-btn inline-flex items-center" onClick={() => navigate(`/${i18n.language}/communities`)}>
                                    <span>{t('explore.exploreBtn')}</span>
                                    <ArrowRight size={20} className="btn-icon ml-3" />
                                </button>
                                <div className="ep-nav-arrows">
                                    <button className="ep-circle-btn" onClick={prevSlide} aria-label="Previous">
                                        <ArrowLeft size={18} />
                                    </button>
                                    <button className="ep-circle-btn" onClick={nextSlide} aria-label="Next">
                                        <ArrowRight size={18} />
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Subtle abstract map-line graphic at the bottom */}
                        <div className="ep-map-graphic">
                            <svg viewBox="0 0 200 100" className="ep-map-svg" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="1">
                                <path d="M0,50 Q40,20 80,60 T160,40 T220,80" />
                                <path d="M-20,30 Q30,70 70,30 T150,50 T200,20" />
                                <path d="M20,90 Q60,40 100,80 T180,60 T240,90" />
                                <circle cx="80" cy="60" r="3" fill="rgba(212, 175, 55, 0.3)" />
                                <circle cx="150" cy="50" r="2" fill="rgba(212, 175, 55, 0.3)" />
                            </svg>
                        </div>
                    </div>

                    {/* Right: Community Cards and Nav */}
                    <div className="ep-right-section">
                        <div className="ep-cards-track" ref={trackRef}>
                            {communities.map((item) => (
                                <motion.div 
                                    key={item.id} 
                                    className={`ep-card ${activeId === item.id ? 'active' : ''}`}
                                    onClick={() => setActiveId(item.id)}
                                >
                                    <div className="ep-card-bg" style={{ backgroundImage: `url(${item.img})` }}></div>
                                    <div className="ep-card-overlay"></div>
                                    
                                    <div className="ep-card-content">
                                        <h3 className="ep-card-title">{item.name}</h3>
                                        <div className="ep-card-accent-line"></div>
                                        <div className="ep-card-text-wrapper">
                                            <h4 className="ep-card-tagline">{item.tagline}</h4>
                                            <p className="ep-card-desc">{item.desc}</p>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>

                        {/* Slider / Navigation Controls */}
                        <div className="ep-slider-nav">
                            <div className="ep-nav-dots">
                                {communities.map(item => (
                                    <span 
                                        key={item.id} 
                                        className={`ep-dot ${activeId === item.id ? 'active' : ''}`}
                                        onClick={() => setActiveId(item.id)}
                                    ></span>
                                ))}
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
};

export default ExplorePrimeCommunities;
