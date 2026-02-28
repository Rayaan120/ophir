import React, { useState } from 'react';
import { Play, X } from 'lucide-react';
import './About.css';

const OurStory = () => {
    const [modalOpen, setModalOpen] = useState(false);

    return (
        <section className="about-section our-story-bg">
            <div className="about-container story-container">

                {/* Left Column */}
                <div className="story-content">
                    <h2 className="section-title">Our Story</h2>
                    <div className="gold-accent-line"></div>

                    <div className="story-text">
                        <p>
                            Ophir Properties was created to answer a fundamental need in the UAE real estate market: a true strategic advisory focused on discerning investors rather than transactional brokerage.
                        </p>
                        <p>
                            We differentiate ourselves through data-driven insights and access to exclusive, curated opportunities. Our approach relies on building enduring relationships, empowering our clients to make intelligent investment choices in a dynamic market.
                        </p>
                        <p className="forward-looking">
                            Guided by a commitment to uncompromised integrity, we continually drive innovation and robust, sustained value for our partners.
                        </p>
                    </div>

                    <button className="gold-outline-btn">Work With Ophir</button>
                </div>

                {/* Right Column */}
                <div className="story-visual">
                    <div className="story-image-wrapper">
                        <img
                            src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
                            alt="Ophir Properties Office"
                            className="story-image"
                        />

                        <div className="video-overlay-card" onClick={() => setModalOpen(true)}>
                            <div className="play-icon-wrapper">
                                <Play size={20} className="gold-icon" fill="currentColor" />
                            </div>
                            <span className="video-overlay-text">Play Our Story</span>
                        </div>
                    </div>
                </div>

            </div>

            {/* Video Modal */}
            {modalOpen && (
                <div className="video-modal-backdrop" onClick={() => setModalOpen(false)}>
                    <div className="video-modal-container" onClick={(e) => e.stopPropagation()}>
                        <button className="modal-close-btn" onClick={() => setModalOpen(false)}>
                            <X size={24} />
                        </button>
                        <div className="video-wrapper">
                            {/* Concept placeholder for an iframe */}
                            <div className="video-placeholder">
                                <Play size={64} className="gold-icon" fill="currentColor" />
                                <p>Strategic Advisory Video Playing</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
};

export default OurStory;
