import { TrendingUp, Key, ShieldCheck, ArrowUpRight } from 'lucide-react';
import './WhyChooseOphir.css';

const WhyChooseOphir = () => {
    const features = [
        {
            num: '01',
            icon: <TrendingUp size={24} />,
            title: 'Strategic Investment Advisory',
            desc: 'Expert guidance tailored for high-net-worth investors seeking capital growth and premium yields.'
        },
        {
            num: '02',
            icon: <Key size={24} />,
            title: 'Exclusive & Off-Market Listings',
            desc: 'Access to highly sought-after properties before they reach the public market.'
        },
        {
            num: '03',
            icon: <ShieldCheck size={24} />,
            title: 'End-to-End Transaction Management',
            desc: 'Seamless execution from initial search to bespoke legal and financial structuring.'
        }
    ];

    return (
        <section className="why-choose-section section-padding">
            {/* Ambient Background Glow */}
            <div className="ambient-glow glow-1"></div>
            <div className="ambient-glow glow-2"></div>

            <div className="container relative-z">
                <div className="section-header-centered">
                    <span className="gold-subtitle">The Ophir Advantage</span>
                    <h2 className="section-title">
                        Why Choose <span className="gold-text-gradient">Ophir</span>
                    </h2>
                    <p className="intro-line-centered">
                        Elevating real estate beyond transactions into strategic asset acquisition for the discerning few.
                    </p>
                </div>

                <div className="why-choose-bento">

                    {/* Main Image Feature */}
                    <div className="bento-image-hero">
                        <div className="bento-image" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=2075&auto=format&fit=crop')" }}></div>
                        <div className="bento-image-overlay"></div>
                        <div className="bento-quote-content glass-panel">
                            <span className="quote-icon">“</span>
                            <p className="quote-text">
                                We don't just sell homes; we secure legacy assets for the discerning few.
                            </p>
                            <div className="quote-author">
                                <span className="author-line"></span>
                                <span>Managing Director, Ophir Properties</span>
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
                                    <h3 className="feature-title">{feature.title}</h3>
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
