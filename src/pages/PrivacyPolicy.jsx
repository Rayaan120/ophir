import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import './PrivacyPolicy.css';

const PrivacyPolicy = () => {
    const { t } = useTranslation();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="privacy-policy-page">
            <div className="privacy-hero">
                <div className="container">
                    <h1 className="privacy-title">{t('privacyPolicy.title')}</h1>
                    <p className="privacy-subtitle">{t('privacyPolicy.lastUpdated')}</p>
                </div>
            </div>

            <div className="container">
                <div className="privacy-content">
                    <section className="policy-section">
                        <h2>{t('privacyPolicy.introTitle')}</h2>
                        <p>{t('privacyPolicy.introP1')}</p>
                        <p>{t('privacyPolicy.introP2')}</p>
                    </section>

                    <section className="policy-section">
                        <h2>{t('privacyPolicy.infoCollectTitle')}</h2>
                        <p>{t('privacyPolicy.infoCollectSub1')}</p>

                        <h3>{t('privacyPolicy.infoCollectType1')}</h3>
                        <ul>
                            <li>{t('privacyPolicy.infoCollectType1L1')}</li>
                            <li>{t('privacyPolicy.infoCollectType1L2')}</li>
                            <li>{t('privacyPolicy.infoCollectType1L3')}</li>
                            <li>{t('privacyPolicy.infoCollectType1L4')}</li>
                        </ul>

                        <h3>{t('privacyPolicy.infoCollectType2')}</h3>
                        <ul>
                            <li>{t('privacyPolicy.infoCollectType2L1')}</li>
                            <li>{t('privacyPolicy.infoCollectType2L2')}</li>
                            <li>{t('privacyPolicy.infoCollectType2L3')}</li>
                            <li>{t('privacyPolicy.infoCollectType2L4')}</li>
                        </ul>
                    </section>

                    <section className="policy-section">
                        <h2>{t('privacyPolicy.howWeUseTitle')}</h2>
                        <p>{t('privacyPolicy.howWeUseSub1')}</p>
                        <ul>
                            <li>{t('privacyPolicy.howWeUseL1')}</li>
                            <li>{t('privacyPolicy.howWeUseL2')}</li>
                            <li>{t('privacyPolicy.howWeUseL3')}</li>
                            <li>{t('privacyPolicy.howWeUseL4')}</li>
                        </ul>
                    </section>

                    <section className="policy-section">
                        <h2>{t('privacyPolicy.cookiesTitle')}</h2>
                        <p>{t('privacyPolicy.cookiesP1')}</p>
                        <p><strong>{t('privacyPolicy.cookiesP2')}</strong></p>
                        <p>{t('privacyPolicy.cookiesP3')}</p>
                    </section>

                    <section className="policy-section">
                        <h2>{t('privacyPolicy.sharingTitle')}</h2>
                        <p><strong>{t('privacyPolicy.sharingP1')}</strong></p>
                        <p>{t('privacyPolicy.sharingSub1')}</p>
                        <ul>
                            <li>{t('privacyPolicy.sharingL1')}</li>
                            <li>{t('privacyPolicy.sharingL2')}</li>
                            <li>{t('privacyPolicy.sharingL3')}</li>
                        </ul>
                    </section>

                    <section className="policy-section">
                        <h2>{t('privacyPolicy.securityTitle')}</h2>
                        <p>{t('privacyPolicy.securityP1')}</p>
                        <p>{t('privacyPolicy.securityP2')}</p>
                    </section>

                    <section className="policy-section">
                        <h2>{t('privacyPolicy.rightsTitle')}</h2>
                        <p>{t('privacyPolicy.rightsSub1')}</p>
                        <ul>
                            <li>{t('privacyPolicy.rightsL1')}</li>
                            <li>{t('privacyPolicy.rightsL2')}</li>
                            <li>{t('privacyPolicy.rightsL3')}</li>
                        </ul>
                        <p>{t('privacyPolicy.rightsP1')}</p>
                    </section>

                    <section className="policy-section">
                        <h2>{t('privacyPolicy.thirdpartyTitle')}</h2>
                        <p>{t('privacyPolicy.thirdpartyP1')}</p>
                    </section>

                    <section className="policy-section">
                        <h2>{t('privacyPolicy.updatesTitle')}</h2>
                        <p>{t('privacyPolicy.updatesP1')}</p>
                    </section>

                    <section className="policy-section">
                        <h2>{t('privacyPolicy.contactTitle')}</h2>
                        <p>{t('privacyPolicy.contactP1')}</p>
                        <a href={`mailto:${t('privacyPolicy.contactEmail')}`} className="privacy-contact-link">
                            {t('privacyPolicy.contactEmail')}
                        </a>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default PrivacyPolicy;
