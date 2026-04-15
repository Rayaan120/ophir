import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Search, ChevronDown, SlidersHorizontal } from 'lucide-react';
import './Hero.css';

const Hero = () => {
    const [activeTab, setActiveTab] = useState('Buy');
    const [showFilters, setShowFilters] = useState(false);

    // Search Panel States
    const [searchLocation, setSearchLocation] = useState('');
    const [propertyType, setPropertyType] = useState('All');
    const [bedrooms, setBedrooms] = useState('Any');
    const [priceSlider, setPriceSlider] = useState(0); // 0 = Any

    const navigate = useNavigate();
    const { t, i18n } = useTranslation();
    const lang = i18n.language || 'en';

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

    // Helper to fix specific kerning issues (like "TE" in Estate)
    const renderTitleWithKerning = (text) => {
        // Regex to find "TE" and wrap "T" to add micro-spacing
        const parts = text.split(/(te)/gi);
        return parts.map((part, index) => {
            if (part.toLowerCase() === 'te') {
                return (
                    <span key={index}>
                        <span className="kern-te">{part.charAt(0)}</span>
                        {part.charAt(1)}
                    </span>
                );
            }
            return part;
        });
    };

    return (
        <div className="hero-section">
            {/* Static Hero Background */}
            <div
                className="hero-bg active"
                style={{ backgroundImage: 'url("/HERO Dubai skyline.jpg")' }}
            ></div>
            <div className="hero-overlay"></div>

            <div className="hero-container container">

                {/* Centered Hero Content */}
                <div className="hero-content centered animate-fade-in">
                    <h1 className="hero-title">
                        {t('home.heroTitle').split('&').map((part, i, arr) => (
                            <span key={i}>
                                {renderTitleWithKerning(part)}
                                {i < arr.length - 1 && <span className="normal-amp">&</span>}
                            </span>
                        ))}
                    </h1>
                    <p className="hero-subtitle">
                        {t('home.heroSubtitle')}
                    </p>

                    {/* Modern Search Bar */}
                    <div className="modern-search-bar-wrapper animate-fade-in">
                        <div className="modern-search-bar">
                            <div className="category-select">
                                <select value={activeTab} onChange={(e) => setActiveTab(e.target.value)}>
                                    <option value="Buy">{t('heroSearch.tabBuy')}</option>
                                    <option value="Rent">{t('heroSearch.tabRent')}</option>
                                    <option value="Off-Plan">{t('heroSearch.tabOffPlan')}</option>
                                </select>
                                <ChevronDown size={14} className="chevron-icon" />
                            </div>

                            <div className="divider"></div>

                            <div className="search-input-group">
                                <Search size={20} className="search-icon" />
                                <input
                                    type="text"
                                    placeholder={t('heroSearch.modernPlaceholder')}
                                    value={searchLocation}
                                    onChange={(e) => setSearchLocation(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && handleSearchSubmit()}
                                />
                            </div>

                            <button
                                className={`advanced-toggle ${showFilters ? 'active' : ''}`}
                                onClick={() => setShowFilters(!showFilters)}
                                title={t('heroSearch.filterLabel')}
                            >
                                <SlidersHorizontal size={20} />
                                <span>{t('heroSearch.filterLabel')}</span>
                            </button>

                            <button className="modern-search-submit" onClick={handleSearchSubmit}>
                                {t('heroSearch.searchBtn')}
                            </button>
                        </div>

                        {/* Dropdown Filters */}
                        {showFilters && (
                            <div className="modern-filters-dropdown glass-panel">
                                <div className="filter-grid">
                                    <div className="filter-item">
                                        <label>{t('heroSearch.typeLabel')}</label>
                                        <select value={propertyType} onChange={(e) => setPropertyType(e.target.value)}>
                                            <option value="All">{t('heroSearch.typeAll')}</option>
                                            <option value="Villa">{t('heroSearch.typeVilla')}</option>
                                            <option value="Apartment">{t('heroSearch.typeApartment')}</option>
                                            <option value="Townhouse">{t('heroSearch.typeTownhouse')}</option>
                                        </select>
                                    </div>

                                    <div className="filter-item">
                                        <label>{t('heroSearch.bedsLabel')}</label>
                                        <select value={bedrooms} onChange={(e) => setBedrooms(e.target.value)}>
                                            <option value="Any">{t('heroSearch.bedsAny')}</option>
                                            <option value="1">{t('heroSearch.beds1')}</option>
                                            <option value="2">{t('heroSearch.beds2')}</option>
                                            <option value="3">{t('heroSearch.beds3')}</option>
                                            <option value="4+">{t('heroSearch.beds4plus')}</option>
                                        </select>
                                    </div>

                                    <div className="filter-item full-width">
                                        <div className="range-header">
                                            <label>{t('heroSearch.priceLabel')}</label>
                                            <span className="price-val">
                                                {priceSlider === 0 ? t('heroSearch.priceAny') : t('heroSearch.priceVal', { val: priceSlider })}
                                            </span>
                                        </div>
                                        <input
                                            type="range"
                                            className="modern-slider"
                                            min="0"
                                            max="50"
                                            value={priceSlider}
                                            onChange={(e) => setPriceSlider(Number(e.target.value))}
                                        />
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="hero-actions">
                        <button className="btn btn-outline" onClick={() => navigate(`/${lang}/contact`)}>
                            <span className="gold-text">{t('home.getInTouch')}</span>
                        </button>
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
