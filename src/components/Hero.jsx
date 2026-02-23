import { useState, useEffect } from 'react';
import './Hero.css';

const Hero = () => {
    const [activeTab, setActiveTab] = useState('Buy');
    const [currentSlide, setCurrentSlide] = useState(0);

    const images = [
        'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=2070&auto=format&fit=crop', // Villa exterior
        'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=2075&auto=format&fit=crop', // Interior
        'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?q=80&w=2070&auto=format&fit=crop'  // Skyline waterfront
    ];

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % images.length);
        }, 6000);
        return () => clearInterval(timer);
    }, [images.length]);

    return (
        <div className="hero-section">
            {/* Background Slider */}
            {images.map((img, idx) => (
                <div
                    key={idx}
                    className={`hero-bg ${idx === currentSlide ? 'active' : ''}`}
                    style={{ backgroundImage: `url(${img})` }}
                ></div>
            ))}
            <div className="hero-overlay"></div>

            <div className="hero-container container">

                {/* Left Content */}
                <div className="hero-content animate-fade-in">
                    <span className="small-label">Ophir Properties – UAE Real Estate</span>
                    <h1 className="hero-title">
                        Your Wealth & Prosperity Partner<br />

                    </h1>
                    <p className="hero-subtitle">
                        End-to-end support for property buyers, sellers, and investors across the UAE.
                    </p>
                    <div className="hero-actions">
                        <button className="btn btn-primary">Explore Properties</button>
                        <button className="btn btn-outline">Book a Consultation</button>
                    </div>
                </div>

                {/* Right Content: Advanced Search Panel */}
                <div className="hero-search-wrapper animate-fade-in">
                    <div className="search-panel glass-panel rounded-container">

                        <div className="search-tabs">
                            {['Buy', 'Rent', 'Off-Plan'].map((tab) => (
                                <button
                                    key={tab}
                                    className={`search-tab ${activeTab === tab ? 'active' : ''}`}
                                    onClick={() => setActiveTab(tab)}
                                >
                                    {tab}
                                </button>
                            ))}
                        </div>

                        <div className="search-body">
                            <div className="input-group">
                                <label>Location</label>
                                <input type="text" placeholder="e.g. Dubai Marina, Palm Jumeirah" />
                            </div>

                            <div className="search-row">
                                <div className="input-group">
                                    <label>Property Type</label>
                                    <select defaultValue="">
                                        <option value="" disabled>Select Type</option>
                                        <option value="villa">Luxury Villa</option>
                                        <option value="apartment">Penthouse / Apartment</option>
                                        <option value="townhouse">Townhouse</option>
                                    </select>
                                </div>
                                <div className="input-group">
                                    <label>Bedrooms</label>
                                    <select defaultValue="">
                                        <option value="" disabled>Any</option>
                                        <option value="1">1 Bed</option>
                                        <option value="2">2 Beds</option>
                                        <option value="3">3 Beds</option>
                                        <option value="4+">4+ Beds</option>
                                    </select>
                                </div>
                            </div>

                            <div className="input-group range-group">
                                <div className="range-header">
                                    <label>Price Range</label>
                                    <span className="gold-text">AED 1M - 50M+</span>
                                </div>
                                <input type="range" className="gold-slider" min="1" max="50" defaultValue="25" />
                            </div>

                            <button className="btn btn-primary btn-full search-btn">Search {activeTab}</button>

                            <div className="advanced-filters-link">
                                <span>Advanced Filters</span>
                            </div>
                        </div>
                    </div>
                </div>

            </div>

            <div className="scroll-indicator">
                <div className="scroll-line">
                    <div className="scroll-dot"></div>
                </div>
                <span>Scroll to Explore</span>
            </div>
        </div>
    );
};

export default Hero;
