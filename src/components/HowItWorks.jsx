import React from 'react';
import { Search, Eye, FileCheck } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import './HowItWorks.css';

const HowItWorks = () => {
    const { t, i18n } = useTranslation();
    const navigate = useNavigate();
    const lang = i18n.language || 'en';
    const phases = [
        {
            id: '01',
            title: t('howItWorks.p1Title'),
            points: [
                {
                    subtitle: t('howItWorks.p1s1Title'),
                    text: t('howItWorks.p1s1Desc')
                },
                {
                    subtitle: t('howItWorks.p1s2Title'),
                    text: t('howItWorks.p1s2Desc')
                }
            ]
        },
        {
            id: '02',
            title: t('howItWorks.p2Title'),
            points: [
                {
                    subtitle: t('howItWorks.p2s1Title'),
                    text: t('howItWorks.p2s1Desc')
                },
                {
                    subtitle: t('howItWorks.p2s2Title'),
                    text: t('howItWorks.p2s2Desc')
                }
            ]
        },
        {
            id: '03',
            title: t('howItWorks.p3Title'),
            points: [
                {
                    subtitle: t('howItWorks.p3s1Title'),
                    text: t('howItWorks.p3s1Desc')
                },
                {
                    subtitle: t('howItWorks.p3s2Title'),
                    text: t('howItWorks.p3s2Desc')
                }
            ]
        }
    ];

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
        <section className="process-section section-padding">
            <div className="container">
                <div className="process-header-centered">
                    <div className="gold-accent-line mx-auto"></div>
                    <h2 className="section-title">{renderWithAmp(t('howItWorks.title'))}</h2>
                    <p className="process-desc">
                        {t('howItWorks.desc')}
                    </p>
                </div>

                <div className="process-phases-row">
                    {phases.map((phase, idx) => (
                        <div key={idx} className="phase-card-landscape glass-panel">
                            <div className="phase-header">
                                <span className="phase-id">{t('howItWorks.phaseLabel')} {phase.id}</span>
                                <h3 className="phase-title">{renderWithAmp(phase.title)}</h3>
                            </div>
                            <div className="phase-points">
                                {phase.points.map((point, pIdx) => (
                                    <div key={pIdx} className="phase-subpoint">
                                        <h4 className="subpoint-title">{renderWithAmp(point.subtitle)}</h4>
                                        <p className="subpoint-text">{point.text}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                <div className="process-actions">
                    <button className="btn btn-primary" onClick={() => navigate(`/${lang}/contact`)}>
                        {t('howItWorks.btn')}
                    </button>
                    <p className="process-footer-note">
                        {t('howItWorks.footerNote')}
                    </p>
                </div>
            </div>
        </section>
    );
};

export default HowItWorks;
