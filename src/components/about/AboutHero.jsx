import React from 'react';
import { useTranslation } from 'react-i18next';
import { Mouse } from 'lucide-react';
import './About.css';

const AboutHero = () => {
    const { t } = useTranslation();
    return (
        <section className="about-hero void-hero-section">
            <div className="void-hero-bg"></div>
            <div className="void-hero-vignette"></div>

            <div className="void-hero-content">
                <div className="void-hero-accent"></div>
                <h1 className="void-hero-title">{t('aboutHero.title')}</h1>
                <p className="void-hero-subtitle">
                    {t('aboutHero.subtitle1')} <br />
                    {t('aboutHero.subtitle2')}
                </p>
                <div className="void-hero-line"></div>
            </div>

            <div className="hero-bottom-bar"></div>

            <div className="hero-bottom-island">
                <div className="scroll-island-content">
                    <Mouse size={24} className="hero-mouse-icon" />
                    <span className="scroll-text">{t('aboutHero.scroll')}</span>
                </div>
            </div>
        </section>
    );
};

export default AboutHero;
