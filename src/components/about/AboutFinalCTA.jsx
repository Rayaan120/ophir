import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import './About.css';

const AboutFinalCTA = () => {
    const { t, i18n } = useTranslation();
    const navigate = useNavigate();
    const lang = i18n.language || 'en';

    const renderWithAmp = (text) => {
        if (!text || typeof text !== 'string') return text;
        return text.split('&').map((part, i, arr) => (
            <React.Fragment key={i}>
                {part}
                {i < arr.length - 1 && <span className="normal-amp">&</span>}
            </React.Fragment>
        ));
    };

    return (
        <section className="about-final-cta">
            <div className="about-final-overlay"></div>

            <div className="about-final-content">
                <span className="final-cta-label">{renderWithAmp(t('aboutFinalCTA.label'))}</span>
                <h2 className="final-cta-title">{renderWithAmp(t('aboutFinalCTA.title'))}</h2>
                <p className="final-cta-desc">
                    {renderWithAmp(t('aboutFinalCTA.desc'))}
                </p>

                <div className="final-cta-actions">
                    <button className="gold-filled-btn" onClick={() => navigate(`/${lang}/contact`)}>{t('aboutFinalCTA.schedule')}</button>
                    <button className="gold-filled-btn" onClick={() => navigate(`/${lang}/new-projects`)}>{t('aboutFinalCTA.explore')}</button>
                </div>
            </div>
        </section>
    );
};

export default AboutFinalCTA;
