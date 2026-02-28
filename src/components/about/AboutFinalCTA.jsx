import React from 'react';
import './About.css';

const AboutFinalCTA = () => {
    return (
        <section className="about-final-cta">
            <div className="about-final-overlay"></div>

            <div className="about-final-content">
                <span className="final-cta-label">Partner With Ophir</span>
                <h2 className="final-cta-title">Begin Your Strategic Property Journey</h2>
                <p className="final-cta-desc">
                    Connect with our advisory team to discuss tailored opportunities and long-term investment strategies in the UAE's most exclusive markets.
                </p>

                <div className="final-cta-actions">
                    <button className="gold-filled-btn">Schedule a Consultation</button>
                    <button className="gold-outline-btn">Explore Properties</button>
                </div>
            </div>
        </section>
    );
};

export default AboutFinalCTA;
