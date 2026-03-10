import { useTranslation } from 'react-i18next';
import './FinalCTA.css';

const FinalCTA = () => {
    const { t } = useTranslation();
    return (
        <section className="final-cta-section">
            <div className="final-cta-bg" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1600607686527-6fb886090705?q=80&w=2069&auto=format&fit=crop')" }}></div>
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
                        <button className="btn btn-primary">{t('cta.btn1')}</button>
                        <button className="btn btn-outline">{t('cta.btn2')}</button>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default FinalCTA;
