import React from 'react';
import { Mouse } from 'lucide-react';
import './About.css';

const AboutHero = () => {
    return (
        <section className="about-hero void-hero-section">
            <div className="void-hero-bg"></div>
            <div className="void-hero-vignette"></div>

            <div className="void-hero-content">
                <div className="void-hero-accent"></div>
                <h1 className="void-hero-title">About Our Company</h1>
                <p className="void-hero-subtitle">
                    Your strategic advisory and investment partner in UAE real estate. <br />
                    Building long-term relationships through trust, market intelligence, and curated opportunities.
                </p>
                <div className="void-hero-line"></div>
            </div>

            <div className="hero-bottom-bar"></div>

            <div className="hero-bottom-island">
                <div className="scroll-island-content">
                    <Mouse size={24} className="hero-mouse-icon" />
                    <span className="scroll-text">Scroll Down To Discover</span>
                </div>
            </div>
        </section>
    );
};

export default AboutHero;
