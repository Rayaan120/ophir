import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import './FinalCTA.css';

const FinalCTA = () => {
    const { t, i18n } = useTranslation();
    const navigate = useNavigate();
    const lang = i18n.language || 'en';

    return (
        <section className="final-cta-section">
            <div className="final-cta-bg" style={{ backgroundImage: "url('/offer.jpg')" }}></div>
            <div className="final-cta-overlay"></div>

            <div className="container final-cta-container">
                <div className="final-cta-content animate-fade-in">
                    <span className="small-label" style={{ textAlign: 'center', margin: '0 auto 16px auto' }}>{t('cta.label')}</span>
                    <h2 className="cta-title">
                        {t('cta.title1')}<br />{t('cta.title2')}
                    </h2>
                    <p className="cta-subtitle">
                        {t('cta.desc')}
                    </p>
                    <div className="cta-actions">
                        <button className="btn btn-primary" onClick={() => navigate(`/${lang}/contact`)}>{t('cta.btn1')}</button>
                        <button className="btn btn-outline" onClick={() => window.open('https://wa.me/971000000000', '_blank')}>{t('cta.btn2')}</button>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default FinalCTA;
