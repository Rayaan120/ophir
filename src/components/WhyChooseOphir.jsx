import { useRef } from 'react';
import { useScroll, useTransform, motion } from 'framer-motion';
import { TrendingUp, Key, ShieldCheck, ArrowUpRight, Handshake, Globe } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import './WhyChooseOphir.css';

const WhyChooseOphir = () => {
    const { t } = useTranslation();
    const sectionRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: sectionRef,
        offset: ["start end", "end start"]
    });

    const isMobile = typeof window !== 'undefined' ? window.innerWidth <= 1024 : false;
    const y = useTransform(scrollYProgress, [0, 1], isMobile ? ["0%", "0%"] : ["-10%", "10%"]);

    const features = [
        {
            num: '01',
            icon: <TrendingUp size={24} />,
            title: t('whyOphir.f1Title'),
            desc: t('whyOphir.f1Desc')
        },
        {
            num: '02',
            icon: <Key size={24} />,
            title: t('whyOphir.f2Title'),
            desc: t('whyOphir.f2Desc')
        },
        {
            num: '03',
            icon: <ShieldCheck size={24} />,
            title: t('whyOphir.f3Title'),
            desc: t('whyOphir.f3Desc')
        },
        {
            num: '04',
            icon: <Handshake size={24} />,
            title: t('whyOphir.f4Title'),
            desc: t('whyOphir.f4Desc')
        },
        {
            num: '05',
            icon: <Globe size={24} />,
            title: t('whyOphir.f5Title'),
            desc: t('whyOphir.f5Desc')
        }
    ];

    return (
        <section className="why-choose-section section-padding" ref={sectionRef}>
            {/* Ambient Background Glows wrapped to allow sticky to work (avoid overflow: hidden on section) */}
            <div className="glow-wrapper">
                <div className="ambient-glow glow-1"></div>
                <div className="ambient-glow glow-2"></div>
            </div>

            <div className="container relative-z">
                <div className="section-header-centered">
                    <span className="gold-subtitle">{t('whyOphir.subtitle')}</span>
                    <h2 className="section-title">
                        {t('whyOphir.title1')} <span className="gold-text-gradient">{t('whyOphir.title2')}</span>
                    </h2>
                    <p className="intro-line-centered">
                        {t('whyOphir.intro')}
                    </p>
                </div>

                <div className="why-choose-bento">

                    {/* Main Image Feature */}
                    <div className="bento-image-hero">
                        <motion.div
                            className="bento-image"
                            style={{
                                backgroundImage: "url('/home/address2.png')",
                                y: y
                            }}
                        ></motion.div>
                        <div className="bento-image-overlay"></div>
                        <div className="bento-quote-content glass-panel">
                            <span className="quote-icon">“</span>
                            <p className="quote-text">
                                {t('whyOphir.quoteText')}
                            </p>
                            <div className="quote-author">
                                <span className="author-line"></span>
                                <span className="gold-text">{t('whyOphir.quoteAuthor')}</span>
                            </div>
                        </div>
                    </div>

                    {/* Features List */}
                    <div className="bento-features">
                        {features.map((feature, idx) => (
                            <div key={idx} className="bento-feature-card">
                                <div className="feature-number">{feature.num}</div>
                                <div className="feature-content">
                                    <div className="feature-icon-wrapper">
                                        {feature.icon}
                                    </div>
                                    <h3 className="feature-title">
                                        {feature.title.includes('&') ?
                                            feature.title.split('&').map((text, i, arr) => (
                                                <span key={i}>
                                                    {text}
                                                    {i < arr.length - 1 && <span className="normal-amp">&</span>}
                                                </span>
                                            )) :
                                            feature.title
                                        }
                                    </h3>
                                    <p className="feature-desc">{feature.desc}</p>
                                </div>
                                <ArrowUpRight className="explore-icon" size={20} />
                            </div>
                        ))}
                    </div>

                </div>
            </div>
        </section>
    );
};

export default WhyChooseOphir;
