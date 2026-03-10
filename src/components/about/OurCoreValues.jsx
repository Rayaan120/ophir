import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { BarChart3, ShieldCheck, Cpu, Award } from 'lucide-react';
import './About.css';

const OurCoreValues = () => {
    const { t } = useTranslation();
    const [activeIndex, setActiveIndex] = useState(0);

    const renderWithAmp = (text) => {
        if (!text || typeof text !== 'string') return text;
        return text.split('&').map((part, i, arr) => (
            <React.Fragment key={i}>
                {part}
                {i < arr.length - 1 && <span className="normal-amp">&</span>}
            </React.Fragment>
        ));
    };

    const values = [
        {
            title: t('coreValues.v1Title'),
            description: t('coreValues.v1Desc'),
            icon: BarChart3,
            number: "01",
            image: "/value1.jpg"
        },
        {
            title: t('coreValues.v2Title'),
            description: t('coreValues.v2Desc'),
            icon: ShieldCheck,
            number: "02",
            image: "/value2.jpg"
        },
        {
            title: t('coreValues.v3Title'),
            description: t('coreValues.v3Desc'),
            icon: Cpu,
            number: "03",
            image: "/value3.jpg"
        },
        {
            title: t('coreValues.v4Title'),
            description: t('coreValues.v4Desc'),
            icon: Award,
            number: "04",
            image: "/value4.jpg"
        }
    ];

    return (
        <section className="about-section interactive-values-section">
            <div className="about-container interactive-values-container">

                {/* Left Side: Navigation List */}
                <div className="interactive-values-nav">
                    <div className="values-header-left">
                        <h2 className="section-title">{renderWithAmp(t('coreValues.title'))}</h2>
                        <div className="gold-accent-line"></div>
                        <p className="values-quote-left">{renderWithAmp(t('coreValues.quote'))}</p>
                        <p className="values-subtitle-left">{renderWithAmp(t('coreValues.subtitle'))}</p>
                    </div>

                    <div className="values-list">
                        {values.map((val, idx) => (
                            <div
                                key={idx}
                                className={`value-list-item ${activeIndex === idx ? 'active' : ''}`}
                                onMouseEnter={() => setActiveIndex(idx)}
                            >
                                <span className="value-list-number">{val.number}</span>
                                <span className="value-list-title">{val.title}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right Side: Visual Display */}
                <div className="interactive-values-display">
                    {/* Background Images */}
                    <div className="values-images-wrapper">
                        {values.map((val, idx) => (
                            <img
                                key={`img-${idx}`}
                                src={val.image}
                                alt={val.title}
                                className={`value-bg-image ${activeIndex === idx ? 'active' : ''}`}
                            />
                        ))}
                        <div className="value-image-overlay"></div>
                    </div>

                    {/* Glassmorphism Detail Card */}
                    <div className="value-glass-card">
                        {values.map((val, idx) => {
                            const Icon = val.icon;
                            return (
                                <div
                                    key={`desc-${idx}`}
                                    className={`glass-card-content ${activeIndex === idx ? 'active' : ''}`}
                                >
                                    <div className="glass-icon-wrapper">
                                        <Icon size={32} className="glass-icon" />
                                    </div>
                                    <h3 className="glass-title">{renderWithAmp(val.title)}</h3>
                                    <p className="glass-desc">{val.description}</p>
                                </div>
                            );
                        })}
                    </div>
                </div>

            </div>
        </section>
    );
};

export default OurCoreValues;
