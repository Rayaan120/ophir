import React, { useRef, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { ChevronLeft, ChevronRight, Phone, MessageCircle } from 'lucide-react';
import './About.css';

const MeetOurTeam = () => {
    const { t } = useTranslation();
    const sliderRef = useRef(null);
    const [activeIndex, setActiveIndex] = useState(0);
    const [isMobile, setIsMobile] = useState(false);
    const [swipeDirection, setSwipeDirection] = useState(null); // 'next' or 'prev' or null

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth <= 768);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    const handleScroll = () => {
        if (!isMobile && sliderRef.current) {
            const { scrollLeft, scrollWidth, clientWidth } = sliderRef.current;
            const totalItems = team.length;
            const scrollPercent = Math.abs(scrollLeft) / (scrollWidth - clientWidth);
            const index = Math.min(totalItems - 1, Math.round(scrollPercent * (totalItems - 1)));
            if (index !== activeIndex) setActiveIndex(index);
        }
    };

    const scrollToIndex = (index) => {
        if (sliderRef.current) {
            const { scrollWidth, clientWidth } = sliderRef.current;
            const target = (index / (team.length - 1)) * (scrollWidth - clientWidth);
            sliderRef.current.scrollTo({ left: target, behavior: 'smooth' });
        }
    };

    const nextCard = () => {
        if (activeIndex < team.length - 1) {
            setSwipeDirection('next');
            setTimeout(() => {
                setActiveIndex(prev => prev + 1);
                setSwipeDirection(null);
            }, 300);
        }
    };

    const prevCard = () => {
        if (activeIndex > 0) {
            setSwipeDirection('prev');
            setTimeout(() => {
                setActiveIndex(prev => prev - 1);
                setSwipeDirection(null);
            }, 300);
        }
    };

    const scrollLeftFn = () => isMobile ? prevCard() : (sliderRef.current && sliderRef.current.scrollBy({ left: -350, behavior: 'smooth' }));
    const scrollRight = () => isMobile ? nextCard() : (sliderRef.current && sliderRef.current.scrollBy({ left: 350, behavior: 'smooth' }));

    const team = [
        { nameKey: 'm1Name', roleKey: 'm1Role', image: '/team/ziad .png', phone: '+971501234567', whatsapp: '971501234567' },
        { nameKey: 'm2Name', roleKey: 'm2Role', image: '/team/rami.png', phone: '+971501234568', whatsapp: '971501234568' },
        { nameKey: 'm3Name', roleKey: 'm3Role', image: '/team/alexandra.png', phone: '+971501234569', whatsapp: '971501234569' },
        { nameKey: 'm5Name', roleKey: 'm5Role', image: '/team/zelia.png', phone: '+971501234571', whatsapp: '971501234571' },
        { nameKey: 'm4Name', roleKey: 'm4Role', image: '/team/zaydoon.png', phone: '+971501234570', whatsapp: '971501234570' },
        { nameKey: 'm6Name', roleKey: 'm6Role', image: '/team/nader.png', phone: '+971501234572', whatsapp: '971501234572' },
        { nameKey: 'm7Name', roleKey: 'm7Role', image: '/team/maen.png', phone: '+971501234573', whatsapp: '971501234573' },
        { nameKey: 'm8Name', roleKey: 'm8Role', image: '/team/ivan.png', phone: '+971501234574', whatsapp: '971501234574' },
        { nameKey: 'm9Name', roleKey: 'm9Role', image: '/team/lia.png', phone: '+971501234575', whatsapp: '971501234575' },
        { nameKey: 'm10Name', roleKey: 'm10Role', image: '/team/maryam.png', phone: '+971501234576', whatsapp: '971501234576' },
        { nameKey: 'm11Name', roleKey: 'm11Role', image: '/team/basak.png', phone: '+971501234577', whatsapp: '971501234577' },
        { isMore: true }
    ];

    return (
        <section className="about-section team-section-bg">
            <div className="about-container team-layout">

                <div className="team-intro">
                    <h2 className="section-title">{t('leadership.title')}</h2>
                    <div className="gold-accent-line"></div>
                    <p className="team-desc">{t('leadership.desc')}</p>
                </div>

                <div className={`team-slider-container ${isMobile ? 'deck-mode' : ''}`}>
                    <div 
                        className="team-slider" 
                        ref={sliderRef} 
                        onScroll={handleScroll}
                    >
                        {team.map((member, idx) => {
                            // In mobile deck mode, render current card and the one below it
                            const isCurrent = idx === activeIndex;
                            const isNext = idx === activeIndex + 1;
                            const isPrev = idx === activeIndex - 1;

                            if (isMobile) {
                                // Only show current card (animating out) and the next one (waiting below)
                                // If we are swiping BACK, we show the previous card below?
                                // User said "appear one by one below it".
                                if (!isCurrent && !isNext && !isPrev) return null;
                            }

                            const cardClasses = `team-card ${isMobile ? 'deck-card' : ''} ${isCurrent ? 'current' : ''} ${isNext ? 'next-under' : ''} ${isPrev ? 'prev-under' : ''} ${isCurrent && swipeDirection ? `exit-${swipeDirection}` : ''}`;

                            return member.isMore ? (
                                <div key="more" className={`${cardClasses} more-card`}>
                                    <div className="more-card-content">
                                        <span className="plus-text">{t('leadership.more')}</span>
                                    </div>
                                </div>
                            ) : (
                                <div key={idx} className={cardClasses}>
                                    <div className="team-card-image-wrapper">
                                        <img src={member.image} alt={t(`leadership.${member.nameKey}`)} className="team-card-image" />
                                    </div>
                                    <div className="team-card-content">
                                        <h3 className="team-card-name">{t(`leadership.${member.nameKey}`)}</h3>
                                        <p className="team-card-role">{t(`leadership.${member.roleKey}`)}</p>
                                        <div className="team-card-actions">
                                            <div className="contact-icons">
                                                <a href={`tel:${member.phone}`} className="contact-icon-btn" aria-label={`Call ${t(`leadership.${member.nameKey}`)}`}><Phone size={18} /></a>
                                                <a href={`https://wa.me/${member.whatsapp}`} target="_blank" rel="noopener noreferrer" className="contact-icon-btn whatsapp-icon" aria-label={`WhatsApp ${t(`leadership.${member.nameKey}`)}`}><MessageCircle size={18} /></a>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    <div className="slider-nav-overlay">
                        <button className="slider-nav-btn prev" onClick={scrollLeftFn} aria-label="Previous"><ChevronLeft size={24} /></button>
                        <button className="slider-nav-btn next" onClick={scrollRight} aria-label="Next"><ChevronRight size={24} /></button>
                    </div>

                </div>
            </div>
        </section>
    );
};

export default MeetOurTeam;
