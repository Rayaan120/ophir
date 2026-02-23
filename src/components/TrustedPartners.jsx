import { useEffect, useRef } from 'react';
import './TrustedPartners.css';

const TrustedPartners = () => {
    const scrollerRef = useRef(null);

    const partners = [
        { id: 1, name: 'Emaar', logo: 'EMAAR' },
        { id: 2, name: 'Damac', logo: 'DAMAC' },
        { id: 3, name: 'Nakheel', logo: 'NAKHEEL' },
        { id: 4, name: 'Meraas', logo: 'MERAAS' },
        { id: 5, name: 'Omniyat', logo: 'OMNIYAT' },
        { id: 6, name: 'Sobha', logo: 'SOBHA' },
    ];

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
                            <span className="subtitle-badge">PREMIUM NETWORK</span>
                            <h2 className="partners-title">Our Trusted Partners</h2>
                        </div>
                        <div className="header-divider"></div>
                        <p className="partners-subtitle">
                            Collaborating with the UAE's most prestigious developers and financial institutions to secure exclusive opportunities.
                        </p>
                    </div>

                    <div className="partners-carousel-area" ref={scrollerRef}>
                        <div className="partners-track-inner">
                            {partners.map(p => (
                                <div key={p.id} className="partner-card">
                                    <div className="partner-card-inner">
                                        <span className="partner-logo-text">{p.logo}</span>
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
