import React, { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { ChevronLeft, ChevronRight, Phone, MessageCircle } from 'lucide-react';
import './About.css';

const MeetOurLeadership = () => {
    const { t } = useTranslation();
    const sliderRef = useRef(null);

    const scrollLeft = () => {
        if (sliderRef.current) {
            sliderRef.current.scrollBy({ left: -350, behavior: 'smooth' });
        }
    };

    const scrollRight = () => {
        if (sliderRef.current) {
            sliderRef.current.scrollBy({ left: 350, behavior: 'smooth' });
        }
    };

    // phone: international format for tel: links, whatsapp: number without + or spaces
    const team = [
        { nameKey: 'm1Name', roleKey: 'm1Role', image: '/team/ziad .png', phone: '+971501234567', whatsapp: '971501234567' },
        { nameKey: 'm2Name', roleKey: 'm2Role', image: '/team/rami.png', phone: '+971501234568', whatsapp: '971501234568' },
        { nameKey: 'm3Name', roleKey: 'm3Role', image: '/team/alexandra.png', phone: '+971501234569', whatsapp: '971501234569' },
        { nameKey: 'm4Name', roleKey: 'm4Role', image: '/team/zaydoon.png', phone: '+971501234570', whatsapp: '971501234570' },
        { nameKey: 'm5Name', roleKey: 'm5Role', image: '/team/zelia.png', phone: '+971501234571', whatsapp: '971501234571' },
        { nameKey: 'm6Name', roleKey: 'm6Role', image: '/team/nader.png', phone: '+971501234572', whatsapp: '971501234572' },
        { nameKey: 'm7Name', roleKey: 'm7Role', image: '/team/maen.png', phone: '+971501234573', whatsapp: '971501234573' },
        { nameKey: 'm8Name', roleKey: 'm8Role', image: '/team/ivan.png', phone: '+971501234574', whatsapp: '971501234574' },
        { nameKey: 'm9Name', roleKey: 'm9Role', image: '/team/lia.png', phone: '+971501234575', whatsapp: '971501234575' },
        { nameKey: 'm10Name', roleKey: 'm10Role', image: '/team/maryam.png', phone: '+971501234576', whatsapp: '971501234576' },
        { nameKey: 'm11Name', roleKey: 'm11Role', image: '/team/basak.png', phone: '+971501234577', whatsapp: '971501234577' },
    ];

    return (
        <section className="about-section team-section-bg">
            <div className="about-container team-layout">

                {/* Left Panel */}
                <div className="team-intro">
                    <h2 className="section-title">{t('leadership.title')}</h2>
                    <div className="gold-accent-line"></div>
                    <p className="team-desc">
                        {t('leadership.desc')}
                    </p>

                    <div className="slider-nav">
                        <button className="slider-nav-btn" onClick={scrollLeft} aria-label="Previous">
                            <ChevronLeft size={24} />
                        </button>
                        <button className="slider-nav-btn" onClick={scrollRight} aria-label="Next">
                            <ChevronRight size={24} />
                        </button>
                    </div>
                </div>

                {/* Right Slider */}
                <div className="team-slider-container">
                    <div className="team-slider" ref={sliderRef}>
                        {team.map((member, idx) => (
                            <div key={idx} className="team-card">
                                <div className="team-card-image-wrapper">
                                    <img src={member.image} alt={t(`leadership.${member.nameKey}`)} className="team-card-image" />
                                </div>
                                <div className="team-card-content">
                                    <h3 className="team-card-name">{t(`leadership.${member.nameKey}`)}</h3>
                                    <p className="team-card-role">{t(`leadership.${member.roleKey}`)}</p>

                                    <div className="team-card-actions">
                                        <button className="view-details-btn">{t('leadership.viewBtn')}</button>
                                        <div className="contact-icons">
                                            <a
                                                href={`tel:${member.phone}`}
                                                className="contact-icon-btn"
                                                aria-label={`Call ${t(`leadership.${member.nameKey}`)}`}
                                            >
                                                <Phone size={18} />
                                            </a>
                                            <a
                                                href={`https://wa.me/${member.whatsapp}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="contact-icon-btn whatsapp-icon"
                                                aria-label={`WhatsApp ${t(`leadership.${member.nameKey}`)}`}
                                            >
                                                <MessageCircle size={18} />
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

            </div>
        </section>
    );
};

export default MeetOurLeadership;
