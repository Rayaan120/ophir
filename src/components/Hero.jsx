import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import './Hero.css';

const Hero = () => {
    const [activeTab, setActiveTab] = useState('Buy');
    const [currentSlide, setCurrentSlide] = useState(0);

    // Search Panel States
    const [searchLocation, setSearchLocation] = useState('');
    const [propertyType, setPropertyType] = useState('All');
    const [bedrooms, setBedrooms] = useState('Any');
    const [priceSlider, setPriceSlider] = useState(0); // 0 = Any

    const navigate = useNavigate();
    const { t, i18n } = useTranslation();
    const lang = i18n.language || 'en';

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

    const handleSearchSubmit = () => {
        let route = 'buy';
        if (activeTab === 'Rent') route = 'rent';
        if (activeTab === 'Off-Plan') route = 'new-projects';

        const params = new URLSearchParams();
        if (searchLocation) params.append('search', searchLocation);
        if (propertyType && propertyType !== 'All') params.append('propertyType', propertyType);
        if (bedrooms && bedrooms !== 'Any') params.append('bedrooms', bedrooms);

        if (priceSlider > 0) {
            // Convert slider value (in Millions for Buy/Off-Plan, Thousands for Rent) to actual numeric limit
            // Buy/Off-Plan slider is 1M - 50M. Rent slider is 50k - 1M+
            if (activeTab === 'Rent') {
                const maxRent = priceSlider * 1000; // e.g., 50k, 100k

                // Map to RentPage dropdown values
                if (maxRent <= 100000) params.append('priceRange', '≤100k');
                else if (maxRent <= 200000) params.append('priceRange', '100k-200k');
                else if (maxRent <= 400000) params.append('priceRange', '200k-400k');
                else params.append('priceRange', '400k+');

            } else {
                // Buy & Off-Plan
                if (priceSlider <= 1) params.append('priceRange', '≤1M');
                else if (priceSlider <= 3) params.append('priceRange', '1M-3M');
                else if (priceSlider <= 5) params.append('priceRange', '3M-5M');
                else params.append('priceRange', '5M+');
            }
        }

        navigate(`/${lang}/${route}?${params.toString()}`);
    };

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
                    <span className="small-label">{t('home.heroArea')}</span>
                    <h1 className="hero-title">
                        {t('home.heroTitle').split('&').map((part, i, arr) => (
                            <span key={i}>
                                {part}
                                {i < arr.length - 1 && <span className="normal-amp">&</span>}
                            </span>
                        ))}
                        <br />
                    </h1>
                    <p className="hero-subtitle">
                        {t('home.heroSubtitle')}
                    </p>
                    <div className="hero-actions">
                        <button className="btn btn-primary" onClick={() => navigate(`/${lang}/buy`)}>{t('home.explorePortfolio')}</button>
                        <button className="btn btn-outline" onClick={() => navigate(`/${lang}/contact`)}>{t('home.getInTouch')}</button>
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
                                    {tab === 'Buy' ? t('heroSearch.tabBuy') : tab === 'Rent' ? t('heroSearch.tabRent') : t('heroSearch.tabOffPlan')}
                                </button>
                            ))}
                        </div>

                        <div className="search-body">
                            <div className="input-group">
                                <label>{t('heroSearch.locationLabel')}</label>
                                <input
                                    type="text"
                                    placeholder={t('heroSearch.locationPlaceholder')}
                                    value={searchLocation}
                                    onChange={(e) => setSearchLocation(e.target.value)}
                                />
                            </div>

                            <div className="search-row">
                                <div className="input-group">
                                    <label>{t('heroSearch.typeLabel')}</label>
                                    <select value={propertyType} onChange={(e) => setPropertyType(e.target.value)}>
                                        <option value="All">{t('heroSearch.typeAll')}</option>
                                        <option value="Villa">{t('heroSearch.typeVilla')}</option>
                                        <option value="Apartment">{t('heroSearch.typeApartment')}</option>
                                        <option value="Townhouse">{t('heroSearch.typeTownhouse')}</option>
                                    </select>
                                </div>
                                <div className="input-group">
                                    <label>{t('heroSearch.bedsLabel')}</label>
                                    <select value={bedrooms} onChange={(e) => setBedrooms(e.target.value)}>
                                        <option value="Any">{t('heroSearch.bedsAny')}</option>
                                        <option value="1">{t('heroSearch.beds1')}</option>
                                        <option value="2">{t('heroSearch.beds2')}</option>
                                        <option value="3">{t('heroSearch.beds3')}</option>
                                        <option value="4+">{t('heroSearch.beds4plus')}</option>
                                    </select>
                                </div>
                            </div>

                            <div className="input-group range-group">
                                <div className="range-header">
                                    <label>{t('heroSearch.priceLabel')}</label>
                                    <span className="gold-text">
                                        {priceSlider === 0 ? t('heroSearch.priceAny') : t('heroSearch.priceVal', { val: priceSlider })}
                                    </span>
                                </div>
                                <input
                                    type="range"
                                    className="gold-slider"
                                    min="0"
                                    max="50"
                                    value={priceSlider}
                                    onChange={(e) => setPriceSlider(Number(e.target.value))}
                                />
                            </div>

                            <button className="btn btn-primary btn-full search-btn" onClick={handleSearchSubmit}>
                                {activeTab === 'Buy' ? t('heroSearch.searchBtnBuy') : activeTab === 'Rent' ? t('heroSearch.searchBtnRent') : t('heroSearch.searchBtnOffPlan')}
                            </button>

                            <div className="advanced-filters-link">
                                <span>{t('heroSearch.advancedFilters')}</span>
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
