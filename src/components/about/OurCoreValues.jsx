import React, { useState } from 'react';
import { Target, Shield, Users, Globe } from 'lucide-react';
import './About.css';

const OurCoreValues = () => {
    const [activeIndex, setActiveIndex] = useState(0);

    const values = [
        {
            title: "Strategic Intelligence",
            description: "We deploy data-driven insights and rigorous market analysis to uncover opportunities that others overlook, ensuring informed, high-conviction investment decisions.",
            icon: Target,
            number: "01",
            image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80"
        },
        {
            title: "Integrity Without Compromise",
            description: "Transparency and ethical practice form our foundation. We prioritize our clients' long-term success over short-term transactional gains.",
            icon: Shield,
            number: "02",
            image: "https://images.unsplash.com/photo-1577495508048-b635879837f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80"
        },
        {
            title: "Client-Centric Commitment",
            description: "Our advisory service is bespoke. We spend the time to understand your unique aspirations, crafting strategies tailored specifically to your wealth-building goals.",
            icon: Users,
            number: "03",
            image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80"
        },
        {
            title: "Sustainable Value Creation",
            description: "We focus on assets and master plans with enduring appeal and growth potential, building resilient portfolios for generations to come.",
            icon: Globe,
            number: "04",
            image: "https://images.unsplash.com/photo-1518398046578-8cca57782e17?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80"
        }
    ];

    return (
        <section className="about-section interactive-values-section">
            <div className="about-container interactive-values-container">

                {/* Left Side: Navigation List */}
                <div className="interactive-values-nav">
                    <div className="values-header-left">
                        <h2 className="section-title">Our Core Values</h2>
                        <div className="gold-accent-line"></div>
                        <p className="values-subtitle-left">The guiding principles behind our curated real estate advisory.</p>
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
                                    <h3 className="glass-title">{val.title}</h3>
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
