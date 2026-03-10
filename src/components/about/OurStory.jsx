import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Play, X } from 'lucide-react';
import './About.css';

const OurStory = () => {
    const { t, i18n } = useTranslation();
    const navigate = useNavigate();
    const [modalOpen, setModalOpen] = useState(false);

    return (
        <section className="about-section our-story-bg">
            <div className="about-container story-container">

                {/* Left Column */}
                <div className="story-content">
                    <h2 className="section-title">{t('ourStory.title')}</h2>
                    <div className="gold-accent-line"></div>

                    <div className="story-text">
                        <section className="story-block">
                            <h3 className="story-subtitle">{t('ourStory.p1Title')}</h3>
                            <p>
                                {t('ourStory.p1Desc')}
                            </p>
                        </section>

                        <section className="story-block">
                            <h3 className="story-subtitle">{t('ourStory.p2Title')}</h3>
                            <p>
                                {t('ourStory.p2Desc')}
                            </p>
                            <ul className="story-list">
                                <li dangerouslySetInnerHTML={{ __html: t('ourStory.p2Li1') }} />
                                <li dangerouslySetInnerHTML={{ __html: t('ourStory.p2Li2') }} />
                            </ul>
                        </section>

                        <section className="story-block">
                            <h3 className="story-subtitle">{t('ourStory.p3Title')}</h3>
                            <p>
                                {t('ourStory.p3Desc1')}
                            </p>
                            <p>
                                {t('ourStory.p3Desc2')}
                            </p>
                        </section>

                        <section className="story-block">
                            <h3 className="story-subtitle">{t('ourStory.p4Title')}</h3>
                            <p className="forward-looking">
                                {t('ourStory.p4Desc')}
                            </p>
                        </section>
                    </div>

                    <button className="gold-outline-btn" onClick={() => navigate(`/${i18n.language}/contact`)}>{t('ourStory.btn')}</button>
                </div>

                {/* Right Column */}
                <div className="story-visual">
                    <div className="story-image-wrapper">
                        <img
                            src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
                            alt="Ophir Properties Office"
                            className="story-image"
                        />

                        <div className="video-overlay-card" onClick={() => setModalOpen(true)}>
                            <div className="play-icon-wrapper">
                                <Play size={20} className="gold-icon" fill="currentColor" />
                            </div>
                            <span className="video-overlay-text">{t('ourStory.play')}</span>
                        </div>
                    </div>
                </div>

            </div>

            {/* Video Modal */}
            {modalOpen && (
                <div className="video-modal-backdrop" onClick={() => setModalOpen(false)}>
                    <div className="video-modal-container" onClick={(e) => e.stopPropagation()}>
                        <button className="modal-close-btn" onClick={() => setModalOpen(false)}>
                            <X size={24} />
                        </button>
                        <div className="video-wrapper">
                            {/* Concept placeholder for an iframe */}
                            <div className="video-placeholder">
                                <Play size={64} className="gold-icon" fill="currentColor" />
                                <p>{t('ourStory.videoStatus')}</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
};

export default OurStory;
