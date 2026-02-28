import React, { useRef } from 'react';
import { Compass, Eye, Sparkles } from 'lucide-react';
import './About.css';

const OurMissionVision = () => {
    const containerRef = useRef(null);

    const handleMouseMove = (e) => {
        if (!containerRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        containerRef.current.style.setProperty('--mouse-x', `${x}px`);
        containerRef.current.style.setProperty('--mouse-y', `${y}px`);
    };

    return (
        <section
            className="about-section ethereal-mv-section"
            ref={containerRef}
            onMouseMove={handleMouseMove}
        >
            {/* Abstract animated background blobs */}
            <div className="ethereal-blob blob-1"></div>
            <div className="ethereal-blob blob-2"></div>

            <div className="ethereal-container">
                <div className="ethereal-header text-center">
                    <div className="ethereal-badge">
                        <Sparkles size={14} />
                        <span>Core Identity</span>
                    </div>
                    <h2 className="section-title">The Foundation</h2>
                </div>

                <div className="ethereal-cards-wrapper">

                    {/* Mission Card */}
                    <div className="ethereal-card mission-card">
                        <div className="card-border-glow"></div>
                        <div className="card-content">
                            <div className="card-icon-wrapper">
                                <Compass size={32} className="ethereal-icon" />
                            </div>
                            <h3 className="card-title">Our Mission</h3>
                            <p className="card-desc">
                                To deliver intelligent, strategic real estate advisory that goes beyond transactions. We aim to curate high-performing assets across the UAE while building enduring client relationships founded on profound trust, insight, and uncompromised integrity.
                            </p>
                            <ul className="card-list">
                                <li>Strategic, data-driven real estate advisory</li>
                                <li>Curating high-performing asset portfolios</li>
                                <li>Building enduring client relationships</li>
                            </ul>
                        </div>
                    </div>

                    {/* Vision Card */}
                    <div className="ethereal-card vision-card">
                        <div className="card-border-glow"></div>
                        <div className="card-content">
                            <div className="card-icon-wrapper">
                                <Eye size={32} className="ethereal-icon" />
                            </div>
                            <h3 className="card-title">Our Vision</h3>
                            <p className="card-desc">
                                To become the leading and most trusted independent strategic property advisory in the UAE. We strive to continually set new standards for intelligent investment guidance, redefining luxury real estate relationships through long-term value creation.
                            </p>
                            <ul className="card-list">
                                <li>Leading independent property advisory</li>
                                <li>Setting new standards for investment guidance</li>
                                <li>Redefining luxury through long-term value</li>
                            </ul>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
};

export default OurMissionVision;
