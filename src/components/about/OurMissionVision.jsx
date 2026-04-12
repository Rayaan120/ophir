import React from 'react';
import { useTranslation } from 'react-i18next';
import { Compass, Eye, Sparkles } from 'lucide-react';
import './About.css';

const OurMissionVision = () => {
    const { t } = useTranslation();




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
        <section className="about-section ethereal-mv-section">
            {/* Abstract animated background blobs */}
            <div className="ethereal-blob blob-1"></div>
            <div className="ethereal-blob blob-2"></div>

            <div className="ethereal-container">
                <div className="ethereal-header text-center">
                    <h2 className="section-title">{renderWithAmp(t('missionVision.title'))}</h2>
                    <p className="ethereal-quote">{renderWithAmp(t('missionVision.quote'))}</p>
                </div>

                <div className="ethereal-cards-wrapper">

                    {/* Vision Card */}
                    <div className="ethereal-card vision-card">

                        <div className="card-content">
                            <div className="card-icon-wrapper">
                                <Eye size={32} className="ethereal-icon" />
                            </div>
                            <h3 className="card-title">{t('missionVision.visionTitle')}</h3>
                            <p className="card-desc">
                                {t('missionVision.visionDesc')}
                            </p>
                        </div>
                    </div>

                    {/* Mission Card */}
                    <div className="ethereal-card mission-card">

                        <div className="card-content">
                            <div className="card-icon-wrapper">
                                <Compass size={32} className="ethereal-icon" />
                            </div>
                            <h3 className="card-title">{t('missionVision.missionTitle')}</h3>
                            <p className="card-desc">
                                {t('missionVision.missionDesc')}
                            </p>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
};

export default OurMissionVision;
