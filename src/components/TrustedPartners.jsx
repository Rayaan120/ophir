import { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import './TrustedPartners.css';

const TrustedPartners = () => {
    const scrollerRef = useRef(null);
    const { t } = useTranslation();

    const partners = Array.from({ length: 21 }, (_, i) => ({
        id: i + 1,
        src: `/${i + 1}.png`,
        alt: `Partner ${i + 1}`,
    }));

    useEffect(() => {
        if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
            addAnimation();
        }
    }, []);

    function addAnimation() {
        if (scrollerRef.current) {
            scrollerRef.current.setAttribute("data-animated", true);
            const scrollerInner = scrollerRef.current.querySelector(".partners-track-inner");
            const scrollerContent = Array.from(scrollerInner.children);

            scrollerContent.forEach((item) => {
                const duplicatedItem = item.cloneNode(true);
                duplicatedItem.setAttribute("aria-hidden", true);
                scrollerInner.appendChild(duplicatedItem);
            });
        }
    }

    return (
        <section className="partners-section">
            <div className="container">
                <div className="partners-wrapper rounded-container">

                    <div className="partners-header">
                        <div className="title-group">
                            <span className="subtitle-badge">{t('partners.networkBadge')}</span>
                            <h2 className="partners-title">{t('partners.title')}</h2>
                        </div>
                        <div className="header-divider"></div>
                        <p className="partners-subtitle">
                            {t('partners.subtitle')}
                        </p>
                    </div>

                    <div className="partners-carousel-area" ref={scrollerRef}>
                        <div className="partners-track-inner">
                            {partners.map(p => (
                                <div key={p.id} className="partner-card">
                                    <div className="partner-card-inner">
                                        <img
                                            src={p.src}
                                            alt={p.alt}
                                            className="partner-logo-img"
                                            draggable={false}
                                        />
                                        <div className="glow-effect"></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
};

export default TrustedPartners;
